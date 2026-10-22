#!/usr/bin/env node
"use strict";
/*
 * Builds the public update-schedule page from schedule.json, and (when asked) from GitHub's list of releases.
 *   node scripts/build-roadmap.js                      writes ROADMAP.md and roadmap.html from schedule.json alone
 *   node scripts/build-roadmap.js --check              fails if those two files are out of date
 *   node scripts/build-roadmap.js --releases r.json --out site
 *        also reads the published releases: a published release is ticked off and moves to "Recently released",
 *        a published pre-release shows as a BETA, and the current version and the cycle count follow the releases
 *   --root <folder>   read schedule.json from, and write to, another folder (the self-test uses this)
 * Tags (MAJOR, MINOR, STABILITY, HOTFIX, BETA) are separate labels shown beside a version. They are never part of the number.
 * A release gets its tags from square brackets in its title, like "v1.4.1 [MINOR]", and a pre-release always counts as BETA.
 */
const fs = require("fs");
const path = require("path");
const arg = (n) => {
  const i = process.argv.indexOf(n);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : null;
};
const root = arg("--root") || path.join(__dirname, "..");
const relFile = arg("--releases");
const outDir = arg("--out") || root;
let data = JSON.parse(fs.readFileSync(path.join(root, "schedule.json"), "utf8"));

const REPO = "https://github.com/apojidelegraphics/FocusDesk-96";
const SITE = "https://apojidelegraphics.github.io/FocusDesk-96/";
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const KINDS = { major: "MAJOR", minor: "MINOR", stability: "STABILITY", hotfix: "HOTFIX" };
/* an item in an update's list is plain text, or { "text": "...", "tags": ["BETA"] } to put a tag beside that one feature */
const FEATURE_TAGS = ["BETA"];
const itemOf = (i) => (typeof i === "string" ? { text: i, tags: [] } : { text: i && i.text, tags: (i && i.tags) || [] });
const STATUS = { planned: "Planned", "in-progress": "In progress", testing: "Testing", shipped: "Shipped", delayed: "Delayed", unplanned: "Not planned yet" };

function fail(msg) {
  console.error("build-roadmap: " + msg);
  process.exit(1);
}
function day(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
  if (!m) fail("bad date: " + iso);
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return DAYS[d.getUTCDay()] + " " + +m[3] + " " + MONTHS[+m[2] - 1] + " " + m[1];
}

