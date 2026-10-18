// FocusDesk 96 - Mac helper
//
// A tiny command-line program that reads Apple Calendar events and Apple Reminders
// (read-only) and prints them as JSON. FocusDesk runs it only when you ask it to, and
// macOS shows its own permission prompt the first time. It never writes to your calendar
// or reminders, and it never connects to the internet.
//
// Commands (arguments are plain numbers and identifiers; the output is one line of JSON):
//   status                         permission state for calendars and reminders
//   calendars                      list calendars (asks for permission if needed)
//   events  <fromMs> <toMs> [ids]  events between two times (milliseconds since 1970)
//   lists                          list the Reminders lists (asks for permission if needed)
//   reminders [ids]                open reminders, plus ones finished in the last 14 days

import Foundation
import EventKit

let store = EKEventStore()

/// A small shared box, so the waiting code and the callback don't fight over a captured variable.
final class Box<T>: @unchecked Sendable {
    var value: T
    init(_ value: T) { self.value = value }
}

func emit(_ object: [String: Any]) {
    if let data = try? JSONSerialization.data(withJSONObject: object, options: []),
       let text = String(data: data, encoding: .utf8) {
        print(text)
    } else {
        print("{\"ok\":false,\"error\":\"Couldn't write the answer.\"}")
    }
    fflush(stdout)
}

func fail(_ message: String) -> Never {
    emit(["ok": false, "error": message])
    exit(1)
}

func ms(_ date: Date) -> Int {
    return Int((date.timeIntervalSince1970 * 1000.0).rounded())
}

func stateName(_ status: EKAuthorizationStatus) -> String {
    switch status {
    case .notDetermined: return "notDetermined"
    case .restricted: return "restricted"
    case .denied: return "denied"
    case .authorized: return "authorized"
    default:
        // .fullAccess and .writeOnly exist on macOS 14 and later
        if #available(macOS 14.0, *) {
            if status == .fullAccess { return "authorized" }
            if status == .writeOnly { return "writeOnly" }
        }
        return "unknown"
    }
}

func hasReadAccess(_ type: EKEntityType) -> Bool {
    let s = stateName(EKEventStore.authorizationStatus(for: type))
    return s == "authorized"
}

/// Asks macOS for permission if we don't have it yet. Waits up to two minutes for the person to answer.
func ensureAccess(_ type: EKEntityType) -> Bool {
    if hasReadAccess(type) { return true }
    let status = stateName(EKEventStore.authorizationStatus(for: type))
    if status == "denied" || status == "restricted" { return false }
    let semaphore = DispatchSemaphore(value: 0)
    let granted = Box(false)
    let done: @Sendable (Bool, Error?) -> Void = { ok, _ in
        granted.value = ok
        semaphore.signal()
    }
    if #available(macOS 14.0, *) {
        if type == .event {
            store.requestFullAccessToEvents(completion: done)
        } else {
            store.requestFullAccessToReminders(completion: done)
        }
    } else {
        store.requestAccess(to: type, completion: done)
    }
    _ = semaphore.wait(timeout: .now() + 120)
    return granted.value && hasReadAccess(type)
}

func pickCalendars(_ type: EKEntityType, _ idsArg: String?) -> [EKCalendar] {
    let all = store.calendars(for: type)
    guard let raw = idsArg, !raw.isEmpty else { return all }
    let wanted = Set(raw.split(separator: ",").map { String($0) })
    return all.filter { wanted.contains($0.calendarIdentifier) }
}

func describe(_ calendar: EKCalendar) -> [String: Any] {
    return [
        "id": calendar.calendarIdentifier,
        "title": calendar.title,
        "account": calendar.source?.title ?? "",
    ]
}

let args = Array(CommandLine.arguments.dropFirst())
guard let command = args.first else { fail("No command given.") }

