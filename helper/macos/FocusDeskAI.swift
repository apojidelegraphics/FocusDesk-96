// FocusDesk 96 - Mac AI helper
//
// A tiny command-line program that lets FocusDesk's assistants use Apple's on-device language model
// (Apple Foundation Models, part of Apple Intelligence on macOS 26 and newer). Everything stays on this Mac:
// the program never connects to the internet.
//
// Commands (the answer is one line of JSON; a request, if any, arrives as JSON on standard input):
//   status                              is the model ready?   { ok, available, reason }
//   chat   { "system": "...", "prompt": "..." }   one answer    { ok, text }

import Foundation
#if canImport(FoundationModels)
import FoundationModels
#endif

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

func readInput() -> [String: Any] {
    let data = FileHandle.standardInput.readDataToEndOfFile()
    if data.isEmpty { return [:] }
    if let object = try? JSONSerialization.jsonObject(with: data, options: []), let dict = object as? [String: Any] {
        return dict
    }
    return [:]
}

func text(_ value: Any?) -> String {
    return (value as? String) ?? ""
}

let tooOld = "Apple's on-device model needs a Mac with Apple Intelligence and macOS 26 or newer."

#if canImport(FoundationModels)
/// Empty when the model is ready, otherwise a plain-English reason.
@available(macOS 26.0, *)
func modelProblem() -> String {
    let model = SystemLanguageModel.default
    switch model.availability {
    case .available:
        return ""
    case .unavailable(let reason):
        switch reason {
        case .deviceNotEligible:
            return "This Mac can't run Apple Intelligence."
        case .appleIntelligenceNotEnabled:
            return "Apple Intelligence is turned off. Turn it on in System Settings > Apple Intelligence & Siri."
        case .modelNotReady:
            return "Apple's model is still getting ready. Try again in a little while."
        @unknown default:
            return "Apple's on-device model isn't available right now."
        }
    @unknown default:
        return "Apple's on-device model isn't available right now."
    }
}

@available(macOS 26.0, *)
func respond(system: String, prompt: String) async throws -> String {
    let session = LanguageModelSession(instructions: system)
    let response = try await session.respond(to: prompt)
    return response.content
}
#endif

let args = Array(CommandLine.arguments.dropFirst())
guard let command = args.first else { fail("No command given.") }

switch command {

case "status":
    #if canImport(FoundationModels)
    if #available(macOS 26.0, *) {
        let problem = modelProblem()
        emit(["ok": true, "available": problem.isEmpty, "reason": problem])
        exit(0)
    }
    #endif
    emit(["ok": true, "available": false, "reason": tooOld])

case "chat":
    let input = readInput()
    #if canImport(FoundationModels)
    if #available(macOS 26.0, *) {
        let problem = modelProblem()
        if !problem.isEmpty { fail(problem) }
        let system = text(input["system"])
        let prompt = text(input["prompt"])
        if prompt.isEmpty { fail("There was nothing to answer.") }
        let answer = Box<String>("")
        let trouble = Box<String>("")
        let gate = DispatchSemaphore(value: 0)
        // a detached task, so it doesn't wait for the thread that is waiting for it
        Task.detached {
            do {
                answer.value = try await respond(system: system, prompt: prompt)
            } catch {
                trouble.value = error.localizedDescription
            }
            gate.signal()
        }
        _ = gate.wait(timeout: .now() + 150)
        if !trouble.value.isEmpty { fail(trouble.value) }
        if answer.value.isEmpty { fail("The model didn't answer in time.") }
        emit(["ok": true, "text": answer.value])
        exit(0)
    }
    #endif
    fail(tooOld)

default:
    fail("Unknown command.")
}
