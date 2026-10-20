// FocusDesk 96 - Mac write helper
//
// A tiny command-line program that adds FocusDesk's events, reminders, tasks and assignments to Apple Calendar and
// Apple Reminders. FocusDesk runs it only when "Write to Apple Calendar and Reminders" is turned on, and macOS shows
// its own permission prompt the first time.
//
// It is deliberately careful:
//   - It only ever writes to ONE calendar and ONE Reminders list, both named "FocusDesk", which it creates itself.
//   - It only changes or removes items that are inside those two. Anything else in your calendars is left alone.
//   - It never connects to the internet.
//
// Commands (the answer is one line of JSON; the request, if any, arrives as JSON on standard input):
//   ensure   { "calendarId": "...", "listId": "...", "events": true, "reminders": true }
//            makes sure the FocusDesk calendar and list exist (asking for permission if needed)
//   apply    { "calendarId": "...", "listId": "...", "ops": [ ... ] }
//            ops: upsertEvent, deleteEvent, checkEvent, upsertReminder, deleteReminder, checkReminder

import Foundation
import EventKit

let store = EKEventStore()
let ourTitle = "FocusDesk"

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

func stateName(_ status: EKAuthorizationStatus) -> String {
    switch status {
    case .notDetermined: return "notDetermined"
    case .restricted: return "restricted"
    case .denied: return "denied"
    case .authorized: return "authorized"
    default:
        if #available(macOS 14.0, *) {
            if status == .fullAccess { return "authorized" }
            if status == .writeOnly { return "writeOnly" }
        }
        return "unknown"
    }
}

func hasAccess(_ type: EKEntityType) -> Bool {
    return stateName(EKEventStore.authorizationStatus(for: type)) == "authorized"
}

/// Asks macOS for permission if we don't have it yet. Waits up to two minutes for the person to answer.
func ensureAccess(_ type: EKEntityType) -> Bool {
    if hasAccess(type) { return true }
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
    return granted.value && hasAccess(type)
}

func readInput() -> [String: Any] {
    let data = FileHandle.standardInput.readDataToEndOfFile()
    if data.isEmpty { return [:] }
    if let object = try? JSONSerialization.jsonObject(with: data, options: []), let dict = object as? [String: Any] {
        return dict
    }
    return [:]
}

func number(_ value: Any?) -> Double? {
    if let n = value as? NSNumber { return n.doubleValue }
    return nil
}

func text(_ value: Any?) -> String {
    return (value as? String) ?? ""
}

func flag(_ value: Any?) -> Bool {
    if let n = value as? NSNumber { return n.boolValue }
    return false
}

let accessMessage = "FocusDesk wasn't allowed to use your calendar or reminders. You can change this in System Settings > Privacy & Security."
var lastProblem = ""

/// The FocusDesk calendar (or Reminders list): the one we made before, or a new one.
func ourCalendar(_ type: EKEntityType, savedId: String) -> EKCalendar? {
    if !savedId.isEmpty, let saved = store.calendar(withIdentifier: savedId), saved.allowsContentModifications {
        return saved
    }
    let named = store.calendars(for: type).filter { $0.title == ourTitle && $0.allowsContentModifications }
    if let found = named.first { return found }
    let made = EKCalendar(for: type, eventStore: store)
    made.title = ourTitle
    var source: EKSource? = nil
    if type == .event {
        source = store.defaultCalendarForNewEvents?.source
    } else {
        source = store.defaultCalendarForNewReminders()?.source
    }
    if source == nil { source = store.sources.first(where: { $0.sourceType == .local }) }
    if source == nil { source = store.sources.first }
    guard let chosen = source else {
        lastProblem = "No calendar account was found to put the FocusDesk calendar in."
        return nil
    }
    made.source = chosen
    do {
        try store.saveCalendar(made, commit: true)
    } catch {
        lastProblem = "Couldn't create the FocusDesk calendar: " + error.localizedDescription
        return nil
    }
    return made
}

func recurrenceRule(_ name: String) -> EKRecurrenceRule? {
    var frequency: EKRecurrenceFrequency? = nil
    if name == "daily" { frequency = .daily }
    if name == "weekly" { frequency = .weekly }
    if name == "monthly" { frequency = .monthly }
    if name == "yearly" { frequency = .yearly }
    guard let chosen = frequency else { return nil }
    return EKRecurrenceRule(recurrenceWith: chosen, interval: 1, end: nil)
}

