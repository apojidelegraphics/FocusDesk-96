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
  check(tn("v1.4.2 [MINOR] [BETA]") === '["MINOR"]' && tn("v1.4.1") === "[]" && tn("v1.5.0 [major]") === '["MAJOR"]' && tn("v1.4.3 [HOTFIX] [HOTFIX]") === '["HOTFIX"]', "tags: tagsFromName must read the tags in a release title");
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

/* 4b. every build says what kind of update it is, as a separate tag, and the tag matches the number */
{
  const val = (name) => (new RegExp("var " + name + " = \"([^\"]*)\"").exec(app) || [])[1];
  [["VERSION_DESKTOP", "TAG_DESKTOP"], ["VERSION_BROWSER", "TAG_BROWSER"]].forEach(([vn, tn2]) => {
    const v = val(vn),
      tg = val(tn2);
    check(["MAJOR", "MINOR", "STABILITY", "HOTFIX"].indexOf(tg) >= 0, "tags: " + tn2 + " must be MAJOR, MINOR, STABILITY or HOTFIX (it is " + tg + ")");
    if (v) check(/^\d+\.\d+\.0$/.test(v) ? tg === "MAJOR" : tg !== "MAJOR", "tags: " + tn2 + " (" + tg + ") doesn't fit version " + v + ": a version ending in .0 is MAJOR, anything else is not");
  });
  check(/tagChip\(TAG\)/.test(app) && /function tagChip\(/.test(app), "tags: the version in About must show its tag chip");
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
