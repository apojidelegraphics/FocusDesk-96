#!/usr/bin/env node
"use strict";
/*
 * Extracts the app icon from apojilogo.js (window.APOJI_LOGO = "data:image/png;base64,...")
 * and writes build/icon.png at 1024x1024 for electron-builder.
 * Runs automatically via the "prebuild*" npm scripts.
 *
 * If the logo is smaller than 1024x1024 it is upscaled with sharp; if the logo can't be
 * read at all, a plain placeholder icon is written and a loud warning is printed.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "build");
const OUT = path.join(OUT_DIR, "icon.png");
const SIZE = 1024;

function warn(msg) {
  const bar = "!".repeat(72);
  console.warn("\n" + bar + "\n!! ICON WARNING: " + msg + "\n" + bar + "\n");
}

function readLogoPng() {
  const src = fs.readFileSync(path.join(ROOT, "apojilogo.js"), "utf8");
  const m = src.match(/APOJI_LOGO\s*=\s*["'](?:data:image\/png;base64,)?([A-Za-z0-9+/=\s]+)["']/);
  if (!m) throw new Error("window.APOJI_LOGO not found in apojilogo.js");
  const buf = Buffer.from(m[1].replace(/\s+/g, ""), "base64");
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) throw new Error("APOJI_LOGO is not a PNG");
  return { buf, width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function loadSharp() {
  try {
    return require("sharp");
  } catch (e) {
    return null;
  }
}

async function placeholder(sharp) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + SIZE + '" height="' + SIZE + '">' +
    '<rect width="100%" height="100%" rx="180" fill="#008080"/>' +
    '<rect x="150" y="150" width="724" height="724" fill="#c0c0c0" stroke="#fff" stroke-width="16"/>' +
    '<rect x="150" y="150" width="724" height="120" fill="#000080"/>' +
    '<text x="512" y="640" font-family="Arial,Helvetica,sans-serif" font-size="300" font-weight="bold" text-anchor="middle" fill="#000">96</text>' +
    "</svg>";
  if (sharp) return sharp(Buffer.from(svg)).png().toBuffer();
  // No sharp either: a solid-teal 1x1 PNG is still better than a missing icon (electron-builder will scale it).
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==",
    "base64"
  );
}

(async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const sharp = loadSharp();
  try {
    const logo = readLogoPng();
    if (logo.width === SIZE && logo.height === SIZE) {
      fs.writeFileSync(OUT, logo.buf);
      console.log("[icon] wrote build/icon.png (logo is already " + SIZE + "x" + SIZE + ")");
      return;
    }
    if (!sharp) throw new Error("logo is " + logo.width + "x" + logo.height + " and sharp isn't installed to resize it");
    const out = await sharp(logo.buf)
      .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    fs.writeFileSync(OUT, out);
    warn("logo was " + logo.width + "x" + logo.height + "; upscaled to " + SIZE + "x" + SIZE + ". Supply a 1024x1024 logo for best quality.");
  } catch (e) {
    fs.writeFileSync(OUT, await placeholder(sharp));
    warn("could not use apojilogo.js (" + e.message + "). A PLACEHOLDER icon was written to build/icon.png.");
  }
})();