/* ---------- reading the published releases ---------- */
const normVer = (t) => {
  const m = /^v?(\d+)\.(\d+)(?:\.(\d+))?$/.exec(String(t || "").trim());
  return m ? [+m[1], +m[2], +(m[3] || 0)] : null;
};
const verStr = (v) => v.join(".");
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
function parseTags(name) {
  const out = [];
  String(name || "").replace(/\[([A-Za-z]+)\]/g, (m, w) => {
    w = w.toUpperCase();
    if (["MAJOR", "MINOR", "STABILITY", "HOTFIX", "BETA"].indexOf(w) >= 0 && out.indexOf(w) < 0) out.push(w);
    return m;
  });
  return out;
}
function kindFromTags(tags) {
  for (const k of ["HOTFIX", "STABILITY", "MAJOR", "MINOR"]) if (tags.indexOf(k) >= 0) return k.toLowerCase();
  return "";
}
/* the first plain sentence of a release's notes (skips the title, headings, lists and tables) */
function firstLine(body) {
  const lines = String(body || "").replace(/\r\n/g, "\n").split("\n");
  for (const raw of lines) {
    const t = raw.trim();
    if (!t || /^(#|---|\||[-*+] |\d+\. |>|```|<)/.test(t)) continue;
    let s = t.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").trim();
    if (s.length > 320) s = s.slice(0, 317).replace(/\s+\S*$/, "") + "...";
    return s;
  }
  return "";
}
function monthYear(iso) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : MONTHS[d.getUTCMonth()] + " " + d.getUTCFullYear();
}
function mergeReleases(d, releases) {
  const out = JSON.parse(JSON.stringify(d));
  const pubs = (Array.isArray(releases) ? releases : [])
    .filter((r) => r && !r.draft && normVer(r.tag_name))
    .map((r) => {
      const tags = parseTags(r.name);
      let browser = "";
      (r.assets || []).forEach((a) => {
        const m = /^FocusDesk-96-Browser-(\d+(?:\.\d+)*)\.zip$/.exec((a && a.name) || "");
        if (m) browser = m[1];
      });
      return { v: normVer(r.tag_name), tags: tags, beta: !!r.prerelease || tags.indexOf("BETA") >= 0, date: r.published_at || r.created_at || "", name: String(r.name || r.tag_name), body: String(r.body || ""), browser: browser };
    });
  const finals = pubs.filter((p) => !p.beta).sort((a, b) => cmp(b.v, a.v));
  const betas = pubs.filter((p) => p.beta);
  const same = (u, p) => {
    const v = normVer(u.desktop || u.version);
    return !!v && cmp(v, p.v) === 0;
  };
  out.upcoming = (out.upcoming || []).filter((u) => !finals.some((p) => same(u, p)));
  out.upcoming.forEach((u) => {
    if (betas.some((p) => same(u, p))) {
      u.beta = true;
      u.status = "testing";
      u.note = "A beta is out for testing. Download it from the releases page. The automatic updater skips it.";
    }
  });
  if (finals.length) {
    const top = finals[0];
    out.current = { desktop: verStr(top.v), browser: top.browser || (out.current && out.current.browser) || "" };
    out.currentTags = kindFromTags(top.tags) ? [kindFromTags(top.tags).toUpperCase()] : [];
    if (out.cycle) {
      const shipped = finals.filter((p) => p.v[0] === top.v[0] && p.v[1] === top.v[1] && p.v[2] >= 1 && kindFromTags(p.tags) !== "hotfix").length;
      out.cycle = { major: top.v[0] + "." + top.v[1], minors: out.cycle.minors, shipped: Math.min(shipped, out.cycle.minors), nextMajor: top.v[0] + "." + (top.v[1] + 1) };
    }
  }
  const hand = out.released || [];
  const handVer = (h) => {
    const m = /^(\d+\.\d+(?:\.\d+)?)/.exec(h.version || "");
    return m ? normVer(m[1]) : null;
  };
  const list = finals.map((p) => {
    const h = hand.find((x) => handVer(x) && cmp(handVer(x), p.v) === 0);
    return { version: verStr(p.v) + (p.browser ? " / " + p.browser : ""), kind: kindFromTags(p.tags) || (h && h.kind) || "", date: monthYear(p.date) || (h && h.date) || "", summary: (h && h.summary) || firstLine(p.body) || p.name };
  });
  hand.forEach((h) => {
    const v = handVer(h);
    if (v && !finals.some((p) => cmp(p.v, v) === 0)) list.push(h);
  });
  out.released = list.slice(0, 12);
  out.updated = new Date().toISOString().slice(0, 10);
  return out;
}
if (relFile) {
  let rel = [];
  try {
    rel = JSON.parse(fs.readFileSync(relFile, "utf8"));
  } catch (e) {
    console.error("build-roadmap: couldn't read " + relFile + ", using schedule.json alone");
  }
  data = mergeReleases(data, rel);
}

/* ---------- checking the data ---------- */
if (!Array.isArray(data.upcoming)) fail("schedule.json needs an upcoming list (it can be empty)");
data.upcoming.forEach((u) => {
  if (!STATUS[u.status]) fail("unknown status: " + u.status);
  if (!KINDS[u.kind]) fail("update " + u.version + " needs a kind: major, minor, stability or hotfix");
  if (u.beta !== undefined && typeof u.beta !== "boolean") fail("update " + u.version + ": beta must be true or false");
  (u.items || []).forEach((raw) => {
    const it = itemOf(raw);
    if (typeof it.text !== "string" || !it.text.trim()) fail("update " + u.version + ": every item needs some text");
    if (!Array.isArray(it.tags) || it.tags.some((t) => FEATURE_TAGS.indexOf(t) < 0)) fail("update " + u.version + ': a feature tag must be one of ' + FEATURE_TAGS.join(", ") + " (in: " + it.text.slice(0, 40) + ")");
  });
  const okNumber = u.kind === "major" ? /^\d+\.\d+$/ : /^\d+\.\d+\.\d+$/;
  if (!okNumber.test(u.version)) fail("update " + u.version + " doesn't look like a " + u.kind + " version number");
  day(u.target);
});
const cyc = data.cycle;
if (cyc && !(cyc.major && cyc.minors > 0 && cyc.shipped >= 0 && cyc.nextMajor)) fail("schedule.json cycle needs major, minors, shipped and nextMajor");
const cycleText = cyc ? "This cycle (" + cyc.major + "): " + cyc.shipped + " of " + cyc.minors + " Minor updates shipped. The fifth Minor update is the stability update. The next Major update is " + cyc.nextMajor + "." : "";
const next = data.upcoming.find((u) => u.status !== "shipped" && u.status !== "unplanned") || data.upcoming[0] || null;
const tagList = (u) => (u && KINDS[u.kind] ? [KINDS[u.kind]] : []).concat(u && u.beta ? ["BETA"] : []);

/* ---------- Markdown (shown on GitHub) ---------- */
const mdTags = (u) => tagList(u).map((t) => "`" + t + "`").join(" ");
const md = [];
md.push("# FocusDesk 96 update schedule", "");
md.push("*" + data.policy.headline + "*", "");
md.push("**Next update:** " + (next ? (next.when || day(next.target)) + " - version " + next.version + " " + mdTags(next) + ", " + next.title + "." : "being planned. Check back soon."), "");
md.push("**Right now:** desktop app " + data.current.desktop + ", browser version " + data.current.browser + ". [Latest release](" + REPO + "/releases/latest)", "");
if (cycleText) md.push("**" + cycleText + "**", "");
md.push("The same schedule is on the website: " + SITE + "roadmap.html", "");
md.push("## How updates work", "");
data.policy.points.forEach((p) => md.push("- " + p));
md.push("", "## Coming up", "");
if (!data.upcoming.length) md.push("Nothing is scheduled yet. The next cycle is being planned.", "");
data.upcoming.forEach((u) => {
  md.push("### " + (u.version === "next" ? "Next" : "Version " + u.version) + ": " + u.title, "");
  md.push("- **Tag:** " + mdTags(u));
  if (u.beta) md.push("- **Stage:** Beta. Published as a pre-release for testing, so the automatic updater skips it.");
  md.push("- **When:** " + (u.when || day(u.target)) + " (" + STATUS[u.status].toLowerCase() + ")");
  if (u.desktop || u.browser) md.push("- **Versions:** desktop " + (u.desktop || "-") + ", browser " + (u.browser || "-"));
  u.items.forEach((raw) => {
    const it = itemOf(raw);
    md.push("- " + it.text + (it.tags.length ? " " + it.tags.map((t) => "`" + t + "`").join(" ") : ""));
  });
  if (u.note) md.push("- *" + u.note + "*");
  md.push("");
});
md.push("Dates are targets. If something isn't ready or hasn't been tested, it moves, and this page says so.", "");
md.push("## Recently released", "", "| Version | Tag | When | What |", "| --- | --- | --- | --- |");
data.released.forEach((r) => md.push("| " + r.version + " | " + (KINDS[r.kind] ? "`" + KINDS[r.kind] + "`" : "") + " | " + r.date + " | " + r.summary.replace(/\|/g, "/") + " |"));
md.push("", "## Stay in the loop", "");
data.policy.notified.forEach((n) => md.push("- " + n));
md.push("- [All releases](" + REPO + "/releases), [releases feed](" + REPO + "/releases.atom)");
md.push("- Found a problem or want a feature? [Open an issue](" + REPO + "/issues/new/choose)", "");
md.push("_Last updated " + data.updated + ". This page is generated from schedule.json" + (relFile ? " and the published releases" : "") + "._", "");
const mdText = md.join("\n");

/* ---------- HTML (the website page) ---------- */
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/[^\x20-\x7e\n]/g, (c) => "&#x" + c.codePointAt(0).toString(16) + ";");
const li = (arr) => "<ul>" + arr.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul>";
const itemList = (items) =>
  "<ul>" +
  items
    .map((raw) => {
      const it = itemOf(raw);
      return "<li>" + esc(it.text) + it.tags.map((t) => ' <span class="badge ' + esc(t.toLowerCase()) + '">' + esc(t) + "</span>").join("") + "</li>";
    })
    .join("") +
  "</ul>";
