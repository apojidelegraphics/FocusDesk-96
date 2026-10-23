"use strict";
/*
 * The crash log: a small text file in the data folder that records what went wrong when FocusDesk crashed or hit an error,
 * so a problem can be explained afterwards.
 *
 *  - It holds error text only (what broke, and roughly where). Never your notes, tasks or any of your data.
 *  - Names and secrets are taken out before anything is written: your user name and home folder, e-mail addresses, web
 *    addresses' query parts, and anything that looks like a key or token.
 *  - It stays small: the newest 60 entries, each short.
 *  - NOTHING is sent anywhere automatically. "Send details" only opens a draft issue in your browser for you to read, change and
 *    submit yourself (or not).
 */
const fs = require("fs");
const path = require("path");

const KINDS = ["main-error", "main-rejection", "renderer-gone", "child-gone", "page-error", "unresponsive", "unclean-exit"];
const SERIOUS = ["main-error", "renderer-gone"]; // the kinds worth telling the person about next time
const MAX_ENTRIES = 60;
const MAX_MSG = 400;
const MAX_STACK = 1200;

function makeCrashLog(o) {
  // o: { file, version, platform, home, user, now }
  const now = o.now || (() => Date.now());
  const file = o.file;
  const seenFile = file + ".seen";

  function redact(text) {
    let s = String(text == null ? "" : text);
    const home = String(o.home || "");
    const user = String(o.user || "");
    const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (home.length > 3) {
      s = s.replace(new RegExp(esc(home), "gi"), "~");
      s = s.replace(new RegExp(esc(home.replace(/\\/g, "/")), "gi"), "~");
      s = s.replace(new RegExp(esc(encodeURI(home.replace(/\\/g, "/"))), "gi"), "~");
    }
    s = s.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "<email>"); // before the user name, or an address would be left half-removed
    s = s.replace(/([A-Za-z]:)?[\\/](Users|home)[\\/][^\\/\s:"')]+/gi, "~"); // any other user's folder, in either slash style
    if (user.length >= 3) s = s.replace(new RegExp("\\b" + esc(user) + "\\b", "gi"), "<user>");
    s = s.replace(/(https?:\/\/[^\s?#"')]+)[?#][^\s"')]*/gi, "$1?<removed>");
    s = s.replace(/\b[A-Za-z0-9_\-]{32,}\b/g, "<token>"); // long keys and tokens
    s = s.replace(/\bsk-[A-Za-z0-9_-]{8,}/g, "<token>");
    return s;
  }
  function clean(x, max) {
    return redact(x).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").slice(0, max);
  }
  function readAll() {
    let text = "";
    try {
      text = fs.readFileSync(file, "utf8");
    } catch (e) {
      return [];
    }
    const out = [];
    text.split(/\r?\n/).forEach((line) => {
      if (!line.trim()) return;
      try {
        const j = JSON.parse(line);
        if (j && typeof j.t === "number" && KINDS.indexOf(j.kind) >= 0) out.push({ t: j.t, kind: j.kind, v: String(j.v || ""), os: String(j.os || ""), msg: String(j.msg || ""), stack: String(j.stack || "") });
      } catch (e) {}
    });
    return out;
  }
  function record(kind, message, stack) {
    try {
      if (KINDS.indexOf(kind) < 0) return false;
      const e = { t: now(), kind: kind, v: String(o.version || ""), os: String(o.platform || ""), msg: clean(message, MAX_MSG) };
      if (stack) e.stack = clean(String(stack).split("\n").slice(0, 12).join("\n"), MAX_STACK);
      const all = readAll();
      all.push(e);
      const keep = all.slice(-MAX_ENTRIES);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      const tmp = file + "." + process.pid + ".tmp";
      fs.writeFileSync(tmp, keep.map((x) => JSON.stringify(x)).join("\n") + "\n");
      fs.renameSync(tmp, file);
      return true;
    } catch (err) {
      return false; // the crash log must never be the reason for another crash
    }
  }
  function seenAt() {
    try {
      return Number(fs.readFileSync(seenFile, "utf8")) || 0;
    } catch (e) {
      return 0;
    }
  }
  function markSeen() {
    try {
      fs.writeFileSync(seenFile, String(now()));
    } catch (e) {}
  }
  function unseenSerious() {
    const s = seenAt();
    return readAll().filter((x) => x.t > s && SERIOUS.indexOf(x.kind) >= 0).length;
  }
  function clear() {
    try {
      fs.rmSync(file, { force: true });
      fs.rmSync(seenFile, { force: true });
    } catch (e) {}
  }
  function info() {
    const all = readAll();
    const last = all[all.length - 1] || null;
    return { count: all.length, unseen: unseenSerious(), last: last ? { t: last.t, kind: last.kind, msg: last.msg } : null };
  }
  /* the text a person can read, copy or send: version, system, then the newest entries (newest last) */
  function report(maxChars) {
    const all = readAll().slice(-8);
    const lines = ["FocusDesk 96 " + String(o.version || "") + " on " + String(o.platform || ""), ""];
    if (!all.length) lines.push("(nothing has been recorded)");
    all.forEach((x) => {
      lines.push(new Date(x.t).toISOString() + "  " + x.kind + "  " + x.msg);
      if (x.stack) lines.push(x.stack.split("\n").map((l) => "    " + l).join("\n"));
    });
    let text = lines.join("\n");
    const cap = maxChars || 6000;
    if (text.length > cap) text = "...\n" + text.slice(text.length - cap);
    return text;
  }
  /* the address of a draft issue with the report filled in: the person reads it in their browser and decides whether to submit */
  function issueUrl(repoUrl, title) {
    const make = (t) => repoUrl + "/issues/new?title=" + encodeURIComponent(title) + "&body=" + encodeURIComponent("**What were you doing when it happened?**\n(please write a few words here)\n\n**Details** (your name, folders and keys are already removed)\n```\n" + t + "\n```\n");
    let text = report(3500);
    let url = make(text);
    while (url.length > 7000 && text.length > 400) {
      text = "...\n" + text.slice(Math.floor(text.length * 0.25));
      url = make(text);
    }
    return url;
  }
  return { record, info, report, clear, markSeen, redact, issueUrl, entries: readAll, KINDS, SERIOUS };
}

module.exports = { makeCrashLog, KINDS };
