#!/usr/bin/env node
"use strict";
/*
 * Builds the public update-schedule page from schedule.json, so there is only one place to edit.
 *   node scripts/build-roadmap.js          writes ROADMAP.md and roadmap.html
 *   node scripts/build-roadmap.js --check  fails if those two files are out of date (used when the website is built)
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "schedule.json"), "utf8"));

const REPO = "https://github.com/apojidelegraphics/FocusDesk-96";
const SITE = "https://apojidelegraphics.github.io/FocusDesk-96/";
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
if (!Array.isArray(data.upcoming) || !data.upcoming.length) fail("schedule.json needs at least one upcoming update");
data.upcoming.forEach((u) => {
  if (!STATUS[u.status]) fail("unknown status: " + u.status);
  day(u.target);
});
const next = data.upcoming.find((u) => u.status !== "shipped" && u.status !== "unplanned") || data.upcoming[0];

/* ---------- Markdown (shown on GitHub) ---------- */
const md = [];
md.push("# FocusDesk 96 update schedule", "");
md.push("*" + data.policy.headline + "*", "");
md.push("**Next update:** " + (next.when || day(next.target)) + " - version " + next.version + ", " + next.title + ".", "");
md.push("**Right now:** desktop app " + data.current.desktop + ", browser version " + data.current.browser + ". [Latest release](" + REPO + "/releases/latest)", "");
md.push("The same schedule is on the website: " + SITE + "roadmap.html", "");
md.push("## How updates work", "");
data.policy.points.forEach((p) => md.push("- " + p));
md.push("", "## Coming up", "");
data.upcoming.forEach((u) => {
  md.push("### " + (u.version === "next" ? "Next" : "Version " + u.version) + ": " + u.title, "");
  md.push("- **When:** " + (u.when || day(u.target)) + " (" + STATUS[u.status].toLowerCase() + ")");
  if (u.desktop || u.browser) md.push("- **Versions:** desktop " + (u.desktop || "-") + ", browser " + (u.browser || "-"));
  u.items.forEach((i) => md.push("- " + i));
  if (u.note) md.push("- *" + u.note + "*");
  md.push("");
});
md.push("Dates are targets. If something isn't ready or hasn't been tested, it moves, and this page says so.", "");
md.push("## Recently released", "", "| Version | When | What |", "| --- | --- | --- |");
data.released.forEach((r) => md.push("| " + r.version + " | " + r.date + " | " + r.summary.replace(/\|/g, "/") + " |"));
md.push("", "## Stay in the loop", "");
data.policy.notified.forEach((n) => md.push("- " + n));
md.push("- [All releases](" + REPO + "/releases), [releases feed](" + REPO + "/releases.atom)");
md.push("- Found a problem or want a feature? [Open an issue](" + REPO + "/issues/new/choose)", "");
md.push("_Last updated " + data.updated + ". This page is generated from schedule.json._", "");
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
const cards = data.upcoming
  .map(
    (u) =>
      '<section class="card"><div class="row"><h3>' +
      esc((u.version === "next" ? "Next" : "Version " + u.version) + ": " + u.title) +
      '</h3><span class="badge ' +
      esc(u.status) +
      '">' +
      esc(STATUS[u.status]) +
      "</span></div>" +
      '<p class="when">' +
      esc(u.when || day(u.target)) +
      (u.desktop || u.browser ? " &middot; desktop " + esc(u.desktop || "-") + ", browser " + esc(u.browser || "-") : "") +
      "</p>" +
      li(u.items) +
      (u.note ? '<p class="note">' + esc(u.note) + "</p>" : "") +
      "</section>"
  )
  .join("");
const rows = data.released.map((r) => "<tr><td><b>" + esc(r.version) + "</b></td><td>" + esc(r.date) + "</td><td>" + esc(r.summary) + "</td></tr>").join("");
const html =
  '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1" />\n<title>FocusDesk 96 - Update Schedule</title>\n<style>\n' +
  "html{background:#008080}body{margin:0;padding:16px;font:14px/1.45 Tahoma,'MS Sans Serif',Verdana,Arial,sans-serif;color:#000}\n" +
  ".win{max-width:780px;margin:0 auto;background:#c0c0c0;border:2px solid;border-color:#fff #404040 #404040 #fff;outline:1px solid #000;box-shadow:4px 4px 0 rgba(0,0,0,.35)}\n" +
  ".title{background:linear-gradient(90deg,#000080,#1084d0);color:#fff;font-weight:bold;padding:4px 8px}\n" +
  ".body{padding:12px}h1{font-size:20px;margin:0 0 4px}h2{font-size:15px;margin:18px 0 6px;border-bottom:1px solid #808080}h3{font-size:14px;margin:0}\n" +
  ".panel{background:#fff;border:2px inset #808080;padding:10px;margin:8px 0}.big{font-size:16px;font-weight:bold}\n" +
  ".card{background:#fff;border:2px inset #808080;padding:8px 10px;margin:8px 0}.row{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap}\n" +
  ".badge{font-size:11px;padding:1px 6px;border:1px solid #000;background:#ffffa0}.badge.testing,.badge.in-progress{background:#a0e0ff}.badge.shipped{background:#a0f0a0}.badge.delayed{background:#ffb0b0}.badge.unplanned{background:#e0e0e0}\n" +
  ".when{margin:4px 0;color:#000080;font-weight:bold}.note{margin:4px 0 0;font-style:italic}ul{margin:4px 0 4px 18px;padding:0}\n" +
  "table{border-collapse:collapse;width:100%;background:#fff}td,th{border:1px solid #808080;padding:4px 6px;text-align:left;vertical-align:top}th{background:#d4d0c8}\n" +
  ".tw{overflow-x:auto}a{color:#0000cc}.foot{color:#404040;font-size:12px;margin-top:14px}\n" +
  "</style>\n</head>\n<body>\n<div class=\"win\"><div class=\"title\">FocusDesk 96 - Update Schedule</div><div class=\"body\">\n" +
  "<h1>When does FocusDesk update?</h1><p>" +
  esc(data.policy.headline) +
  "</p>\n" +
  '<div class="panel"><div class="big">Next update: ' +
  esc(next.when || day(next.target)) +
  "</div><div>Version " +
  esc(next.version) +
  " &mdash; " +
  esc(next.title) +
  '</div><div class="foot" style="margin:6px 0 0">Right now: desktop app ' +
  esc(data.current.desktop) +
  ", browser version " +
  esc(data.current.browser) +
  '. <a href="' +
  REPO +
  '/releases/latest">Latest release</a> &middot; <a href="./">Open FocusDesk in your browser</a></div></div>\n' +
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
} else {
  Object.keys(out).forEach((f) => fs.writeFileSync(path.join(root, f), out[f]));
  console.log("wrote ROADMAP.md and roadmap.html (next update: " + (next.when || day(next.target)) + ")");
}
