"use strict";
/*
 * Runs the Mac helper (focusdesk-mac) and checks what it sends back.
 * Two helpers: one that only READS Apple Calendar and Apple Reminders, and one that WRITES, and only to a calendar and a
 * Reminders list named "FocusDesk" that it makes itself. Every argument is turned into a plain number or a checked
 * identifier before it reaches either helper.
 */
const cp = require("child_process");
const fs = require("fs");

const ID = /^[A-Za-z0-9:_.\-]{1,100}$/;
const ids = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && ID.test(x)).slice(0, 60) : []);
const str = (v, n) => String(v == null ? "" : v).replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, n);
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const DAY = 86400000;
const AID = /^[A-Za-z0-9:_.\-\/+=]{1,250}$/;
const LOCAL = /^[a-z]{2}:[A-Za-z0-9_\-]{1,60}$/;
const aid = (v) => (typeof v === "string" && AID.test(v) ? v : "");
const REPEATS = ["none", "daily", "weekly", "monthly", "yearly"];
/* turns one requested change into only the fields the write helper understands */
function cleanOp(o) {
  if (!o || typeof o !== "object" || !LOCAL.test(o.local)) return null;
  const kind = String(o.op);
  const out = { op: kind, local: o.local };
  if (aid(o.aid)) out.aid = aid(o.aid);
  if (kind === "upsertEvent") {
    const start = num(o.start);
    if (start == null) return null;
    out.title = str(o.title, 300);
    out.start = Math.round(start);
    const end = num(o.end);
    if (end != null) out.end = Math.round(end);
    out.allDay = !!o.allDay;
    out.repeat = REPEATS.indexOf(o.repeat) >= 0 ? o.repeat : "none";
    return out;
  }
  if (kind === "upsertReminder") {
    out.title = str(o.title, 300);
    const due = num(o.due);
    if (due != null) out.due = Math.round(due);
    out.hasTime = !!o.hasTime;
    out.done = !!o.done;
    out.priority = ["high", "normal", "low"].indexOf(o.priority) >= 0 ? o.priority : "normal";
    out.repeat = REPEATS.indexOf(o.repeat) >= 0 ? o.repeat : "none";
    return out;
  }
  if (kind === "deleteEvent" || kind === "deleteReminder" || kind === "checkEvent" || kind === "checkReminder") return out;
  return null;
}