func upsertEvent(_ op: [String: Any], _ calendar: EKCalendar) -> [String: Any] {
    let local = text(op["local"])
    guard let startMs = number(op["start"]) else { return ["local": local, "ok": false, "error": "The event has no start time."] }
    let allDay = flag(op["allDay"])
    var endMs = number(op["end"]) ?? (startMs + 3600000.0)
    if endMs <= startMs { endMs = allDay ? startMs : (startMs + 3600000.0) }
    let aid = text(op["aid"])
    var existing: EKEvent? = nil
    if !aid.isEmpty, let found = store.event(withIdentifier: aid), found.calendar?.calendarIdentifier == calendar.calendarIdentifier {
        existing = found
    }
    let event = existing ?? EKEvent(eventStore: store)
    event.calendar = calendar
    event.title = text(op["title"])
    event.isAllDay = allDay
    event.startDate = Date(timeIntervalSince1970: startMs / 1000.0)
    event.endDate = Date(timeIntervalSince1970: endMs / 1000.0)
    event.notes = "Created by FocusDesk 96"
    let repeatName = text(op["repeat"])
    if let old = event.recurrenceRules {
        for rule in old { event.removeRecurrenceRule(rule) }
    }
    if let rule = recurrenceRule(repeatName) { event.addRecurrenceRule(rule) }
    do {
        try store.save(event, span: repeatName.isEmpty || repeatName == "none" ? .thisEvent : .futureEvents, commit: true)
    } catch {
        return ["local": local, "ok": false, "error": error.localizedDescription]
    }
    return ["local": local, "ok": true, "aid": event.eventIdentifier ?? ""]
}

func deleteEvent(_ op: [String: Any], _ calendar: EKCalendar) -> [String: Any] {
    let local = text(op["local"])
    let aid = text(op["aid"])
    if aid.isEmpty { return ["local": local, "ok": true, "gone": true] }
    guard let found = store.event(withIdentifier: aid) else { return ["local": local, "ok": true, "gone": true] }
    if found.calendar?.calendarIdentifier != calendar.calendarIdentifier {
        return ["local": local, "ok": false, "error": "That event isn't in the FocusDesk calendar, so it was left alone."]
    }
    do {
        try store.remove(found, span: .futureEvents, commit: true)
    } catch {
        return ["local": local, "ok": false, "error": error.localizedDescription]
    }
    return ["local": local, "ok": true]
}

func checkEvent(_ op: [String: Any], _ calendar: EKCalendar) -> [String: Any] {
    let local = text(op["local"])
    let aid = text(op["aid"])
    guard !aid.isEmpty, let found = store.event(withIdentifier: aid), found.calendar?.calendarIdentifier == calendar.calendarIdentifier else {
        return ["local": local, "ok": true, "found": false]
    }
    return ["local": local, "ok": true, "found": true]
}

func upsertReminder(_ op: [String: Any], _ list: EKCalendar) -> [String: Any] {
    let local = text(op["local"])
    let aid = text(op["aid"])
    var existing: EKReminder? = nil
    if !aid.isEmpty, let found = store.calendarItem(withIdentifier: aid) as? EKReminder, found.calendar?.calendarIdentifier == list.calendarIdentifier {
        existing = found
    }
    let reminder = existing ?? EKReminder(eventStore: store)
    reminder.calendar = list
    reminder.title = text(op["title"])
    let priority = text(op["priority"])
    reminder.priority = priority == "high" ? 1 : (priority == "low" ? 9 : 0)
    if let dueMs = number(op["due"]) {
        let date = Date(timeIntervalSince1970: dueMs / 1000.0)
        let units: Set<Calendar.Component> = flag(op["hasTime"]) ? [.year, .month, .day, .hour, .minute] : [.year, .month, .day]
        reminder.dueDateComponents = Calendar.current.dateComponents(units, from: date)
    } else {
        reminder.dueDateComponents = nil
    }
    if let old = reminder.recurrenceRules {
        for rule in old { reminder.removeRecurrenceRule(rule) }
    }
    if let rule = recurrenceRule(text(op["repeat"])), reminder.dueDateComponents != nil { reminder.addRecurrenceRule(rule) }
    reminder.isCompleted = flag(op["done"])
    do {
        try store.save(reminder, commit: true)
    } catch {
        return ["local": local, "ok": false, "error": error.localizedDescription]
    }
    return ["local": local, "ok": true, "aid": reminder.calendarItemIdentifier]
}

