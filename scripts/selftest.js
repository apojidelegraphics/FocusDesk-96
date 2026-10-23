#!/usr/bin/env node
"use strict";
/*
 * Quick checks of the safety-critical pieces, run in every build. They pull the REAL code out of focusdesk.js and main.js
 * and try it out, so a later change can't quietly undo a security fix. Fails (exit 1) if anything is wrong.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const read = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8").replace(/\r\n/g, "\n"); // Windows checkouts use CRLF
const app = read("focusdesk.js");
const main = read("main.js");
const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
};
function cut(src, start, endMarker, what) {
  const a = src.indexOf(start);
  if (a < 0) {
    fails.push("couldn't find " + what + " (was it renamed?)");
    return "";
  }
  const b = src.indexOf(endMarker, a);
  return b < 0 ? "" : src.slice(a, b);
}

/* 1. the graphing calculator only builds functions from safe expressions */
{
  const text = cut(app, "    function parseExpr(str, paramVals) {", "\n    }\n", "the graphing parser") + "\n    }\n";
  let ran = 0;
  const box = { Math, Object, String, Number, window: { focusdesk: { openDataFolder() { ran++; } } }, alert() { ran++; }, fetch() { ran++; } };
  vm.createContext(box);
  vm.runInContext(text + ";this.parseExpr=parseExpr;", box);
  const run = (e, p) => {
    const f = box.parseExpr(e, p || {});
    if (!f) return null;
    try {
      return f(2);
    } catch (x) {
      return NaN;
    }
  };
  [["x^2+3*x-1", 9], ["sin(x)", Math.sin(2)], ["2*pi*x", 4 * Math.PI], ["sqrt(x)", Math.SQRT2], ["1.5*x", 3], [".5*x", 1], ["1e2*x", 200], ["x**3", 8]].forEach(([e, want]) => {
    const r = run(e);
    check(typeof r === "number" && Math.abs(r - want) < 1e-9, "graphing: " + e + " should work");
  });
  check(typeof run("a*x+b", { a: 3, b: 1 }) === "number", "graphing: sliders should work");
  ["window.focusdesk.openDataFolder()", "x.constructor", "x.constructor.constructor(x)", "Math.constructor", "alert(1)", "fetch(1)", "String.fromCharCode(97)", "Function(x)()", "x.toString()", "(x).constructor"].forEach((e) => {
    const r = run(e, { window: 1, focusdesk: 1, alert: 1, fetch: 1, String: 1, Function: 1, constructor: 1, toString: 1, fromCharCode: 1, openDataFolder: 1 });
    check(r === null || (typeof r === "number" && isNaN(r)), "graphing: attack expression must be refused: " + e);
  });
  check(ran === 0, "graphing: an attack expression actually ran code");
}

/* 2. quotes can't break out of an HTML attribute in notes */
{
  const esc = cut(app, "  function citeEsc(t) {", "\n  /* ================= 2.7: IMAGES", "citeEsc") ;
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(esc + ";this.qEsc=qEsc;this.citeEsc=citeEsc;", ctx);
  const q = ctx.qEsc && ctx.qEsc('x" onclick="alert(1)\' y');
  check(typeof q === "string" && q.indexOf('"') < 0 && q.indexOf("'") < 0, "notes: quotes must be escaped inside attributes");
  check(/qEsc\(name\)/.test(app) && /qEsc\(url\)/.test(app), "notes: wiki links and web links must escape quotes (qEsc)");
}

