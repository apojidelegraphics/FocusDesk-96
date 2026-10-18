"use strict";
/*
 * Runs the Mac helper (focusdesk-mac) and checks what it sends back.
 * The helper only reads Apple Calendar and Apple Reminders; nothing here writes to them.
 * Every argument is turned into a plain number or a checked identifier before it reaches the helper.
 */
const cp = require("child_process");
const fs = require("fs");

const ID = /^[A-Za-z0-9:_.\-]{1,100}$/;
const ids = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && ID.test(x)).slice(0, 60) : []);
const str = (v, n) => String(v == null ? "" : v).replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, n);
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const DAY = 86400000;

function create(opts) {
  const platform = (opts && opts.platform) || process.platform;
  const helper = opts && opts.helper;
  const execFile = (opts && opts.execFile) || cp.execFile;

  function exec(args, timeout) {
    return new Promise((resolve) => {
      if (platform !== "darwin") return resolve({ ok: false, unsupported: true, error: "Apple Calendar is only available on a Mac." });
      if (!helper || !fs.existsSync(helper)) return resolve({ ok: false, error: "The Apple Calendar helper isn't part of this build." });
      execFile(helper, args, { timeout: timeout, maxBuffer: 16 << 20, windowsHide: true }, (err, stdout) => {
        let j = null;
        try {
          const lines = String(stdout || "").trim().split("\n");
          j = JSON.parse(lines[lines.length - 1]);
        } catch (_) {}
        if (j && typeof j === "object") return resolve(j);
        resolve({ ok: false, error: err && err.killed ? "Apple Calendar took too long to answer." : "The Apple Calendar helper didn't answer." });
      });
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
    return { ok: false, error: "Unknown request." };
  }
  return { call: call };
}

module.exports = create;
