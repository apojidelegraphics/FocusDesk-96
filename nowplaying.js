"use strict";
/*
 * Reads what's playing on THIS computer and sends play/pause/next/previous to it. No accounts, no network.
 *   macOS   Spotify and Apple Music, through AppleScript (macOS asks permission the first time)
 *   Linux   any MPRIS player (Spotify, VLC, browsers...), through the `playerctl` tool
 *   Windows any app that reports to the system media controls, through PowerShell
 * Every call is a fixed command; nothing here uses text from the user or from a track name as part of a command.
 */
const cp = require("child_process");
const os = require("os");
const path = require("path");

function run(cmd, args, ms) {
  return new Promise((resolve) => {
    cp.execFile(cmd, args, { timeout: ms || 5000, windowsHide: true, maxBuffer: 8 << 20 }, (err, out) => {
      if (err) resolve({ ok: false, code: err.code, out: "" });
      else resolve({ ok: true, out: String(out) });
    });
  });
}

const clean = (s) => String(s == null ? "" : s).replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, 120);

/** "Title<TAB>Artist<TAB>State[<TAB>ArtworkURL]" -> { title, artist, playing, artUrl? } (state words differ per player) */
function parseFields(line, source) {
  const parts = String(line || "").replace(/\r?\n$/, "").split("\t");
  if (parts.length < 3 || !parts[0].trim()) return null;
  const out = { title: clean(parts[0]), artist: clean(parts[1]), playing: parts[2].trim().toLowerCase() === "playing", source: source };
  const art = (parts[3] || "").trim();
  if (art && /^(https:|file:)/i.test(art) && art.length < 2000) out.artUrl = art;
  return out;
}

/* ---------- macOS ---------- */
const MAC_APPS = ["Spotify", "Music"];
async function macStatus() {
  let found = null;
  for (const app of MAC_APPS) {
    const r = await run("osascript", ["-e", 'application "' + app + '" is running']);
    if (!r.ok || r.out.trim() !== "true") continue;
    const t = await run("osascript", [
      "-e",
      'tell application "' + app + '" to return (name of current track) & (ASCII character 9) & (artist of current track) & (ASCII character 9) & (player state as string)' +
        (app === "Spotify" ? ' & (ASCII character 9) & (artwork url of current track)' : ""),
    ]);
    const s = t.ok ? parseFields(t.out, app) : null;
    if (s && (!found || s.playing)) found = s;
    if (found && found.playing) break;
  }
  return found ? Object.assign({ available: true }, found) : { available: true, idle: true };
}
async function macControl(cmd, source) {
  const app = MAC_APPS.indexOf(source) >= 0 ? source : "Spotify";
  const verb = { toggle: "playpause", next: "next track", prev: "previous track" }[cmd];
  if (!verb) return;
  await run("osascript", ["-e", 'tell application "' + app + '" to ' + verb]);
}

/* ---------- Linux (playerctl) ---------- */
async function linuxStatus() {
  const r = await run("playerctl", ["metadata", "--format", "{{title}}\t{{artist}}\t{{status}}\t{{mpris:artUrl}}"]);
  if (!r.ok && r.code === "ENOENT") return { available: false, hint: "Install the playerctl package to see what's playing on Linux." };
  const s = r.ok ? parseFields(r.out, "playerctl") : null;
  return s ? Object.assign({ available: true }, s) : { available: true, idle: true };
}
async function linuxControl(cmd) {
  const verb = { toggle: "play-pause", next: "next", prev: "previous" }[cmd];
  if (verb) await run("playerctl", [verb]);
}

/* ---------- Windows (system media controls via PowerShell) ---------- */
const WIN_PRELUDE = [
  "Add-Type -AssemblyName System.Runtime.WindowsRuntime",
  "$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]",
  "function Await($op, $type) { $m = $asTask.MakeGenericMethod($type); $t = $m.Invoke($null, @($op)); $t.Wait(-1) | Out-Null; $t.Result }",
  "[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager,Windows.Media.Control,ContentType=WindowsRuntime] | Out-Null",
  "$mgr = Await ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]::RequestAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager])",
  "$s = $mgr.GetCurrentSession()",
  "if ($s -eq $null) { Write-Output 'NONE'; exit }",
].join("\n");
const WIN_STATUS =
  WIN_PRELUDE +
  "\n" +
  "$p = Await ($s.TryGetMediaPropertiesAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties])\n" +
  "$st = $s.GetPlaybackInfo().PlaybackStatus\n" +
  'Write-Output ("{0}`t{1}`t{2}" -f $p.Title, $p.Artist, $st)';