const chips = (u) =>
  (u && KINDS[u.kind] ? '<span class="badge kind ' + esc(u.kind) + '">' + esc(KINDS[u.kind]) + "</span>" : "") + (u && u.beta ? '<span class="badge beta">BETA</span>' : "");
const cards = data.upcoming.length
  ? data.upcoming
      .map(
        (u) =>
          '<section class="card"><div class="row"><h3>' +
          esc((u.version === "next" ? "Next" : "Version " + u.version) + ": " + u.title) +
          '</h3><span><span class="badge ' +
          esc(u.status) +
          '">' +
          esc(STATUS[u.status]) +
          "</span>" +
          chips(u) +
          "</span></div>" +
          '<p class="when">' +
          esc(u.when || day(u.target)) +
          (u.desktop || u.browser ? " &middot; desktop " + esc(u.desktop || "-") + ", browser " + esc(u.browser || "-") : "") +
          "</p>" +
          itemList(u.items) +
          (u.note ? '<p class="note">' + esc(u.note) + "</p>" : "") +
          "</section>"
      )
      .join("")
  : '<p class="card">Nothing is scheduled yet. The next cycle is being planned.</p>';
const rows = data.released.map((r) => "<tr><td><b>" + esc(r.version) + "</b> " + chips({ kind: r.kind }) + "</td><td>" + esc(r.date) + "</td><td>" + esc(r.summary) + "</td></tr>").join("");
const nextHtml = next
  ? '<div class="big">Next update: ' + esc(next.when || day(next.target)) + "</div><div>Version " + esc(next.version) + " " + chips(next) + " &mdash; " + esc(next.title) + "</div>"
  : '<div class="big">Next update: being planned</div><div>The next updates will be listed here soon.</div>';
