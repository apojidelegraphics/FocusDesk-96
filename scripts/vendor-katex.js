#!/usr/bin/env node
"use strict";
/*
 * Copies the pieces of KaTeX the desktop app needs from node_modules into vendor/katex/:
 * the renderer, the chemistry extension, the math fonts (woff2 only) and the license.
 * Runs automatically after `npm install` and before every build, so nothing needs downloading by hand.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(root, "node_modules", "katex");
const out = path.join(root, "vendor", "katex");

if (!fs.existsSync(path.join(src, "dist", "katex.min.js"))) {
  console.warn("[katex] not installed yet (run `npm install`); skipping.");
  process.exit(0);
}
fs.mkdirSync(path.join(out, "fonts"), { recursive: true });
const copy = (from, to) => fs.copyFileSync(path.join(src, from), path.join(out, to));
copy("dist/katex.min.js", "katex.min.js");
copy("dist/contrib/mhchem.min.js", "mhchem.min.js");
copy("LICENSE", "LICENSE");
for (const f of fs.readdirSync(path.join(src, "dist", "fonts"))) {
  if (f.endsWith(".woff2")) copy(path.join("dist", "fonts", f), path.join("fonts", f));
}
// Keep only the woff2 source for each font (Chromium supports it), which makes the app smaller.
const css = fs.readFileSync(path.join(src, "dist", "katex.min.css"), "utf8").replace(/,url\(fonts\/[^)]*\.woff\) format\("woff"\),url\(fonts\/[^)]*\.ttf\) format\("truetype"\)/g, "");
fs.writeFileSync(path.join(out, "katex.min.css"), css);
const v = JSON.parse(fs.readFileSync(path.join(src, "package.json"), "utf8")).version;
console.log("[katex] vendored KaTeX " + v + " into vendor/katex");
