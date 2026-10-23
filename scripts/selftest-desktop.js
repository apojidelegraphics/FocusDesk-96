#!/usr/bin/env node
"use strict";
/*
 * Checks of the desktop-only helpers that can run without Electron: the automatic backups (backup.js) and the crash log
 * (crashlog.js). They run the real modules on real temporary folders. selftest.js runs this, so every build covers it.
 */
const fs = require("fs");
const fsp = fs.promises;
const os = require("os");
const path = require("path");
const { makeBackups, MIN_GAP_MS } = require("../backup");
const { makeCrashLog } = require("../crashlog");
const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
};
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "fd-desk-"));
async function atomicWrite(file, data) {
  const t = file + "." + process.pid + ".tmp";
  await fsp.writeFile(t, data);
  await fsp.rename(t, file);
}
const files = (d) => {
  try {
    return fs.readdirSync(d).sort();
  } catch (e) {
    return [];
  }
};
const json = (n) => Buffer.from(JSON.stringify({ app: "FocusDesk 96", notes: [{ id: "n", text: "x".repeat(n) }] }));

(async () => {
  /* ---------------- automatic backups ---------------- */
  function rig(over) {
    const root = tmp();
    const r = { root, data: path.join(root, "data.json"), dir: path.join(root, "chosen"), fallback: path.join(root, "default"), day: "2026-10-23", t: 1000000000000, keep: 7 };
    const b = makeBackups(Object.assign({ fsp, atomicWrite, readData: async () => { try { return fs.readFileSync(r.data); } catch (e) { return null; } }, dir: () => r.dir, fallbackDir: r.fallback, keep: () => r.keep, today: () => r.day, now: () => r.t, log: () => {} }, over || {}));
    r.b = b;
    r.set = (buf) => fs.writeFileSync(r.data, buf);
    return r;
  }
  {
    const r = rig();
    check((await r.b.run()).at === 0 && files(r.dir).length === 0, "backup: with no data yet, nothing is written");
    r.set(json(100));
    const s = await r.b.run();
    check(s.verified && s.file === "2026-10-23.json" && s.dir === r.dir && s.error === "" && s.count === 1 && files(r.dir).join() === "2026-10-23.json", "backup: the first run makes today's file and reports it as checked");
    const m1 = fs.statSync(path.join(r.dir, "2026-10-23.json")).mtimeMs;
    r.t += 5000;
    await r.b.run();
    check(fs.statSync(path.join(r.dir, "2026-10-23.json")).mtimeMs === m1, "backup: unchanged data is not written again");
    r.set(json(300));
    r.t += 60000;
    await r.b.run();
    check(fs.readFileSync(path.join(r.dir, "2026-10-23.json")).length === json(100).length, "backup: changed data waits for the 20 minute gap before refreshing");
    r.t += MIN_GAP_MS;
    await r.b.run();
    check(fs.readFileSync(path.join(r.dir, "2026-10-23.json")).length === json(300).length, "backup: after the gap, today's file is refreshed with the new data");
    r.set(json(500));
    await r.b.run({ force: true });
    check(fs.readFileSync(path.join(r.dir, "2026-10-23.json")).length === json(500).length, "backup: closing the app (force) saves the latest data at once");
    r.day = "2026-10-24";
    r.set(json(600));
    await r.b.run();
    check(files(r.dir).join() === "2026-10-23.json,2026-10-24.json", "backup: a new day starts a new file, and yesterday's keeps how that day ended");
    check(fs.readFileSync(path.join(r.dir, "2026-10-23.json")).length === json(500).length, "backup: yesterday's file holds yesterday's last data");
  }
  {
    const r = rig();
    r.keep = 2;
    for (const d of ["2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23"]) {
      r.day = d;
      r.set(json(100 + d.length));
      await r.b.run({ force: true });
    }
    check(files(r.dir).join() === "2026-10-22.json,2026-10-23.json", "backup: only the newest N dated files are kept (got " + files(r.dir).join() + ")");
    r.keep = 0;
    r.day = "2026-10-25";
    await r.b.run({ force: true });
    r.day = "2026-10-26";
    await r.b.run({ force: true });
    check(files(r.dir).length === 4, "backup: keep-all (0) keeps every file");
  }
  {
    const r = rig();
    r.set(json(30000));
    await r.b.run({ force: true });
    r.set(json(2000)); /* after "delete everything": far smaller */
    await r.b.run({ force: true });
    check(files(r.dir).join() === "2026-10-23-before-shrink.json,2026-10-23.json", "backup: a much smaller copy keeps the bigger one beside it (got " + files(r.dir).join() + ")");
    check(fs.readFileSync(path.join(r.dir, "2026-10-23-before-shrink.json")).length === json(30000).length && fs.readFileSync(path.join(r.dir, "2026-10-23.json")).length === json(2000).length, "backup: the safety copy holds the bigger data and today's file the new data");
    r.keep = 1;
    r.day = "2026-10-24";
    r.set(json(2100));
    await r.b.run({ force: true });
    check(files(r.dir).join() === "2026-10-24.json", "backup: the safety copy is removed with the day it belongs to (got " + files(r.dir).join() + ")");
  }
  {
    const r = rig();
    r.set(json(100));
    r.dir = path.join(r.root, "data.json", "nope"); /* a folder that can't be made: its parent is a file */
    const s = await r.b.run();
    check(s.verified && s.dir === r.fallback && /default folder/.test(s.note) && files(r.fallback).join() === "2026-10-23.json", "backup: an unreachable folder falls back to the default folder and says so");
  }
  {
    const r = rig();
    r.set(json(100));
    await r.b.run();
    r.dir = path.join(r.root, "other-folder"); /* the person picks a new backup folder */
    const s = await r.b.run();
    check(s.verified && s.dir === r.dir && files(r.dir).join() === "2026-10-23.json", "backup: a newly chosen folder gets a backup straight away, even if nothing changed");
    const bad = rig();
    bad.set(json(100));
    bad.dir = path.join(bad.root, "data.json", "nope");
    await bad.b.run();
    bad.dir = path.join(bad.root, "back-again"); /* the drive is back */
    const s2 = await bad.b.run();
    check(s2.dir === bad.dir && s2.note === "" && files(bad.dir).length === 1, "backup: once the chosen folder works again, backups go there again");
  }
  {
    const r = rig();
    r.set(Buffer.from("{ this is not json"));
    const s = await r.b.run();
    check(!s.verified && /Couldn't write a backup/.test(s.error), "backup: data that isn't valid JSON is not trusted as a good backup");
  }
  {
    const lying = { ...fsp, readFile: async (f, ...a) => { const v = await fsp.readFile(f, ...a); return /\.json$/.test(String(f)) && /chosen|default/.test(String(f)) ? v.subarray(0, v.length - 3) : v; } };
    const r = rig({ fsp: lying });
    r.set(json(200));
    const s = await r.b.run();
    check(!s.verified && s.error !== "", "backup: a backup that doesn't read back the same is reported, not trusted");
  }
  {
    const r = rig();
    r.set(json(100));
    const all = await Promise.all([r.b.run(), r.b.run(), r.b.run({ force: true })]);
    check(all.every((s) => s.verified) && files(r.dir).join() === "2026-10-23.json" && files(r.dir).every((n) => !/tmp/.test(n)), "backup: several runs at once cannot clash or leave temp files");
  }
  /* ---------------- crash log ---------------- */
  {
    const root = tmp();
    const file = path.join(root, "data", "crash.log");
    let t = 1000;
    const L = makeCrashLog({ file, version: "1.4.2", platform: "darwin arm64", home: "/Users/lucas", user: "lucas", now: () => t++ });
    check(L.info().count === 0 && L.info().last === null, "crash log: starts empty");
    check(L.record("nonsense", "x") === false && L.info().count === 0, "crash log: an unknown kind is ignored");
    L.record("main-error", "Failed to read /Users/lucas/Documents/secret plan.txt for lucas@example.com", "Error: boom\n    at f (/Users/lucas/app/main.js:10:5)\n    at g (C:\\Users\\Lucas\\AppData\\x.js:1:1)");
    L.record("page-error", "Request to https://api.example.com/v1?key=abc123&user=me failed with key sk-abcdefghijklmnopqrstuvwxyz0123456789 and token ghp_" + "A".repeat(36));
    const text = JSON.stringify(L.entries()) + L.report();
    check(!/lucas/i.test(text) && !/Users[\\/]/.test(text), "crash log: the user name, home folder and other users' folders are removed (found: " + (text.match(/.{20}lucas.{20}/i) || [""])[0] + ")");
    check(!/example\.com\b.*@|@example/.test(text) && /<email>/.test(text), "crash log: e-mail addresses are removed");
    check(!/abc123|user=me/.test(text) && /\?<removed>/.test(text), "crash log: the query part of a web address is removed");
    check(!/sk-abcdef|ghp_A{10}|A{30}/.test(text) && /<token>/.test(text), "crash log: keys and tokens are removed");
    check(/1\.4\.2 on darwin arm64/.test(L.report()), "crash log: the report says which version and system");
    check(L.info().unseen === 1 && L.info().count === 2, "crash log: a serious entry counts as unseen, a page error does not");
    L.markSeen();
    check(L.info().unseen === 0, "crash log: once seen, it isn't mentioned again");
    t += 5;
    L.record("renderer-gone", "crashed (exit 11)");
    check(L.info().unseen === 1 && L.info().last.kind === "renderer-gone", "crash log: a newer serious entry is unseen again");
    L.record("main-error", "m".repeat(5000), Array.from({ length: 40 }, (_, i) => "    at line " + i + " " + "z".repeat(100)).join("\n"));
    const big = L.entries().pop();
    check(big.msg.length <= 400 && big.stack.length <= 1200 && big.stack.split("\n").length <= 12, "crash log: a long message and stack are cut short");
    for (let i = 0; i < 100; i++) L.record("page-error", "e" + i);
    check(L.entries().length === 60 && fs.statSync(file).size < 60000, "crash log: only the newest 60 entries are kept and the file stays small");
    check(L.report(500).length <= 505, "crash log: a report can be cut to fit");
    fs.writeFileSync(file, "garbage\n{not json}\n");
    check(L.entries().length === 0 && L.record("page-error", "after damage") && L.entries().length === 1, "crash log: a damaged file is tolerated and replaced");
    for (let i = 0; i < 30; i++) L.record("main-error", "problem number " + i + " " + "w".repeat(300), Array.from({ length: 10 }, (_, k) => "    at f" + k + " (/Users/lucas/app/" + "d".repeat(80) + ".js:1:1)").join("\n"));
    const url = L.issueUrl("https://github.com/apojidelegraphics/FocusDesk-96", "Crash report: FocusDesk 96 1.4.2");
    check(url.indexOf("https://github.com/apojidelegraphics/FocusDesk-96/issues/new?title=") === 0 && url.length <= 7000, "crash log: the draft address is the project's own issue page and short enough (" + url.length + ")");
    const body = decodeURIComponent(url.split("&body=")[1]);
    check(/Details/.test(body) && /1\.4\.2 on darwin arm64/.test(body) && /problem number 29/.test(body) && !/lucas/i.test(body), "crash log: the draft holds the newest details and nothing personal");
    L.clear();
    check(!fs.existsSync(file) && L.info().count === 0, "crash log: clearing deletes the file");
    const blocked = makeCrashLog({ file: path.join(root, "data", "crash.log", "x", "y"), version: "1", platform: "p", home: "", user: "" });
    fs.writeFileSync(file, "a file where a folder would be needed");
    let threw = false;
    try {
      blocked.record("main-error", "x");
    } catch (e) {
      threw = true;
    }
    check(!threw, "crash log: it can never be the cause of a crash (an unwritable folder is ignored)");
  }
  if (fails.length) {
    console.error("selftest-desktop: FAILED\n  " + fails.join("\n  "));
    process.exit(1);
  }
  console.log("selftest-desktop: ok (automatic backups, crash log)");
})().catch((e) => {
  console.error("selftest-desktop: crashed " + (e && e.stack));
  process.exit(1);
});