/* 3. web lookups can't be aimed at the person's own network */
{
  const text = cut(main, "function isPrivateHost(host) {", "\nfunction validBounds", "isPrivateHost");
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(text + ";this.isPrivateHost=isPrivateHost;this.latestFromFeed=latestFromFeed;this.tagsFromName=tagsFromName;", ctx);
  const H = (h) => ctx.isPrivateHost(new URL("https://" + h + "/").hostname);
  ["localhost", "127.0.0.1", "10.1.2.3", "172.20.0.1", "192.168.0.5", "169.254.169.254", "[::1]", "[fd00::1]", "[::ffff:127.0.0.1]", "printer.local"].forEach((h) => check(H(h), "addresses: " + h + " must be blocked"));
  ["example.com", "doi.org", "8.8.8.8", "172.32.0.1", "api.crossref.org"].forEach((h) => check(!H(h), "addresses: " + h + " must be allowed"));
  /* the update check's fallback (the release feed) must never offer a BETA pre-release */
  const feed = (t1, t2) => '<feed><entry><title>' + t1 + '</title><link rel="alternate" href="https://github.com/x/y/releases/tag/v1.4.2"/><content>notes that mention beta</content></entry><entry><title>' + t2 + '</title><link rel="alternate" href="https://github.com/x/y/releases/tag/v1.4.1"/></entry></feed>';
  const pick = (xml) => {
    const r = ctx.latestFromFeed(xml);
    return r ? r[1] : null;
  };
  check(pick(feed("v1.4.2 [MINOR] [BETA]", "v1.4.1 [MINOR]")) === "1.4.1", "update check: a [BETA] release must not be offered");
  check(pick(feed("v1.4.2 [MINOR]", "v1.4.1 [MINOR]")) === "1.4.2", "update check: a finished release must be offered (the word beta in its notes doesn't matter)");
  check(pick("<feed></feed>") === null && pick("") === null, "update check: an empty feed gives no update");
  check(/const hit = latestFromFeed\(xml\);/.test(main), "update check: the fallback must use latestFromFeed");
  /* tags travel with the update information as a separate list, never inside the number */
  const tn = (x) => JSON.stringify(ctx.tagsFromName(x));
  check(tn("v1.4.2 [MINOR] [BETA]") === '["MINOR"]' && tn("v1.4.1") === "[]" && tn("v1.5.0 [major]") === '["MAJOR"]' && tn("v1.4.3 [HOTFIX] [HOTFIX]") === '["HOTFIX"]' && tn("v1.5.0 [HOTFIX] [MAJOR] [BETA]") === '["MAJOR","HOTFIX"]' && tn("v1.4.2 [minor] [hotfix]") === '["MINOR","HOTFIX"]', "tags: tagsFromName must read every tag in a release title, in a fixed order");
  const withTags = ctx.latestFromFeed('<feed><entry><title>v1.4.2 [HOTFIX]</title><link href="https://github.com/x/y/releases/tag/v1.4.2"/></entry></feed>');
  check(withTags && withTags[1] === "1.4.2" && JSON.stringify(withTags.tags) === '["HOTFIX"]', "tags: the fallback update check must carry the tags");
  check(/tags: tagsFromName\(rel\.name\)/.test(main) && /tags: tagsFromName\(info && info\.releaseName\)/.test(main), "tags: the update check and the updater must pass the tags on");
}

/* 4. "1 card(s)" reads properly */
{
  const text = cut(app, "  function fixPlurals(t) {", "\n  function add(", "fixPlurals");
  const f = new Function(text + ";return fixPlurals;")();
  [["1 card(s)", "1 card"], ["0 reminder(s) today", "0 reminders today"], ["3 card(s)", "3 cards"], ["2 box(es)", "2 boxes"], ["1 box(es)", "1 box"], ["nothing to change", "nothing to change"]].forEach(([i, w]) => check(f(i) === w, "plurals: " + i + " should become " + w));
}