const html =
  '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1" />\n<title>FocusDesk 96 - Update Schedule</title>\n<style>\n' +
  "html{background:#008080}body{margin:0;padding:16px;font:14px/1.45 Tahoma,'MS Sans Serif',Verdana,Arial,sans-serif;color:#000}\n" +
  ".win{max-width:780px;margin:0 auto;background:#c0c0c0;border:2px solid;border-color:#fff #404040 #404040 #fff;outline:1px solid #000;box-shadow:4px 4px 0 rgba(0,0,0,.35)}\n" +
  ".title{background:linear-gradient(90deg,#000080,#1084d0);color:#fff;font-weight:bold;padding:4px 8px}\n" +
  ".body{padding:12px}h1{font-size:20px;margin:0 0 4px}h2{font-size:15px;margin:18px 0 6px;border-bottom:1px solid #808080}h3{font-size:14px;margin:0}\n" +
  ".panel{background:#fff;border:2px inset #808080;padding:10px;margin:8px 0}.big{font-size:16px;font-weight:bold}\n" +
  ".card{background:#fff;border:2px inset #808080;padding:8px 10px;margin:8px 0}.row{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap}\n" +
  ".badge{font-size:11px;padding:1px 6px;border:1px solid #000;background:#ffffa0}.badge.testing,.badge.in-progress{background:#a0e0ff}.badge.shipped{background:#a0f0a0}.badge.delayed{background:#ffb0b0}.badge.unplanned{background:#e0e0e0}\n" +
  ".kind{background:#e8e8ff}.kind.major{background:#ffe0a0}.kind.stability{background:#c8f0c8}.kind.hotfix{background:#ffc0c0}.beta{background:#ffd0ff}\n" +
  ".when{margin:4px 0;color:#000080;font-weight:bold}.note{margin:4px 0 0;font-style:italic}ul{margin:4px 0 4px 18px;padding:0}\n" +
  "table{border-collapse:collapse;width:100%;background:#fff}td,th{border:1px solid #808080;padding:4px 6px;text-align:left;vertical-align:top}th{background:#d4d0c8}\n" +
  ".tw{overflow-x:auto}a{color:#0000cc}.foot{color:#404040;font-size:12px;margin-top:14px}\n" +
  "</style>\n</head>\n<body>\n<div class=\"win\"><div class=\"title\">FocusDesk 96 - Update Schedule</div><div class=\"body\">\n" +
  "<h1>When does FocusDesk update?</h1><p>" +
  esc(data.policy.headline) +
  "</p>\n" +
  '<div class="panel">' +
  nextHtml +
  '<div class="foot" style="margin:6px 0 0">Right now: desktop app ' +
  esc(data.current.desktop) +
  ", browser version " +
  esc(data.current.browser) +
  '. <a href="' +
  REPO +
  '/releases/latest">Latest release</a> &middot; <a href="./">Open FocusDesk in your browser</a></div>' +
  (cycleText ? '<div class="foot" style="margin:6px 0 0"><b>' + esc(cycleText) + "</b></div>" : "") +
  "</div>\n" +
  "<h2>How updates work</h2>" +
  li(data.policy.points) +
  "<h2>Coming up</h2>" +
  cards +
  '<p class="foot">Dates are targets. If something isn\'t ready or hasn\'t been tested, it moves, and this page says so.</p>\n' +
  '<h2>Recently released</h2><div class="tw"><table><tr><th>Version</th><th>When</th><th>What</th></tr>' +
  rows +
  "</table></div>\n<h2>Stay in the loop</h2>" +
  li(data.policy.notified) +
  '<ul><li><a href="' +
  REPO +
  '/releases">All releases</a> &middot; <a href="' +
  REPO +
  '/releases.atom">releases feed</a></li><li>Found a problem or want a feature? <a href="' +
  REPO +
  '/issues/new/choose">Open an issue</a></li></ul>\n' +
  '<p class="foot">Last updated ' +
  esc(data.updated) +
  ".</p>\n</div></div>\n</body>\n</html>\n";