function create(opts) {
  const platform = (opts && opts.platform) || process.platform;
  const helper = opts && opts.helper;
  const writeHelper = opts && opts.writeHelper;
  const aiHelper = opts && opts.aiHelper;
  const execFile = (opts && opts.execFile) || cp.execFile;

  function exec(args, timeout, bin, input) {
    bin = bin || helper;
    return new Promise((resolve) => {
      if (platform !== "darwin") return resolve({ ok: false, unsupported: true, error: "Apple Calendar is only available on a Mac." });
      if (!bin || !fs.existsSync(bin)) return resolve({ ok: false, error: "The Apple Calendar helper isn't part of this build." });
      const child = execFile(bin, args, { timeout: timeout, maxBuffer: 16 << 20, windowsHide: true }, (err, stdout) => {
        let j = null;
        try {
          const lines = String(stdout || "").trim().split("\n");
          j = JSON.parse(lines[lines.length - 1]);
        } catch (_) {}
        if (j && typeof j === "object") return resolve(j);
        resolve({ ok: false, error: err && err.killed ? "Apple Calendar took too long to answer." : "The Apple Calendar helper didn't answer." });
      });
      try {
        if (child && child.stdin) {
          child.stdin.on("error", () => {});
          child.stdin.end(input == null ? "" : input);
        }
      } catch (_) {}
    });
  }
  const fail = (r) => ({ ok: false, error: str(r && r.error, 300) || "Something went wrong.", unsupported: !!(r && r.unsupported) });

  async function call(action, a) {
    a = a || {};
    if (action === "status") {
      const r = await exec(["status"], 10000);
      return r.ok ? { ok: true, events: str(r.events, 20), reminders: str(r.reminders, 20) } : fail(r);
    }
    if (action === "calendars" || action === "lists") {
      const r = await exec([action], 130000); // may be waiting for the person to answer macOS's permission question
      const key = action;
      if (!r.ok) return fail(r);
      return {
        ok: true,
        [key]: (Array.isArray(r[key]) ? r[key] : []).slice(0, 80).map((c) => ({ id: str(c.id, 100), title: str(c.title, 80), account: str(c.account, 80) })).filter((c) => ID.test(c.id)),
      };
    }
    if (action === "events") {
      let from = num(a.from),
        to = num(a.to);
      if (from == null || to == null || to <= from) return { ok: false, error: "That date range isn't valid." };
      if (to - from > 800 * DAY) to = from + 800 * DAY;
      const r = await exec(["events", String(Math.round(from)), String(Math.round(to)), ids(a.ids).join(",")], 130000);
      if (!r.ok) return fail(r);
      return {
        ok: true,
        events: (Array.isArray(r.events) ? r.events : []).slice(0, 3000).map((e) => ({ uid: str(e.uid, 250), title: str(e.title, 200), calendar: str(e.calendar, 80), start: num(e.start), end: num(e.end), allDay: !!e.allDay })).filter((e) => e.uid && e.start != null),
      };
    }
    if (action === "reminders") {
      const r = await exec(["reminders", ids(a.ids).join(",")], 130000);
      if (!r.ok) return fail(r);
      return {
        ok: true,
        reminders: (Array.isArray(r.reminders) ? r.reminders : []).slice(0, 2000).map((x) => ({ id: str(x.id, 200), title: str(x.title, 300), list: str(x.list, 80), due: num(x.due), hasTime: !!x.hasTime, done: !!x.done, priority: ["high", "normal", "low"].indexOf(x.priority) >= 0 ? x.priority : "normal" })).filter((x) => x.id && x.title),
      };
    }
    if (action === "aiStatus") {
      const r = await exec(["status"], 20000, aiHelper, "");
      return r.ok ? { ok: true, available: !!r.available, reason: str(r.reason, 300) } : fail(r);
    }
    if (action === "aiChat") {
      const system = String((a && a.system) || "").slice(0, 6000),
        prompt = String((a && a.prompt) || "").slice(0, 14000);
      if (!prompt.trim()) return { ok: false, error: "There was nothing to answer." };
      const r = await exec(["chat"], 160000, aiHelper, JSON.stringify({ system: system, prompt: prompt }));
      if (!r.ok) return fail(r);
      const t = String(r.text || "").slice(0, 40000);
      return t.trim() ? { ok: true, text: t } : { ok: false, error: "The model answered with nothing." };
    }
    if (action === "writeEnsure") {
      const r = await exec(["ensure"], 130000, writeHelper, JSON.stringify({ calendarId: aid(a.calendarId), listId: aid(a.listId), events: !!a.events, reminders: !!a.reminders }));
      if (!r.ok) return fail(r);
      return { ok: true, calendarId: aid(r.calendarId), listId: aid(r.listId) };
    }
    if (action === "writeApply") {
      const ops = (Array.isArray(a.ops) ? a.ops : []).map(cleanOp).filter(Boolean).slice(0, 300);
      if (!ops.length) return { ok: true, calendarId: aid(a.calendarId), listId: aid(a.listId), results: [] };
      const r = await exec(["apply"], 130000, writeHelper, JSON.stringify({ calendarId: aid(a.calendarId), listId: aid(a.listId), ops: ops }));
      if (!r.ok) return fail(r);
      return {
        ok: true,
        calendarId: aid(r.calendarId),
        listId: aid(r.listId),
        results: (Array.isArray(r.results) ? r.results : []).slice(0, 300).map((x) => ({ local: LOCAL.test(x && x.local) ? x.local : "", ok: !!(x && x.ok), aid: aid(x && x.aid), gone: !!(x && x.gone), found: x && x.found === false ? false : true, done: !!(x && x.done), error: str(x && x.error, 200) })).filter((x) => x.local),
      };
    }
    return { ok: false, error: "Unknown request." };
  }
  return { call: call };
}

module.exports = create;
