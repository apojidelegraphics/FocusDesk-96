#!/usr/bin/env node
"use strict";
/*
 * Builds the Mac helper (helper/macos/FocusDeskMac.swift) as one program that runs on both
 * Apple Silicon and Intel Macs, signs it ad-hoc, and leaves it at helper/macos/focusdesk-mac.
 * Only runs on macOS. If anything fails (for example the Swift tools aren't installed),
 * it writes a small stand-in instead, so the installer still builds and the app simply
 * says Apple Calendar isn't available in that build.
 */
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

if (process.platform !== "darwin") {
  console.log("[mac-helper] not on macOS, skipping.");
  process.exit(0);
}
const dir = path.join(__dirname, "..", "helper", "macos");
const src = path.join(dir, "FocusDeskMac.swift");
const plist = path.join(dir, "Info.plist");
const out = path.join(dir, "focusdesk-mac");

function sh(cmd, args) {
  const r = cp.spawnSync(cmd, args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(cmd + " failed: " + ((r.stderr || r.stdout || "") + "").trim().split("\n").slice(-6).join(" | "));
}

try {
  const parts = [];
  for (const arch of ["arm64", "x86_64"]) {
    const o = path.join(dir, "focusdesk-mac-" + arch);
    // the Info.plist is embedded so macOS can show the permission text
    sh("swiftc", ["-O", "-target", arch + "-apple-macos11.0", "-o", o, src, "-Xlinker", "-sectcreate", "-Xlinker", "__TEXT", "-Xlinker", "__info_plist", "-Xlinker", plist]);
    parts.push(o);
  }
  sh("lipo", ["-create", "-output", out, ...parts]);
  sh("codesign", ["--force", "--sign", "-", out]);
  parts.forEach((p) => fs.unlinkSync(p));
  console.log("[mac-helper] built " + out);
} catch (e) {
  console.warn("[mac-helper] could not build the helper, using a stand-in: " + e.message);
  fs.writeFileSync(out, "#!/bin/sh\necho '{\"ok\":false,\"error\":\"The Apple Calendar helper isn'\\''t part of this build.\"}'\n");
  fs.chmodSync(out, 0o755);
}
