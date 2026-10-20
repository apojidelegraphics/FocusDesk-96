#!/usr/bin/env node
"use strict";
/*
 * Builds the small Mac helper programs in helper/macos as programs that run on both Apple Silicon and Intel Macs,
 * signs them ad-hoc, and leaves them next to their source. Only runs on macOS.
 *
 * Each helper is built on its own, so one that fails to build never takes the others down. A helper that fails is
 * replaced by a small stand-in that tells the app WHY, so the app can show the reason instead of just "not available".
 */
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

if (process.platform !== "darwin") {
  console.log("[mac-helper] not on macOS, skipping.");
  process.exit(0);
}
const dir = path.join(__dirname, "..", "helper", "macos");
const HELPERS = [
  { name: "focusdesk-mac", src: "FocusDeskMac.swift", plist: "Info.plist", what: "Apple Calendar reading" },
  { name: "focusdesk-mac-write", src: "FocusDeskWrite.swift", plist: "Info-write.plist", what: "Apple Calendar writing" },
  { name: "focusdesk-mac-ai", src: "FocusDeskAI.swift", plist: "Info-ai.plist", what: "Apple on-device model" },
];

function sh(cmd, args) {
  const r = cp.spawnSync(cmd, args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(cmd + " failed: " + ((r.stderr || r.stdout || "") + "").trim().split("\n").filter((l) => /error/i.test(l)).slice(0, 3).join(" | ").slice(0, 400) || ((r.stderr || r.stdout || "") + "").trim().split("\n").slice(-3).join(" | "));
}

let failed = 0;
for (const h of HELPERS) {
  const src = path.join(dir, h.src),
    plist = path.join(dir, h.plist),
    out = path.join(dir, h.name);
  try {
    if (!fs.existsSync(src)) throw new Error("the source file " + h.src + " is missing");
    const parts = [];
    for (const arch of ["arm64", "x86_64"]) {
      const o = out + "-" + arch;
      // the Info.plist is embedded so macOS can show the permission text
      sh("swiftc", ["-O", "-target", arch + "-apple-macos11.0", "-o", o, src, "-Xlinker", "-sectcreate", "-Xlinker", "__TEXT", "-Xlinker", "__info_plist", "-Xlinker", plist]);
      parts.push(o);
    }
    sh("lipo", ["-create", "-output", out, ...parts]);
    sh("codesign", ["--force", "--sign", "-", out]);
    parts.forEach((p) => fs.unlinkSync(p));
    console.log("[mac-helper] built " + h.name);
  } catch (e) {
    failed++;
    const why = String((e && e.message) || e).replace(/\s+/g, " ").slice(0, 300);
    console.warn("[mac-helper] could not build " + h.name + ", using a stand-in: " + why);
    console.warn("::warning title=Mac helper " + h.name + " did not build::" + why);
    const answer = JSON.stringify({ ok: false, error: "The " + h.what + " helper didn't build in this version: " + why });
    fs.writeFileSync(out, "#!/bin/sh\necho '" + answer.replace(/'/g, "'\\''") + "'\n");
    fs.chmodSync(out, 0o755);
  }
}
if (failed) console.warn("[mac-helper] " + failed + " of " + HELPERS.length + " helper(s) used a stand-in. The app still works; the matching feature will say why it isn't available.");