switch command {

case "status":
    emit([
        "ok": true,
        "events": stateName(EKEventStore.authorizationStatus(for: .event)),
        "reminders": stateName(EKEventStore.authorizationStatus(for: .reminder)),
    ])

case "calendars":
    guard ensureAccess(.event) else { fail("Calendar access wasn't allowed. You can change this in System Settings > Privacy & Security > Calendars.") }
    emit(["ok": true, "calendars": store.calendars(for: .event).map(describe)])

case "lists":
    guard ensureAccess(.reminder) else { fail("Reminders access wasn't allowed. You can change this in System Settings > Privacy & Security > Reminders.") }
    emit(["ok": true, "lists": store.calendars(for: .reminder).map(describe)])

case "events":
    guard args.count >= 3, let from = Double(args[1]), let to = Double(args[2]), to > from else { fail("Events needs a start and an end time.") }
    guard ensureAccess(.event) else { fail("Calendar access wasn't allowed. You can change this in System Settings > Privacy & Security > Calendars.") }
    let calendars = pickCalendars(.event, args.count > 3 ? args[3] : nil)
    if calendars.isEmpty { emit(["ok": true, "events": [Any]()]); exit(0) }
    let start = Date(timeIntervalSince1970: from / 1000.0)
    let end = Date(timeIntervalSince1970: to / 1000.0)
    let predicate = store.predicateForEvents(withStart: start, end: end, calendars: calendars)
    var out: [[String: Any]] = []
    for event in store.events(matching: predicate).prefix(3000) {
        let begin = ms(event.startDate)
        let finish = ms(event.endDate)
        let identity = event.eventIdentifier ?? event.title ?? "event"
        out.append([
            // one id per occurrence, so repeating events get one entry per day
            "uid": identity + "@" + String(begin),
            "title": event.title ?? "",
            "calendar": event.calendar?.title ?? "",
            "start": begin,
            "end": finish,
            "allDay": event.isAllDay,
        ])
    }
    emit(["ok": true, "events": out])

case "reminders":
    guard ensureAccess(.reminder) else { fail("Reminders access wasn't allowed. You can change this in System Settings > Privacy & Security > Reminders.") }
    let lists = pickCalendars(.reminder, args.count > 1 ? args[1] : nil)
    if lists.isEmpty { emit(["ok": true, "reminders": [Any]()]); exit(0) }
    let found = Box<[EKReminder]>([])
    let gate = DispatchSemaphore(value: 0)
    store.fetchReminders(matching: store.predicateForIncompleteReminders(withDueDateStarting: nil, ending: nil, calendars: lists)) { items in
        found.value.append(contentsOf: items ?? [])
        gate.signal()
    }
    _ = gate.wait(timeout: .now() + 60)
    let since = Date().addingTimeInterval(-14 * 86400)
    let gate2 = DispatchSemaphore(value: 0)
    store.fetchReminders(matching: store.predicateForCompletedReminders(withCompletionDateStarting: since, ending: Date(), calendars: lists)) { items in
        found.value.append(contentsOf: items ?? [])
        gate2.signal()
    }
    _ = gate2.wait(timeout: .now() + 60)
    var out: [[String: Any]] = []
    for reminder in found.value.prefix(2000) {
        var due: Any = NSNull()
        var hasTime = false
        if let parts = reminder.dueDateComponents, let date = Calendar.current.date(from: parts) {
            due = ms(date)
            hasTime = parts.hour != nil
        }
        // Apple's priority: 1-4 high, 5 medium, 6-9 low, 0 none
        let p = reminder.priority
        let priority = (p >= 1 && p <= 4) ? "high" : ((p >= 6 && p <= 9) ? "low" : "normal")
        out.append([
            "id": reminder.calendarItemIdentifier,
            "title": reminder.title ?? "",
            "list": reminder.calendar?.title ?? "",
            "due": due,
            "hasTime": hasTime,
            "done": reminder.isCompleted,
            "priority": priority,
        ])
    }
    emit(["ok": true, "reminders": out])

default:
    fail("Unknown command.")
}
