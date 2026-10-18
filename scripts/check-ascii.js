#!/usr/bin/env node
"use strict";
/*
 * The files that run in a web page (focusdesk.js, focusdesk.css, index.html, the offline helper) must be
 * plain ASCII. Special characters are written as escapes (\u2014 in JavaScript, &#x2014; in HTML), so they
 * show up correctly even if a website, editor or upload tool mixes up the text encoding.
 *   node scripts/check-ascii.js         lists any special characters it finds and fails
 *   node scripts/check-ascii.js --fix   rewrites them as escapes
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const files = ["focusdesk.js", "focusdesk.css", "index.html", "apojilogo.js", "pwa/sw.js", "pwa/manifest.webmanifest"];
const fix = process.argv.includes("--fix");
let bad = 0;

function escapeFor(file, cp) {
  const ext = path.extname(file);
  if (ext === ".html") return "&#x" + cp.toString(16) + ";";
  if (ext === ".css") return "\\" + cp.toString(16) + " ";
  if (cp > 0xffff) {
    const n = cp - 0x10000;
    return "\\u" + (0xd800 + (n >> 10)).toString(16) + "\\u" + (0xdc00 + (n & 0x3ff)).toString(16);
  }
  return "\\u" + ("0000" + cp.toString(16)).slice(-4);
}
for (const f of files) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) continue;
  const text = fs.readFileSync(p, "utf8");
  const found = {};
  let out = "";
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp > 127) {
      found[ch] = (found[ch] || 0) + 1;
      out += escapeFor(f, cp);
    } else out += ch;
  }
  const n = Object.values(found).reduce((a, b) => a + b, 0);
  if (!n) continue;
  if (fix) {
    fs.writeFileSync(p, out);
    console.log("fixed " + f + ": " + n + " special character(s) turned into escapes (" + Object.keys(found).map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase()).join(" ") + ")");
  } else {
    bad += n;
    console.error(f + ": " + n + " special character(s): " + Object.keys(found).map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase()).join(" ") + "  (run: node scripts/check-ascii.js --fix)");
  }
}
if (bad) process.exit(1);
if (!fix) console.log("ascii check: ok");