func deleteReminder(_ op: [String: Any], _ list: EKCalendar) -> [String: Any] {
    let local = text(op["local"])
    let aid = text(op["aid"])
    if aid.isEmpty { return ["local": local, "ok": true, "gone": true] }
    guard let found = store.calendarItem(withIdentifier: aid) as? EKReminder else { return ["local": local, "ok": true, "gone": true] }
    if found.calendar?.calendarIdentifier != list.calendarIdentifier {
        return ["local": local, "ok": false, "error": "That reminder isn't in the FocusDesk list, so it was left alone."]
    }
    do {
        try store.remove(found, commit: true)
    } catch {
        return ["local": local, "ok": false, "error": error.localizedDescription]
    }
    return ["local": local, "ok": true]
}

func checkReminder(_ op: [String: Any], _ list: EKCalendar) -> [String: Any] {
    let local = text(op["local"])
    let aid = text(op["aid"])
    guard !aid.isEmpty, let found = store.calendarItem(withIdentifier: aid) as? EKReminder, found.calendar?.calendarIdentifier == list.calendarIdentifier else {
        return ["local": local, "ok": true, "found": false]
    }
    return ["local": local, "ok": true, "found": true, "done": found.isCompleted]
}

let args = Array(CommandLine.arguments.dropFirst())
guard let command = args.first else { fail("No command given.") }
let input = readInput()

switch command {

case "ensure":
    var calendarId = ""
    var listId = ""
    if flag(input["events"]) {
        guard ensureAccess(.event) else { fail(accessMessage) }
        guard let calendar = ourCalendar(.event, savedId: text(input["calendarId"])) else { fail(lastProblem.isEmpty ? "Couldn't set up the FocusDesk calendar." : lastProblem) }
        calendarId = calendar.calendarIdentifier
    }
    if flag(input["reminders"]) {
        guard ensureAccess(.reminder) else { fail(accessMessage) }
        guard let list = ourCalendar(.reminder, savedId: text(input["listId"])) else { fail(lastProblem.isEmpty ? "Couldn't set up the FocusDesk Reminders list." : lastProblem) }
        listId = list.calendarIdentifier
    }
    emit(["ok": true, "calendarId": calendarId, "listId": listId])

case "apply":
    let ops = (input["ops"] as? [[String: Any]]) ?? []
    var needEvents = false
    var needReminders = false
    for op in ops {
        let name = text(op["op"])
        if name.hasSuffix("Event") { needEvents = true }
        if name.hasSuffix("Reminder") { needReminders = true }
    }
    var calendar: EKCalendar? = nil
    var list: EKCalendar? = nil
    if needEvents {
        guard ensureAccess(.event) else { fail(accessMessage) }
        calendar = ourCalendar(.event, savedId: text(input["calendarId"]))
        if calendar == nil { fail(lastProblem.isEmpty ? "Couldn't set up the FocusDesk calendar." : lastProblem) }
    }
    if needReminders {
        guard ensureAccess(.reminder) else { fail(accessMessage) }
        list = ourCalendar(.reminder, savedId: text(input["listId"]))
        if list == nil { fail(lastProblem.isEmpty ? "Couldn't set up the FocusDesk Reminders list." : lastProblem) }
    }
    var results: [[String: Any]] = []
    for op in ops.prefix(300) {
        let name = text(op["op"])
        var result: [String: Any] = ["local": text(op["local"]), "ok": false, "error": "Unknown request."]
        if let cal = calendar {
            if name == "upsertEvent" { result = upsertEvent(op, cal) }
            if name == "deleteEvent" { result = deleteEvent(op, cal) }
            if name == "checkEvent" { result = checkEvent(op, cal) }
        }
        if let rem = list {
            if name == "upsertReminder" { result = upsertReminder(op, rem) }
            if name == "deleteReminder" { result = deleteReminder(op, rem) }
            if name == "checkReminder" { result = checkReminder(op, rem) }
        }
        results.append(result)
    }
    emit(["ok": true, "calendarId": calendar?.calendarIdentifier ?? "", "listId": list?.calendarIdentifier ?? "", "results": results])

default:
    fail("Unknown command.")
}