/* 4b. every build says what kind of update it is, as separate tags, and the tags match the number */
{
  const list = (name) => {
    const m = new RegExp("var " + name + " = (\\[[^\\]]*\\]);").exec(app);
    if (!m) return null;
    try {
      return JSON.parse(m[1]);
    } catch (e) {
      return null;
    }
  };
  const val = (name) => (new RegExp("var " + name + " = \"([^\"]*)\"").exec(app) || [])[1];
  const KINDS_OK = ["MAJOR", "MINOR", "STABILITY", "HOTFIX"];
  [["VERSION_DESKTOP", "TAG_DESKTOP"], ["VERSION_BROWSER", "TAG_BROWSER"]].forEach(([vn, tn2]) => {
    const v = val(vn),
      tg = list(tn2);
    check(Array.isArray(tg) && tg.length > 0 && tg.every((x) => KINDS_OK.indexOf(x) >= 0) && new Set(tg).size === tg.length, "tags: " + tn2 + " must be a list of MAJOR, MINOR, STABILITY and/or HOTFIX, each once (it is " + JSON.stringify(tg) + ")");
    if (Array.isArray(tg)) {
      check(tg.filter((x) => x !== "HOTFIX").length <= 1, "tags: " + tn2 + " can have one of MAJOR, MINOR or STABILITY, plus HOTFIX if the update is released again with a fix");
      check(tg.join() === KINDS_OK.filter((x) => tg.indexOf(x) >= 0).join(), "tags: " + tn2 + " must be written in the order MAJOR, MINOR, STABILITY, HOTFIX");
      if (v) check(/^\d+\.\d+\.0$/.test(v) ? tg.indexOf("MAJOR") >= 0 : tg.indexOf("MAJOR") < 0, "tags: " + tn2 + " (" + tg.join("+") + ") doesn't fit version " + v + ": a version ending in .0 is MAJOR, anything else is not");
    }
  });
  check(/tagChip\(TAG\)/.test(app) && /function tagChip\(/.test(app), "tags: the version in About must show its tag chips");
  /* the helpers that read, order and describe tags */
  const parts = cut(app, "  var TAG_ORDER = ", "  function featureChip(tag) {", "the tag helpers") + cut(app, "  function tagWord(t) {", "  function tagChip(x) {", "tagWord") + cut(app, "  function tagWords(x) {", "  function paintTagged(", "tagWords and tagToken") + cut(app, "  function tagsFromTitle(name) {", "  function updNote(text) {", "tagsFromTitle");
  const tctx = { isStr: (x) => typeof x === "string" };
  vm.createContext(tctx);
  vm.runInContext(parts + ";this.allTags=allTags;this.tagWords=tagWords;this.tagToken=tagToken;this.tagsFromTitle=tagsFromTitle;", tctx);
  const J = (x) => JSON.stringify(x);
  check(J(tctx.allTags(["HOTFIX", "major", "HOTFIX", "evil", 5, null])) === '["MAJOR","HOTFIX"]' && J(tctx.allTags("minor")) === '["MINOR"]' && J(tctx.allTags([])) === "[]" && J(tctx.allTags(undefined)) === "[]", "tags: allTags must keep real tags only, once each, in a fixed order");
  check(tctx.tagWords(["MAJOR", "HOTFIX"]) === " (a Major update and a Hotfix)" && tctx.tagWords("STABILITY") === " (a Stability update)" && tctx.tagWords([]) === "", "tags: the sentence for several tags must read naturally");
  check(tctx.tagToken(["HOTFIX", "MINOR"]) === "{tag:MINOR}{tag:HOTFIX}" && tctx.tagToken([]) === "", "tags: tag tokens in notes must list every tag");
  check(J(tctx.tagsFromTitle("v1.5.0 [HOTFIX] [MAJOR] [BETA]")) === '["MAJOR","HOTFIX"]' && J(tctx.tagsFromTitle("v1.4.1")) === "[]", "tags: tagsFromTitle must read every tag in a title, in a fixed order");
}

/* 4b2. the storage breakdown adds up: every kind of stored text lands in exactly one slice, and daily snapshots count as copies */
{
  const text = cut(app, "  function storageBreakdown() {", "  function fmtSize(n) {", "the storage breakdown");
  const KEY = "focusdesk96.v1";
  const S = { notes: [{ text: "a".repeat(300) }], images: {}, cards: [] };
  const main = JSON.stringify(S);
  const store = {};
  store[KEY] = main;
  store[KEY + ".bak"] = main;
  store[KEY + ".baktime"] = "123";
  store["focusdesk96.bak.daily.2026-10-20"] = main;
  store["focusdesk96.bak.daily.2026-10-21"] = main;
  store["focusdesk96.bak.daily.2026-10-22"] = main;
  store[KEY + ".wall"] = "w".repeat(40);
  store["focusdesk96.calfeed"] = "c".repeat(25);
  store["some.other.site.key"] = "o".repeat(17);
  const keys = Object.keys(store);
  const ctx = { KEY, WALLKEY: KEY + ".wall", S, JSON, Math, localStorage: { get length() { return keys.length; }, key: (i) => keys[i], getItem: (k) => store[k] } };
  vm.createContext(ctx);
  vm.runInContext(text + ";this.storageBreakdown=storageBreakdown;", ctx);
  const bd = ctx.storageBreakdown();
  const sum = bd.notes + bd.pics + bd.cards + bd.other + bd.copies + bd.outside;
  check(bd && sum === bd.total, "storage bar: the slices must add up to the total (slices " + (bd && sum) + ", total " + (bd && bd.total) + ")");
  check(bd && bd.dailyCount === 3 && bd.dailyLen === 3 * ("focusdesk96.bak.daily.2026-10-20".length + main.length), "storage bar: the daily snapshots must be counted, as their own length");
  check(bd && bd.copies === bd.dailyLen + (KEY + ".bak").length + main.length + (KEY + ".baktime").length + 3, "storage bar: restore points and daily snapshots must all count as copies");
  check(bd && bd.notes + bd.cards + (bd.pics - 40 - (KEY + ".wall").length) + (bd.other - ("focusdesk96.calfeed".length + 25)) === (KEY + "").length + main.length, "storage bar: your data (notes, cards, pictures, the rest) must add up to what is saved, and snapshots must not be in it");
  check(bd && bd.outside === "some.other.site.key".length + 17, "storage bar: other sites' keys must be counted as outside");
  check(/Delete daily snapshots/.test(app) && /storageBar\.style\.display = "none"/.test(app) && !/min-height:150px/.test(app), "storage bar: no fixed empty space under the bar");
}

/* 4b3. Undo puts deleted things back exactly where they were; duplicates are recognised carefully */
{
  const kindsAt = app.indexOf("  var TRASH_KINDS = [");
  const kindsText = kindsAt >= 0 ? app.slice(kindsAt, app.indexOf("];", kindsAt) + 2) : "";
  const start = app.indexOf("  var TRASH_LABELS = {");
  const pure = start >= 0 ? kindsText + "\n" + app.slice(start, app.indexOf("  /* ---- Undo: a small bar", start)) : "";
  check(pure.indexOf("function softDelete(") >= 0 && pure.indexOf("function restoreMany(") >= 0, "undo: couldn't find the bin code (was it renamed?)");
  const mk = () => {
    const ctx = { S: { trash: [], folders: [], notes: [], tasks: [] }, saved: 0, noted: 0, n: 0, isNum: (x) => typeof x === "number" && isFinite(x), clip: (s) => String(s), uid: () => "u" + ++ctx.n, save() { ctx.saved++; }, refreshAll() {}, noteDeleted(m) { ctx.noted += m.length; }, Date, Array, Math, String, Number };
    vm.createContext(ctx);
    vm.runInContext(pure + ";this.softDelete=softDelete;this.restoreMany=restoreMany;this.restoreTrash=restoreTrash;", ctx);
    return ctx;
  };
  const J = (x) => JSON.stringify(x);
  const ids = (a) => a.map((x) => x.id).join("");
  {
    const c = mk();
    c.S.tasks = ["a", "b", "c", "d", "e"].map((id) => ({ id: id, text: id }));
    c.softDelete("tasks", (x) => x.id === "b" || x.id === "d");
    check(ids(c.S.tasks) === "ace" && c.S.trash.length === 2 && c.noted === 2, "undo: deleting must move the items to the bin and offer Undo for both");
    c.restoreMany(c.S.trash.map((t) => t.id));
    check(ids(c.S.tasks) === "abcde" && c.S.trash.length === 0, "undo: restoring several items must put each back where it was (got " + ids(c.S.tasks) + ")");
  }
  {
    const c = mk();
    c.S.notes = [{ id: "n1" }, { id: "n2" }, { id: "n3" }];
    c.S.folders = [{ id: "f1", note: ["n2", "n3"], assign: [] }, { id: "f2", note: ["n2"], assign: [] }];
    c.softDelete("notes", (x) => x.id === "n2");
    check(J(c.S.folders.map((f) => f.note)) === '[["n3"],[]]', "undo: deleting a note takes it out of its folders");
    c.restoreTrash(c.S.trash[0].id);
    check(ids(c.S.notes) === "n1n2n3" && J(c.S.folders.map((f) => f.note.slice().sort())) === '[["n2","n3"],["n2"]]', "undo: restoring a note must also put it back in the folders it was in");
  }
  {
    const c = mk();
    c.S.tasks = [{ id: "a" }, { id: "b" }];
    c.softDelete("tasks", (x) => x.id === "a");
    c.S.trash[0].idx = 999; /* a position that no longer exists, or a made-up one */
    c.restoreMany([c.S.trash[0].id]);
    check(ids(c.S.tasks) === "ba", "undo: a position past the end goes to the end");
    c.softDelete("tasks", (x) => x.id === "b");
    c.S.trash[0].idx = -4;
    c.restoreMany([c.S.trash[0].id]);
    check(ids(c.S.tasks) === "ab", "undo: a negative position is ignored and the item goes to the end (got " + ids(c.S.tasks) + ")");
    c.S.tasks = [{ id: "z" }];
    c.softDelete("tasks", (x) => x.id === "z");
    c.S.tasks = [{ id: "z" }];
    c.restoreMany([c.S.trash[0].id]);
    check(c.S.tasks.length === 2 && c.S.tasks[0].id !== c.S.tasks[1].id, "undo: an item whose id is now taken must get a new id, never overwrite");
    const before = c.S.trash.length;
    c.restoreMany(["no-such-id"]);
    check(c.S.trash.length === before, "undo: an unknown id restores nothing");
  }
  const dstart = app.indexOf("  function dupKey(s) {");
  const dtext = dstart >= 0 ? app.slice(dstart, app.indexOf("  /* call right after something typed in was added", dstart)) : "";
  const d = { S: { tasks: [{ id: "1", text: "Buy  Milk", done: false }, { id: "2", text: "Old", done: true }], cards: [{ id: "c1", q: "Capital of France?", deck: "Geo" }], events: [{ id: "e1", title: "Chem lab", date: "2026-11-03", time: "10:00" }], assign: [{ id: "a1", title: "Essay", course: "ENG", due: 5 }], reminders: [{ id: "r1", text: "Call mum", at: 1000000, done: false }] }, String, Math };
  vm.createContext(d);
  vm.runInContext(dtext + ";this.findDuplicate=findDuplicate;", d);
  const fd = (k, it) => !!d.findDuplicate(k, it);
  check(fd("tasks", { id: "9", text: "  buy milk " }) && !fd("tasks", { id: "9", text: "Buy bread" }) && !fd("tasks", { id: "9", text: "Old" }) && !fd("tasks", { id: "9", text: "" }), "duplicates: tasks match on the words, ignoring case and spacing, never on finished or empty ones");
  check(fd("cards", { id: "9", q: "capital of france?", deck: "geo" }) && !fd("cards", { id: "9", q: "Capital of France?", deck: "Other" }), "duplicates: a card only matches within the same deck");
  check(fd("events", { id: "9", title: "chem LAB", date: "2026-11-03", time: "10:00" }) && !fd("events", { id: "9", title: "Chem lab", date: "2026-11-04", time: "10:00" }) && !fd("events", { id: "9", title: "Chem lab", date: "2026-11-03", time: "" }), "duplicates: an event matches on title, day and time");
  check(fd("assign", { id: "9", title: "essay", course: "eng", due: 5 }) && !fd("assign", { id: "9", title: "Essay", course: "ENG", due: 6 }), "duplicates: an assignment matches on title, course and due date");
  check(fd("reminders", { id: "9", text: "call mum", at: 1000000 + 30000 }) && !fd("reminders", { id: "9", text: "call mum", at: 1000000 + 120000 }), "duplicates: a reminder matches on the words and the same minute");
  const x = d.S.tasks[0];
  check(!d.findDuplicate("tasks", x), "duplicates: an item is never a duplicate of itself");
  check(/dupNoticeLast\("tasks"\)/.test(app) && /dupNoticeLast\("cards"\)/.test(app) && /dupNoticeLast\("events"\)/.test(app) && /dupNoticeLast\("reminders"\)/.test(app) && /dupNoticeLast\("assign"\)/.test(app), "duplicates: every add point must check for a duplicate");
}

/* 4b4. the desktop backup and crash-log helpers (own file: they are asynchronous) */
{
  const r = require("child_process").spawnSync(process.execPath, [path.join(__dirname, "selftest-desktop.js")], { encoding: "utf8" });
  check(r.status === 0, "desktop helpers: " + String((r.stdout || "") + (r.stderr || "")).trim().split("\n").slice(0, 4).join(" | "));
  check(/makeBackups\(/.test(main) && /makeCrashLog\(/.test(main) && /"backup\.js"/.test(read("package.json")) && /"crashlog\.js"/.test(read("package.json")), "desktop helpers: main.js must use them and package.json must ship them");
  check(/uncaughtException/.test(main) && /render-process-gone/.test(main) && /focusdesk:crashSend/.test(main), "crash log: the app must record crashes");
  check(!/crashSend[\s\S]{0,900}(fetch|net\.request|https\.request|http\.request)/.test(main), "crash log: nothing may ever be sent automatically (sending only opens the issue page)");
}

/* 4c. desktop: the red number on the Dock (Mac), the taskbar and Linux badges, and the Windows taskbar menu */
{
  const text = cut(main, "function applyDue() {", "\nfunction ensureTray", "applyDue");
  const mk = (platform, dprefsOver, dueOver, noDock) => {
    const calls = { dock: [], count: [], overlay: [] };
    const ctx = {
      process: { platform: platform },
      due: Object.assign({ cards: 0, tasks: 0, assign: 0, badge: "data:image/png;base64,x" }, dueOver || {}),
      dprefs: Object.assign({ taskbarBadge: true }, dprefsOver || {}),
      tray: null,
      mainWindow: { isDestroyed: () => false, setOverlayIcon: (i, t) => calls.overlay.push([i ? "icon" : "none", t]) },
      nativeImage: { createFromDataURL: () => ({ fake: true }) },
      app: { setBadgeCount: (n) => calls.count.push(n), dock: platform === "darwin" && !noDock ? { setBadge: (t) => calls.dock.push(t) } : undefined },
      buildTrayMenu: () => ({}),
      calls: calls,
    };
    vm.createContext(ctx);
    vm.runInContext(text + ";this.applyDue = applyDue;", ctx);
    ctx.applyDue();
    return calls;
  };
  check(JSON.stringify(mk("darwin", {}, { tasks: 2, assign: 1 }).dock) === '["3"]', "dock: a Mac shows the number of things due on the Dock icon when the setting is on");
  check(JSON.stringify(mk("darwin", { taskbarBadge: false }, { tasks: 2 }).dock) === '[""]', "dock: a Mac clears the Dock number when the setting is off");
  check(JSON.stringify(mk("darwin", {}, {}).dock) === '[""]', "dock: a Mac shows no number when nothing is due");
  check(JSON.stringify(mk("darwin", {}, { cards: 1500 }).dock) === '["999+"]', "dock: a huge number is shown as 999+");
  check(mk("darwin", {}, { tasks: 1 }, true).dock.length === 0, "dock: no Dock (or an old Electron) must not crash");
  check(JSON.stringify(mk("linux", {}, { tasks: 4 }).count) === "[4]" && mk("linux", {}, { tasks: 4 }).dock.length === 0, "badge: Linux uses its badge count and leaves the Mac code alone");
  const w = mk("win32", {}, { tasks: 2 }).overlay;
  check(w.length === 1 && w[0][0] === "icon" && w[0][1] === "2 due", "badge: Windows shows the red number on the taskbar icon");
  check(mk("win32", { taskbarBadge: false }, { tasks: 2 }).overlay[0][0] === "none", "badge: Windows clears it when the setting is off");
  /* the quick actions (right-click menu on the Windows taskbar icon, and the command line) */
  const qtext = cut(main, "function quickFromArgs(argv) {", "\nfunction sendCmd", "quickFromArgs");
  const log = [];
  const qctx = { openCapture: (k) => log.push("capture:" + k), sendCmd: (c) => log.push("cmd:" + c), openNowPlaying: () => log.push("np"), openClipyChat: (q) => log.push("clipy:" + q), openMiniTimer: () => log.push("mini") };
  vm.createContext(qctx);
  vm.runInContext(qtext + ";this.quickFromArgs=quickFromArgs;this.runQuick=runQuick;", qctx);
  ["task", "card", "timer", "nowplaying", "askclipy", "minitimer"].forEach((k) => check(qctx.quickFromArgs(["x", "--quick=" + k]) === k, "taskbar menu: --quick=" + k + " must be understood"));
  check(qctx.quickFromArgs(["--quick=nonsense", "--quick=;rm"]) === "", "taskbar menu: an unknown or odd argument is ignored");
  qctx.runQuick("askclipy"); qctx.runQuick("minitimer"); qctx.runQuick("timer");
  check(log.join(",") === "clipy:,mini,cmd:timer-toggle", "taskbar menu: Ask Clipy opens Clipy, Mini timer opens the mini timer, the old timer entry still works", log.join(","));
  check(/task\("askclipy", "Ask Clipy"/.test(main) && /task\("minitimer", "Show the mini timer"/.test(main), "taskbar menu: the right-click menu must list Ask Clipy and the mini timer");
}

/* 4d. pop-out windows open where they were, and always somewhere you can see them */
{
  const text = cut(main, "function validBounds(b) {", "\nfunction mergeDprefs", "placePopout");
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(text + ";this.placePopout=placePopout;", ctx);
  const place = (saved, near, displays, nth) => ctx.placePopout(saved, near, displays, nth || 0);
  const one = [{ workArea: { x: 0, y: 0, width: 1920, height: 1040 } }];
  const two = [{ workArea: { x: 0, y: 0, width: 1920, height: 1040 } }, { workArea: { x: 1920, y: 0, width: 1280, height: 984 } }];
  const left = [{ workArea: { x: 0, y: 0, width: 1920, height: 1040 } }, { workArea: { x: -1600, y: 0, width: 1600, height: 900 } }];
  const inside = (r, a) => r.x >= a.x && r.y >= a.y && r.x + r.width <= a.x + a.width && r.y + r.height <= a.y + a.height;
  const A = one[0].workArea, B = two[1].workArea;
  let r = place({ x: 2000, y: 100, width: 900, height: 700, max: false }, { x: 100, y: 100, width: 1400, height: 900 }, two);
  check(r.x === 2000 && r.y === 100 && r.width === 900 && r.height === 700 && r.remembered, "pop-out: a remembered place on the second screen is used exactly as it was");
  r = place({ x: 2000, y: 100, width: 900, height: 700, max: true }, null, two);
  check(r.max === true, "pop-out: a window that was maximized comes back maximized");
  r = place({ x: 2000, y: 100, width: 900, height: 700, max: true }, { x: 100, y: 100, width: 1400, height: 900 }, one);
  check(inside(r, A) && r.width === 900 && r.height === 700 && !r.remembered && r.max === false, "pop-out: with the second screen unplugged it opens on the main screen at its remembered SIZE", JSON.stringify(r));
  r = place({ x: 100, y: 50, width: 3000, height: 2000, max: false }, null, one);
  check(inside(r, A) && r.width === 1920 && r.height === 1040, "pop-out: a remembered size bigger than the screen is cut down to fit", JSON.stringify(r));
  r = place({ x: 1800, y: 900, width: 900, height: 700, max: false }, null, one);
  check(inside(r, A) && r.width === 900 && r.height === 700, "pop-out: a window left half off the edge is moved fully back on screen", JSON.stringify(r));
  r = place({ x: -1500, y: 100, width: 800, height: 600, max: false }, null, left);
  check(r.x === -1500 && r.y === 100 && r.remembered, "pop-out: a screen to the left (negative coordinates) works");
  r = place(null, { x: 1000, y: 800, width: 900, height: 200 }, one);
  check(inside(r, A), "pop-out: a new window next to a main window at the bottom-right edge still opens fully on screen", JSON.stringify(r));
  r = place(null, { x: 2100, y: 60, width: 1000, height: 800 }, two);
  check(inside(r, B), "pop-out: a new window opens on the same screen as the main window (the second one here)", JSON.stringify(r));
  const a0 = place(null, { x: 100, y: 100, width: 1200, height: 800 }, one, 0), a1 = place(null, { x: 100, y: 100, width: 1200, height: 800 }, one, 1);
  check(a1.x === a0.x + 28 && a1.y === a0.y + 28, "pop-out: each new window is cascaded a little from the last");
  check(inside(place(null, { x: 100, y: 100, width: 1200, height: 800 }, one, 40), A), "pop-out: many windows never walk off the screen");
  r = place({ x: 5, y: 5, width: 50, height: 50 }, null, one);
  check(inside(r, A) && !r.remembered && r.width === 900, "pop-out: a nonsense remembered size is ignored");
  r = place({ x: 0, y: 0, width: 900, height: 700 }, null, []);
  check(typeof r.x === "number" && r.width >= 420, "pop-out: even with no screen information it gives a sensible answer");
  r = place({ x: 3000, y: 2000, width: 900, height: 700, max: false }, { x: 10, y: 10, width: 800, height: 600 }, one);
  check(inside(r, A) && r.width === 900, "pop-out: a place that is now off every screen is replaced by one that is on screen", JSON.stringify(r));
  /* the way it is built in main.js */
  check(/win\.setBounds\(\{ x: pl\.x/.test(main), "pop-out: the window is positioned again after it is created (Windows with mixed screen scaling)");
  check(/if \(pl\.max\) win\.maximize\(\);[^\n]*\n\s*win\.show\(\);/.test(main) && !/popoutBoundsFor/.test(main), "pop-out: maximizing happens when the window is shown");
  check(/setTimeout\(showNow, 6000\)/.test(main) && /did-fail-load/.test(main), "pop-out: a window can't stay invisible and a failed load is tried again");
  check(/resetPopoutBounds === true\) dprefs\.popoutBounds = \{\}/.test(main), "pop-out: the reset option clears the remembered places");
}

/* 4e. the 1.4.1 features stay wired up */
{
  const html = read("index.html"), css = read("focusdesk.css");
  check(/class="startlogo"/.test(html) && !/class="flag"/.test(html) && /\.startlogo \{[^}]*data:image\/png;base64,/.test(css), "start logo: the Start button must use the logo picture");
  const fs2 = require("fs");
  ["assets/trayTemplate.png", "assets/trayTemplate@2x.png"].forEach((f) => check(fs2.existsSync(path.join(__dirname, "..", f)), "mac icon: " + f + " must exist"));
  check(/trayTemplate\.png/.test(main) && /setTemplateImage\(true\)/.test(main), "mac icon: the Mac menu bar picture must be loaded as a template image");
  check(/function openControl\(section\)/.test(app) && /w\.jumpTo = function/.test(app) && /openControl\("Backup"\)/.test(app) && /openControl\("Storage"\)/.test(app) && /openControl\("Updates"\)/.test(app), "settings jump: the Start menu must open Control Panel at a section");
  check(/function storageBreakdown\(\)/.test(app) && /Restore points and copies/.test(app) && /Other things on this web address/.test(app), "storage bar: it must show the breakdown by kind of data");
  check(/contains system files/.test(app) && /function bakReadFile\(/.test(app) && /featureChip\("BETA"\)/.test(app) && /pickFailed\(e, "folder"\)/.test(app), "backup folder: help, real errors and the BETA file option must be there");
  /* Clipy changing things: it must ALWAYS ask first, only touch things made by hand, and only by the codes it was given */
  check(/if \(S\.prefs\.clipyAuto && !acts\.some\(isEditAct\)\) return applyClipyActs\(acts\);/.test(app), "clipy edits: changing things must always ask first, even with add-without-asking on");
  check(/function clipyEditable\(kind, it\) \{[\s\S]{0,400}it\.repeat[\s\S]{0,200}it\.src === "manual"/.test(app), "clipy edits: things from Apple, Canvas or feeds, and repeating things, must be left alone");
  check(/\/\^\[TAER\]\\d\{1,3\}\$\//.test(app) && /!refs\[ref\]/.test(app), "clipy edits: only codes from the list Clipy was shown are accepted");
  check(/extractClipyActions\(t, refs\.map\)/.test(app) && /clipyBuildRefs\(v\)/.test(app), "clipy edits: the reply must be checked against the list it was given");
  check(/it\[x\.f\] !== x\.a\) return; \/\* you changed this yourself/.test(app), "clipy edits: Undo must not overwrite something you changed yourself afterwards");
  check(/\.tagchip\.tag-beta/.test(css), "tags: the BETA feature chip must be styled");
}

/* 5. other tabs and windows can't replace your data with junk */
check(/function applyExternal\(data\) \{\n\s*\/\*[^\n]*\*\/\n\s*if \(!isObj\(data\) \|\| Array\.isArray\(data\)/.test(app), "sync: applyExternal must check that incoming data looks like FocusDesk data");

if (fails.length) {
  console.error("selftest: FAILED\n  " + fails.join("\n  "));
  process.exit(1);
}
console.log("selftest: ok (graphing safety, note link safety, address blocking, beta-proof update check, version tags, plurals, sync guard)");