const out = { "ROADMAP.md": mdText, "roadmap.html": html };
if (process.argv.includes("--check")) {
  const stale = Object.keys(out).filter((f) => !fs.existsSync(path.join(root, f)) || fs.readFileSync(path.join(root, f), "utf8").replace(/\r\n/g, "\n") !== out[f]);
  if (stale.length) fail(stale.join(" and ") + " out of date. Run: node scripts/build-roadmap.js");
  console.log("roadmap check: ok");
} else if (relFile) {
  /* the website build: only the page, plus the tags of the current release for the browser's new-version bar */
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "roadmap.html"), html);
  const infoFile = path.join(outDir, "release-info.json");
  if (fs.existsSync(infoFile)) {
    try {
      const info = JSON.parse(fs.readFileSync(infoFile, "utf8"));
      info.tags = data.currentTags || [];
      fs.writeFileSync(infoFile, JSON.stringify(info));
    } catch (e) {}
  }
  console.log("wrote " + path.join(outDir, "roadmap.html") + " from the published releases (current: desktop " + data.current.desktop + ", browser " + data.current.browser + "; " + data.upcoming.length + " still coming up)");
} else {
  fs.mkdirSync(outDir, { recursive: true });
  Object.keys(out).forEach((f) => fs.writeFileSync(path.join(outDir, f), out[f]));
  console.log("wrote ROADMAP.md and roadmap.html (next update: " + (next ? next.when || day(next.target) : "being planned") + ")");
}
