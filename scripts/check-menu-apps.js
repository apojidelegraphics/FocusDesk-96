#!/usr/bin/env node
"use strict";
/* Fails if the pop-out menu in main.js doesn't match the apps in focusdesk.js (same apps, same names). */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "focusdesk.js"), "utf8");
const main = fs.readFileSync(path.join(__dirname, "..", "main.js"), "utf8");
const ok = ((/var POPOUT_OK = \[(.*?)\];/.exec(src) || [])[1] || "").match(/"(\w+)"/g) || [];
const allowed = ok.map((x) => x.replace(/"/g, ""));
const blk = src.slice(src.indexOf("var APPS = {"));
const menu = {};
const m = /const POPOUT_MENU = \[([\s\S]*?)\n\];/.exec(main);
(m ? m[1] : "").replace(/\["(\w+)", "([^"]*)"\]/g, (all, id, t) => {
  menu[id] = t;
  return all;
});
const problems = [];
if (!allowed.length) problems.push("couldn't read POPOUT_OK from focusdesk.js");
if (!m) problems.push("couldn't read POPOUT_MENU from main.js");
allowed.forEach((id) => {
  const t = new RegExp("\\n    " + id + ": \\{\\n      id: \"" + id + "\",\\n      title: \"([^\"]+)\"").exec(blk);
  if (!t) problems.push("no app called " + id + " in focusdesk.js");
  else if (!(id in menu)) problems.push(id + " can pop out but is missing from the menu in main.js");
  else if (JSON.parse('"' + t[1] + '"') !== menu[id]) problems.push(id + ': the menu says "' + menu[id] + '" but the app is called "' + JSON.parse('"' + t[1] + '"') + '"');
});
Object.keys(menu).forEach((id) => {
  if (allowed.indexOf(id) < 0) problems.push(id + " is in the menu but the app can't pop out");
});
if (problems.length) {
  console.error("check-menu-apps: FAILED\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log("menu check: ok (" + allowed.length + " apps can pop out)");