const winControl = (method) => WIN_PRELUDE + "\n" + "Await ($s." + method + "()) ([bool]) | Out-Null";
const encode = (script) => Buffer.from(script, "utf16le").toString("base64");
async function winRun(script) {
  return run("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand", encode(script)], 9000);
}
async function winStatus() {
  const r = await winRun(WIN_STATUS);
  if (!r.ok) return { available: false, hint: "Couldn't read the Windows media controls." };
  if (/^NONE/.test(r.out.trim())) return { available: true, idle: true };
  const s = parseFields(r.out.trim(), "windows");
  return s ? Object.assign({ available: true }, s) : { available: true, idle: true };
}
async function winControlCmd(cmd) {
  const m = { toggle: "TryTogglePlayPauseAsync", next: "TrySkipNextAsync", prev: "TrySkipPreviousAsync" }[cmd];
  if (m) await winRun(winControl(m));
}

/* ---------- album art on demand (only when the song changes) ---------- */
const MUSIC_ART = [
  "on run argv",
  "set outPath to item 1 of argv",
  'tell application "Music"',
  "if (count of artworks of current track) is 0 then return \"NONE\"",
  "set d to raw data of artwork 1 of current track",
  "end tell",
  "set f to open for access (POSIX file outPath) with write permission",
  "try",
  "set eof f to 0",
  "write d to f",
  "end try",
  "close access f",
  'return "OK"',
  "end run",
];
const WIN_ART =
  WIN_PRELUDE +
  "\n" +
  "$p = Await ($s.TryGetMediaPropertiesAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties])\n" +
  "if ($p.Thumbnail -eq $null) { Write-Output 'NONE'; exit }\n" +
  "[Windows.Storage.Streams.IRandomAccessStreamWithContentType,Windows.Storage.Streams,ContentType=WindowsRuntime] | Out-Null\n" +
  "$rs = Await ($p.Thumbnail.OpenReadAsync()) ([Windows.Storage.Streams.IRandomAccessStreamWithContentType])\n" +
  "$in = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($rs)\n" +
  "$ms = New-Object System.IO.MemoryStream\n" +
  "$in.CopyTo($ms)\n" +
  "if ($ms.Length -gt 3000000) { Write-Output 'NONE'; exit }\n" +
  "Write-Output ([Convert]::ToBase64String($ms.ToArray()))";
/** Returns { b64 } or { file } for the cover of what's playing now, or null. */
async function art(source) {
  try {
    if (process.platform === "win32") {
      const r = await winRun(WIN_ART);
      const b64 = r.ok ? r.out.trim() : "";
      return b64 && b64 !== "NONE" && /^[A-Za-z0-9+/=\s]+$/.test(b64) ? { b64: b64.replace(/\s+/g, "") } : null;
    }
    if (process.platform === "darwin" && source === "Music") {
      const file = path.join(os.tmpdir(), "focusdesk-art-" + process.pid + ".bin");
      const args = [];
      MUSIC_ART.forEach((l) => args.push("-e", l));
      args.push(file);
      const r = await run("osascript", args, 8000);
      return r.ok && r.out.trim() === "OK" ? { file: file } : null;
    }
  } catch (e) {}
  return null;
}

/* ---------- public ---------- */
async function status() {
  try {
    if (process.platform === "darwin") return await macStatus();
    if (process.platform === "linux") return await linuxStatus();
    if (process.platform === "win32") return await winStatus();
  } catch (e) {}
  return { available: false, hint: "Now playing isn't supported on this system." };
}
async function control(cmd, source) {
  try {
    if (process.platform === "darwin") await macControl(cmd, source);
    else if (process.platform === "linux") await linuxControl(cmd);
    else if (process.platform === "win32") await winControlCmd(cmd);
  } catch (e) {}
}

module.exports = { status, control, art, parseFields, parseTriple: parseFields, WIN_STATUS, WIN_ART, MUSIC_ART, encode };
