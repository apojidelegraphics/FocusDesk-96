"use strict";
/*
 * FocusDesk 96 — Desktop Edition: Electron main process.
 *
 * Renderer (focusdesk.js + focusdesk-desk.js) -> IPC -> this file -> fs.promises -> disk.
 * The renderer never touches `fs`; everything it can do is listed in preload.js.
 *
 * Design notes
 *  - `mem` is the source of truth while the app runs. Every write request updates
 *    `mem` synchronously the moment it arrives, then a serialized flusher writes
 *    whatever is dirty to disk. That makes reloads and fast quits race-free: the
 *    next page load (sendSync) always sees the newest state, and the disk writer
 *    always writes the newest state, never a stale snapshot.
 *  - Every file write is atomic: write a temp file, fsync it, rename over the target.
 */

const { app, BrowserWindow, Menu, dialog, ipcMain, shell, screen, globalShortcut, Tray, nativeImage, Notification, net, clipboard } = require("electron");
const nowPlaying = require("./nowplaying");
const makeSafeWrite = require("./safewrite");
const { makeBackups } = require("./backup");
const { makeCrashLog } = require("./crashlog");
const path = require("path");
const fs = require("fs");
const fsp = fs.promises;
const os = require("os");
const { fileURLToPath } = require("url");
// Mac helper for Apple Calendar and Reminders (read-only). Packaged builds carry it in Resources.
const apple = require("./apple")({
  helper: app.isPackaged ? path.join(process.resourcesPath, "focusdesk-mac") : path.join(__dirname, "helper", "macos", "focusdesk-mac"),
  writeHelper: app.isPackaged ? path.join(process.resourcesPath, "focusdesk-mac-write") : path.join(__dirname, "helper", "macos", "focusdesk-mac-write"),
  aiHelper: app.isPackaged ? path.join(process.resourcesPath, "focusdesk-mac-ai") : path.join(__dirname, "helper", "macos", "focusdesk-mac-ai"),
});

// Windows only shows toast notifications for apps with a stable identity; this matches the installer's appId.
if (process.platform === "win32") app.setAppUserModelId("com.apojistudios.focusdesk96");

const APP_TITLE = "FocusDesk 96";
const PUBLISHER = "Apoji Studios";
const REPO_URL = "https://github.com/apojidelegraphics/FocusDesk-96";

/* ---------------------------------------------------------------------------
 * Paths
 * Chromium keeps its own folders (Cache, Local Storage, ...) in <appData>/focusdesk-96.
 * Your files live next to it in <appData>/FocusDesk 96, so the two never mix.
 *   macOS   ~/Library/Application Support/FocusDesk 96/
 *   Windows %APPDATA%\FocusDesk 96\
 *   Linux   ~/.config/FocusDesk 96/
 * ------------------------------------------------------------------------- */
app.setPath("userData", path.join(app.getPath("appData"), "focusdesk-96"));
const DATA_DIR = path.join(app.getPath("appData"), APP_TITLE);
const BACKUP_DIR_DEFAULT = path.join(DATA_DIR, "backups");
/** The folder daily backups go to: the user's choice, or <data folder>/backups. */
function backupDir() {
  return (typeof dprefs === "object" && dprefs.backupPath) || BACKUP_DIR_DEFAULT;
}
const MIGRATE_DIR = path.join(DATA_DIR, "migrate");
/* ---- the crash log: error text only, names and secrets removed, never sent anywhere by itself (see crashlog.js) ---- */
let osUser = "";
try {
  osUser = os.userInfo().username || "";
} catch (_) {}
const crash = makeCrashLog({ file: path.join(DATA_DIR, "crash.log"), version: app.getVersion(), platform: process.platform + " " + process.arch + " " + os.release(), home: os.homedir(), user: osUser });
let lastCrashBox = 0;
process.on("uncaughtException", (err) => {
  crash.record("main-error", err && err.message, err && err.stack);
  // with a handler in place Electron no longer shows its own error box, so say it (at most once a minute)
  if (Date.now() - lastCrashBox > 60000) {
    lastCrashBox = Date.now();
    try {
      dialog.showErrorBox("FocusDesk 96 ran into a problem", String((err && err.message) || err).slice(0, 300) + "\n\nYour data is safe. Details were saved to the crash log (Control Panel > Desktop), where you can look at them or send them if you want to.");
    } catch (_) {}
  }
});
process.on("unhandledRejection", (reason) => {
  crash.record("main-rejection", reason && reason.message ? reason.message : String(reason), reason && reason.stack);
});
app.on("render-process-gone", (_e, _wc, d) => {
  if (d && d.reason !== "clean-exit" && d.reason !== "killed") crash.record("renderer-gone", String(d.reason) + " (exit code " + d.exitCode + ")");
});
app.on("child-process-gone", (_e, d) => {
  if (d && d.reason !== "clean-exit" && d.reason !== "killed") crash.record("child-gone", String(d.type) + " " + String(d.reason) + " (exit code " + d.exitCode + ")");
});
const RUNNING_FLAG = path.join(DATA_DIR, "running.flag"); // present while the app is open: if it is still there at the next start, the app didn't close normally
const FILES = {
  data: path.join(DATA_DIR, "data.json"),
  wall: path.join(DATA_DIR, "wall.json"),
  settings: path.join(DATA_DIR, "settings.json"),
  keys: path.join(DATA_DIR, "keys.json"),
  window: path.join(DATA_DIR, "window-state.json"),
  desktop: path.join(DATA_DIR, "desktop.json"),
};
const INDEX_FILE = path.join(__dirname, "index.html");
const MAX_OPEN_BYTES = 50 * 1024 * 1024;

/* ---------------------------------------------------------------------------
 * Small helpers
 * ------------------------------------------------------------------------- */
const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const stamp = () => new Date().toISOString().replace(/[:.]/g, "-");

function cleanStringMap(v) {
  const out = {};
  if (!isPlainObject(v)) return out;
  for (const k of Object.keys(v)) if (typeof v[k] === "string") out[k] = v[k];
  return out;
}

function safeName(name) {
  let n = path.basename(String(name || "file")).replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_").trim();
  if (!n || n === "." || n === "..") n = "file";
  return n.slice(0, 120);
}

/* A small log in the data folder (focusdesk.log) so problems like a failed save can be explained afterwards. */
function logLine(msg) {
  try {
    const f = path.join(DATA_DIR, "focusdesk.log");
    let old = "";
    try {
      old = fs.readFileSync(f, "utf8");
    } catch (_) {}
    if (old.length > 150000) old = old.slice(old.length - 80000);
    fs.writeFileSync(f, old + new Date().toISOString() + "  " + String(msg).replace(/\s+/g, " ").slice(0, 400) + "\n");
  } catch (_) {}
}
let lastMirror = 0;
/* A current copy of the data in the backup folder (the dated backups are snapshots from the start of each day). */
async function mirrorLatest(force) {
  if (!dprefs.mirrorLatest || !mem.data) return;
  if (!force && Date.now() - lastMirror < 60000) return;
  lastMirror = Date.now();
  try {
    const dir = backupDir();
    await fsp.mkdir(dir, { recursive: true });
    await atomicWrite(path.join(dir, "focusdesk-latest.json"), JSON.stringify({ app: "FocusDesk 96", version: app.getVersion(), saved: new Date().toISOString(), data: mem.data }));
  } catch (e) {
    logLine("couldn't update focusdesk-latest.json: " + ((e && e.code) || "") + " " + String((e && e.message) || e).slice(0, 120));
  }
}
let lastSaveError = null; // what the last failed save was, so the app can say so instead of a vague warning
const { atomicWrite } = makeSafeWrite({ log: (m) => logLine(m) });

/** Synchronous twin, used only for the tiny window-state file inside the close handler. */
function atomicWriteSync(file, contents) {
  const tmp = file + "." + process.pid + ".tmp";
  try {
    const fd = fs.openSync(tmp, "w");
    try {
      fs.writeSync(fd, contents);
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
    fs.renameSync(tmp, file);
  } catch (e) {
    try {
      fs.unlinkSync(tmp);
    } catch (_) {}
    throw e;
  }
}

/* ---------------------------------------------------------------------------
 * In-memory model + disk flusher
 * ------------------------------------------------------------------------- */
const mem = { data: null, wall: null, settings: {}, keys: {} };
const dirty = { data: false, wall: false, settings: false, keys: false };
let bootCorrupt = [];

function serialize(kind) {
  if (kind === "data") return JSON.stringify(mem.data, null, 2);
  if (kind === "wall") return JSON.stringify({ dataUrl: mem.wall });
  if (kind === "settings") return JSON.stringify(mem.settings, null, 2);
  return JSON.stringify(mem.keys, null, 2);
}

async function writeKind(kind) {
  if (kind === "wall" && mem.wall == null) {
    await fsp.unlink(FILES.wall).catch((e) => {
      if (e.code !== "ENOENT") throw e;
    });
    return;
  }
  await atomicWrite(FILES[kind], serialize(kind));
}

let flushChain = Promise.resolve();
let writing = 0; // writes currently in flight
/** Writes everything that is dirty. Calls are serialized; resolves once disk is current. */
function flushDirty() {
  const run = async () => {
    writing++;
    try {
      await runOnce();
    } finally {
      writing--;
    }
  };
  const runOnce = async () => {
    let firstError = null;
    for (const kind of Object.keys(dirty)) {
      if (!dirty[kind]) continue;
      dirty[kind] = false; // clear BEFORE serializing, so a write arriving mid-flush re-marks it
      try {
        if (kind === "data") await ensureDailyBackup(); // snapshot the old file before replacing it
        await writeKind(kind);
        if (lastSaveError && lastSaveError.kind === kind) lastSaveError = null;
        if (kind === "data") mirrorLatest(false);
      } catch (e) {
        dirty[kind] = true; // retry on the next flush
        console.error("[focusdesk] write failed:", kind, e);
        lastSaveError = { kind: kind + ".json", code: (e && e.code) || "", message: String((e && e.message) || e).slice(0, 200), folder: DATA_DIR };
        logLine("write failed: " + kind + " " + lastSaveError.code + " " + lastSaveError.message);
        if (!firstError) firstError = e;
      }
    }
    if (firstError) throw firstError;
  };
  const p = flushChain.then(run, run);
  flushChain = p.catch(() => {});
  return p;
}

/* ---------------------------------------------------------------------------
 * Loading, corruption recovery, daily backups
 * ------------------------------------------------------------------------- */
async function loadJson(file, valid) {
  let raw;
  try {
    raw = await fsp.readFile(file, "utf8");
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
  try {
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
    const v = JSON.parse(raw);
    if (!valid(v)) throw new Error("unexpected shape");
    return v;
  } catch (err) {
    const moved = file + ".corrupt-" + stamp();
    try {
      await fsp.rename(file, moved);
    } catch (_) {}
    bootCorrupt.push({ file: path.basename(file), movedTo: path.basename(moved) });
    return null;
  }
}

let backupCheckedFor = null;
let backupNote = ""; // shown in Control Panel if the chosen folder couldn't be used
const backups = makeBackups({
  fsp: fsp,
  atomicWrite: (f, d) => atomicWrite(f, d),
  readData: async () => {
    try {
      return await fsp.readFile(FILES.data);
    } catch (e) {
      if (e.code === "ENOENT") return null;
      throw e;
    }
  },
  dir: () => backupDir(),
  fallbackDir: BACKUP_DIR_DEFAULT,
  keep: () => dprefs.backupKeep, // 0 = keep everything
  today: () => ymd(new Date()),
  now: () => Date.now(),
  log: (msg) => logLine(msg),
});
/** Makes sure today has a backup (once per day it also saves the old file before the first change of the day replaces it). */
async function ensureDailyBackup() {
  const today = ymd(new Date());
  if (backupCheckedFor === today) return;
  backupCheckedFor = today; // one attempt per calendar day here; backupTick() keeps today's file current after that
  const s = await backups.run();
  backupNote = s.error || s.note || "";
}
/** Back up right now (the Back up now button, and when the app closes). */
async function backupNow() {
  const s = await backups.run({ force: true });
  backupNote = s.error || s.note || "";
  return s;
}
/** Every few minutes: start a new day's file, or refresh today's if the data changed (backup.js decides if it is time). */
function backupTick() {
  backups.run().then((s) => {
    backupNote = s.error || s.note || "";
  }).catch(() => {});
}

/** Remove half-written temp files left behind by a crash or power cut (single-instance, so none are live). */
async function cleanStaleTemps() {
  for (const dir of [DATA_DIR, backupDir(), MIGRATE_DIR]) {
    let names = [];
    try {
      names = await fsp.readdir(dir);
    } catch (_) {}
    for (const n of names) if (/\.\d+(\.\d+)?\.tmp$/.test(n)) await fsp.unlink(path.join(dir, n)).catch(() => {});
  }
}

async function loadAll() {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  await fsp.mkdir(BACKUP_DIR_DEFAULT, { recursive: true });
  await fsp.mkdir(MIGRATE_DIR, { recursive: true });
  await cleanStaleTemps();
  bootCorrupt = [];
  mem.data = await loadJson(FILES.data, isPlainObject);
  const wall = await loadJson(FILES.wall, isPlainObject);
  mem.wall = wall && typeof wall.dataUrl === "string" && wall.dataUrl ? wall.dataUrl : null;
  mem.settings = cleanStringMap(await loadJson(FILES.settings, isPlainObject));
  mem.keys = cleanStringMap(await loadJson(FILES.keys, isPlainObject));
  dprefs = mergeDprefs(DEFAULT_DPREFS, await loadJson(FILES.desktop, isPlainObject));
  await ensureDailyBackup();
}

function bootPayload() {
  const corrupt = bootCorrupt;
  bootCorrupt = []; // report once, not on every reload
  return {
    data: mem.data,
    wall: mem.wall,
    settings: mem.settings,
    keys: mem.keys,
    corrupt,
    dirs: { data: DATA_DIR, backups: backupDir(), backupsDefault: BACKUP_DIR_DEFAULT, migrate: MIGRATE_DIR },
    backupNote: backupNote,
    crash: crash.info(),
    platform: process.platform,
    appVersion: app.getVersion(),
    dprefs: dprefs,
    hotkeyOk: hotkeyOk,
    cardHotkeyOk: cardHotkeyOk,
    hotkeys: hotkeyState,
    updater: { supported: !!updater, mode: dprefs.updateMode },
    trayOk: !!tray,
    titleBar: compactActive,
  };
}

/* ---------------------------------------------------------------------------
 * IPC
 * ------------------------------------------------------------------------- */
function samePath(a, b) {
  return process.platform === "win32" || process.platform === "darwin" ? a.toLowerCase() === b.toLowerCase() : a === b;
}
function isAppUrl(url) {
  try {
    return samePath(fileURLToPath(String(url).split("#")[0].split("?")[0]), INDEX_FILE);
  } catch (_) {
    return false;
  }
}
function assertTrusted(e) {
  const url = e.senderFrame && e.senderFrame.url;
  if (!isAppUrl(url)) throw new Error("Untrusted IPC sender");
}

function applyWrite(p) {
  p = p || {};
  if (p.data !== undefined) {
    if (!isPlainObject(p.data)) throw new Error("data must be an object");
    mem.data = p.data;
    dirty.data = true;
  }
  if (p.wall !== undefined) {
    const w = p.wall === null || p.wall === "" ? null : String(p.wall);
    if (w !== mem.wall) {
      mem.wall = w;
      dirty.wall = true;
    }
  }
  if (p.settings !== undefined) {
    mem.settings = cleanStringMap(p.settings);
    dirty.settings = true;
  }
  if (p.keys !== undefined) {
    mem.keys = cleanStringMap(p.keys);
    dirty.keys = true;
  }
  return flushDirty().then(
    () => ({ ok: true }),
    (e) => ({ ok: false, error: String((e && e.message) || e), detail: lastSaveError })
  );
}

const TEXT_EXT = new Set([".json", ".ics", ".txt", ".md", ".csv", ".html", ".htm"]);
const MIME = {
  ".json": "application/json",
  ".ics": "text/calendar",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".csv": "text/csv",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".bmp": "image/bmp",
};
const ACCEPT_TO_EXT = {
  "application/json": ["json"],
  "text/calendar": ["ics"],
  "text/plain": ["txt"],
  "text/markdown": ["md"],
  "text/csv": ["csv"],
  "image/*": ["png", "jpg", "jpeg", "gif", "webp", "bmp"],
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/gif": ["gif"],
  "image/webp": ["webp"],
};

function filtersFromAccept(accept) {
  const exts = [];
  String(accept || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .forEach((tok) => {
      if (tok[0] === ".") exts.push(tok.slice(1));
      else if (ACCEPT_TO_EXT[tok]) exts.push.apply(exts, ACCEPT_TO_EXT[tok]);
    });
  const uniq = Array.from(new Set(exts));
  return uniq.length ? [{ name: "Supported files", extensions: uniq }, { name: "All Files", extensions: ["*"] }] : [];
}

function toBuffer(contents) {
  if (typeof contents === "string") return Buffer.from(contents, "utf8");
  if (contents instanceof ArrayBuffer) return Buffer.from(contents);
  if (ArrayBuffer.isView(contents)) return Buffer.from(contents.buffer, contents.byteOffset, contents.byteLength);
  throw new Error("Unsupported file contents");
}

async function uniquePath(dir, name) {
  const ext = path.extname(name);
  const base = name.slice(0, name.length - ext.length);
  for (let i = 1; ; i++) {
    const candidate = path.join(dir, i === 1 ? name : base + "-" + i + ext);
    try {
      await fsp.access(candidate);
    } catch (_) {
      return candidate; // does not exist yet
    }
  }
}

function dirFor(kind) {
  if (kind === "migrate") return MIGRATE_DIR;
  if (kind === "pictures") return app.getPath("pictures");
  if (kind === "documents") return app.getPath("documents");
  return app.getPath("downloads");
}

function registerIpc() {
  ipcMain.on("focusdesk:readSync", (e) => {
    try {
      assertTrusted(e);
      e.returnValue = bootPayload();
    } catch (err) {
      e.returnValue = null;
    }
  });

  ipcMain.handle("focusdesk:readData", (e) => {
    assertTrusted(e);
    return { data: mem.data, wall: mem.wall };
  });

  ipcMain.handle("focusdesk:writeData", (e, p) => {
    assertTrusted(e);
    if (p && p.data !== undefined && isPlainObject(p.data)) broadcastExternal(e.sender, p.data);
    return applyWrite({ data: p && p.data, wall: p && p.wall });
  });
  ipcMain.handle("focusdesk:popOut", (e, p) => {
    assertTrusted(e);
    return openPopout(String((p && p.app) || ""), BrowserWindow.fromWebContents(e.sender));
  });

  ipcMain.handle("focusdesk:writeSettings", (e, p) => {
    assertTrusted(e);
    return applyWrite({ settings: p && p.settings, keys: p && p.keys });
  });

  ipcMain.handle("focusdesk:saveFile", async (e, p) => {
    assertTrusted(e);
    const name = safeName(p && p.name);
    const buf = toBuffer(p && p.contents);
    let archived = null;
    // Migrate: the copy in migrate/ is the canonical archive and is always written,
    // even if the user then cancels "Save As". Never overwrite an earlier archive.
    if (p && p.archive === "migrate") {
      archived = await uniquePath(MIGRATE_DIR, name);
      await atomicWrite(archived, buf);
    }
    const ext = path.extname(name).slice(1);
    const win = BrowserWindow.fromWebContents(e.sender);
    const res = await dialog.showSaveDialog(win, {
      title: "Save " + name,
      defaultPath: path.join(dirFor(p && p.defaultDir), name),
      filters: ext
        ? [{ name: ext.toUpperCase() + " file", extensions: [ext] }, { name: "All Files", extensions: ["*"] }]
        : [],
    });
    if (res.canceled || !res.filePath) return { canceled: true, archived };
    await atomicWrite(res.filePath, buf);
    return { canceled: false, path: res.filePath, archived };
  });

  ipcMain.handle("focusdesk:openFile", async (e, p) => {
    assertTrusted(e);
    p = p || {};
    const win = BrowserWindow.fromWebContents(e.sender);
    const props = ["openFile"];
    if (p.multiple) props.push("multiSelections");
    const res = await dialog.showOpenDialog(win, {
      title: "Open file",
      defaultPath: dirFor(p.defaultDir),
      properties: props,
      filters: filtersFromAccept(p.accept),
    });
    if (res.canceled || !res.filePaths.length) return { canceled: true, files: [] };
    const files = [];
    for (const fp of res.filePaths.slice(0, 20)) {
      const st = await fsp.stat(fp);
      if (st.size > MAX_OPEN_BYTES) throw new Error(path.basename(fp) + " is too large (limit 50 MB).");
      const buf = await fsp.readFile(fp);
      const ext = path.extname(fp).toLowerCase();
      const text = TEXT_EXT.has(ext);
      files.push({
        name: path.basename(fp),
        path: fp,
        type: MIME[ext] || "",
        size: st.size,
        encoding: text ? "utf8" : "base64",
        content: text ? buf.toString("utf8") : buf.toString("base64"),
      });
    }
    return { canceled: false, files };
  });

  ipcMain.handle("focusdesk:openBackupFolder", async (e) => {
    assertTrusted(e);
    const err = await shell.openPath(DATA_DIR);
    return { ok: !err, path: DATA_DIR, error: err || null };
  });
}

/* ---------------------------------------------------------------------------
 * Desktop 1.1: native notifications, quick capture, tray, launch at login
 * ------------------------------------------------------------------------- */
const DEFAULT_DPREFS = {
  notifications: true,
  notifyAlways: true, // show native notifications even while FocusDesk is the front window
  dueOverdue: true, // include overdue tasks and assignments in the tray / menu bar list
  hotkey: true,
  updateMode: process.platform === "darwin" ? "notify" : "auto", // "auto" installs updates by itself, "ask" asks first, "notify" just tells you (Mac is always "notify")
  popoutBounds: {}, // where each popped-out app was last (size and position)
  mirrorLatest: false, // keep focusdesk-latest.json (your newest data) in the backup folder, for the browser version to pick up
  npCoverLookup: false, // when the player gives no cover picture, look one up online by song and artist (off unless you want it)
  taskbarBadge: false, // a red number on the taskbar icon for what is due (off unless you want it)
  cardHotkey: true, // Ctrl/Cmd+Shift+Y sends the text on your clipboard to a new flash card
  closeToTray: false,
  launchAtLogin: false,
  startHidden: false,
  slimTitle: true, // Windows: menu behind a ⋯ button in a slim title bar. (Set false in desktop.json to turn off.)
  timerHotkey: false, // start / pause the focus timer from anywhere (you choose the keys)
  showHotkey: false, // bring FocusDesk to the front from anywhere (you choose the keys)
  hotkeyKeys: { capture: "CommandOrControl+Shift+Space", card: "CommandOrControl+Shift+Y", timer: "", show: "" },
  backupPath: "",
  backupKeep: 7,
};
let compactActive = false; // was the current window built with the slim title bar? (Windows only, set at creation)
let cardHotkeyOk = false;
let hotkeyState = {}; // per shortcut: "ok", "busy" (another app has it), "dup" (same keys as another one) or "off"
let dprefs = Object.assign({}, DEFAULT_DPREFS);
let tray = null;
let captureWin = null;
let hotkeyOk = false;
let firstWindow = true;

/* A shortcut is modifier keys plus one key, like "Control+Alt+K". Plain keys are refused so FocusDesk can't take over typing. */
function validAccel(s) {
  if (typeof s !== "string" || s.length > 60) return false;
  const parts = s.split("+");
  if (parts.length < 2 || parts.length > 5) return false;
  const key = parts.pop();
  const MODS = ["Command", "Cmd", "Control", "Ctrl", "CommandOrControl", "CmdOrCtrl", "Alt", "Option", "Shift", "Super", "Meta"];
  if (!parts.every((x) => MODS.indexOf(x) >= 0)) return false;
  if (new Set(parts).size !== parts.length) return false;
  if (!/^([A-Z0-9]|F([1-9]|1[0-9]|2[0-4])|Space|Tab|Backspace|Delete|Insert|Return|Up|Down|Left|Right|Home|End|PageUp|PageDown|[-=\[\];',.\/\\`])$/.test(key)) return false;
  return parts.some((x) => x !== "Shift");
}
/* true for addresses that point at the person's own computer or network (so a web lookup can't be aimed at them) */
function isPrivateHost(host) {
  let h = String(host || "").toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
  if (!h) return true;
  if (h === "localhost" || /\.(localhost|local|internal|lan|home|corp)$/.test(h)) return true;
  const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(h);
  if (v4) {
    const a = +v4[1],
      b = +v4[2];
    return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
  }
  if (h.indexOf(":") >= 0) {
    if (h === "::1" || h === "::") return true;
    if (/^f[cd][0-9a-f]{2}:/.test(h) || /^fe[89ab][0-9a-f]:/.test(h)) return true; // private and link-local ranges
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(h);
    if (mapped) return isPrivateHost(mapped[1]);
    // the same thing written in hex, which is how a URL is normalised: ::ffff:7f00:1 is 127.0.0.1
    const hex = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(h);
    if (hex) {
      const hi = parseInt(hex[1], 16),
        lo = parseInt(hex[2], 16);
      return isPrivateHost([hi >> 8, hi & 255, lo >> 8, lo & 255].join("."));
    }
  }
  return false;
}
/* the tags written in square brackets in a release title, like "v1.4.2 [MINOR] [BETA]" (BETA is left out: betas are never offered) */
function tagsFromName(name) {
  const out = [];
  String(name || "").replace(/\[([A-Za-z]+)\]/g, (m, w) => {
    w = w.toUpperCase();
    if (["MAJOR", "MINOR", "STABILITY", "HOTFIX"].indexOf(w) >= 0 && out.indexOf(w) < 0) out.push(w);
    return m;
  });
  return ["MAJOR", "MINOR", "STABILITY", "HOTFIX"].filter((k) => out.indexOf(k) >= 0); // always in the same order
}
/* the newest FINISHED release in GitHub's release feed: a [BETA] pre-release is never offered as an update */
function latestFromFeed(xml) {
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = entryRe.exec(String(xml || "")))) {
    const title = (/<title[^>]*>([\s\S]*?)<\/title>/.exec(m[1]) || [])[1] || "";
    const hit = /<link[^>]*href="https:\/\/github\.com\/[^"]*\/releases\/tag\/([^"]*)"/.exec(m[1]);
    if (!hit) continue;
    if (/beta/i.test(title) || /beta/i.test(hit[1])) continue;
    const ver = /^v?(\d+(?:\.\d+){1,3})$/.exec(hit[1]);
    if (ver) {
      ver.tags = tagsFromName(title);
      return ver;
    }
  }
  return null;
}
function validBounds(b) {
  return !!b && typeof b === "object" && [b.x, b.y, b.width, b.height].every((n) => typeof n === "number" && isFinite(n)) && b.width >= 300 && b.height >= 200 && b.width <= 12000 && b.height <= 12000 && Math.abs(b.x) < 40000 && Math.abs(b.y) < 40000;
}
/* Where a pop-out window opens, as a plain calculation (so it can be tested with made-up screens):
 *  - a remembered place on a screen that is still connected: kept, but never bigger than that screen and always fully on it
 *  - a remembered place on a screen that is gone: the remembered SIZE is kept, and the window opens near the main window
 *  - nothing remembered: a cascade near the main window, kept on that window's screen */
function placePopout(saved, near, displays, nth) {
  const areas = (displays || []).map((d) => d && d.workArea).filter((a) => a && a.width > 0 && a.height > 0);
  const primary = areas[0] || { x: 0, y: 0, width: 1280, height: 800 };
  const MINW = 420,
    MINH = 320;
  const fit = (r, a) => {
    const width = Math.max(MINW, Math.min(r.width, a.width)),
      height = Math.max(MINH, Math.min(r.height, a.height));
    return {
      x: Math.round(Math.max(a.x, Math.min(r.x, a.x + a.width - width))),
      y: Math.round(Math.max(a.y, Math.min(r.y, a.y + a.height - height))),
      width: Math.round(width),
      height: Math.round(height),
    };
  };
  const areaOf = (pt) => areas.find((a) => pt.x >= a.x && pt.x < a.x + a.width && pt.y >= a.y && pt.y < a.y + a.height) || primary;
  const step = (Number(nth) || 0) % 8 * 28;
  const cascade = (size) => {
    const target = near ? areaOf({ x: near.x + near.width / 2, y: near.y + 20 }) : primary;
    const from = near ? { x: near.x, y: near.y } : { x: target.x, y: target.y };
    return fit({ x: from.x + 60 + step, y: from.y + 50 + step, width: size.width, height: size.height }, target);
  };
  if (saved && validBounds(saved)) {
    let best = null,
      bestArea = 0;
    for (const a of areas) {
      const ox = Math.min(saved.x + saved.width, a.x + a.width) - Math.max(saved.x, a.x),
        oy = Math.min(saved.y + saved.height, a.y + a.height) - Math.max(saved.y, a.y);
      if (ox >= 160 && oy >= 100 && ox * oy > bestArea) {
        best = a;
        bestArea = ox * oy;
      }
    }
    if (best) return Object.assign(fit(saved, best), { max: !!saved.max, remembered: true });
    return Object.assign(cascade({ width: saved.width, height: saved.height }), { max: false, remembered: false });
  }
  return Object.assign(cascade({ width: 900, height: 720 }), { max: false, remembered: false });
}
function mergeDprefs(base, p) {
  const clean = cleanDprefs(p);
  const out = Object.assign({}, base, clean);
  out.hotkeyKeys = Object.assign({}, DEFAULT_DPREFS.hotkeyKeys, base && base.hotkeyKeys, clean.hotkeyKeys);
  out.popoutBounds = Object.assign({}, base && base.popoutBounds, clean.popoutBounds);
  return out;
}
function cleanDprefs(p) {
  const out = {};
  if (p && p.hotkeyKeys && typeof p.hotkeyKeys === "object") {
    out.hotkeyKeys = {};
    for (const id of Object.keys(DEFAULT_DPREFS.hotkeyKeys)) {
      const v = p.hotkeyKeys[id];
      if (v === "" || validAccel(v)) out.hotkeyKeys[id] = v;
    }
  }
  if (p && typeof p === "object")
    for (const k of Object.keys(DEFAULT_DPREFS)) {
      if (typeof DEFAULT_DPREFS[k] === "boolean" && typeof p[k] === "boolean") out[k] = p[k];
    }
  if (p && typeof p.backupPath === "string" && p.backupPath.length < 1000 && path.isAbsolute(p.backupPath)) out.backupPath = p.backupPath;
  if (p && p.backupPath === "") out.backupPath = "";
  if (p && [0, 7, 14, 30].indexOf(p.backupKeep) >= 0) out.backupKeep = p.backupKeep;
  if (p && ["auto", "ask", "notify"].indexOf(p.updateMode) >= 0) out.updateMode = p.updateMode;
  if (p && p.popoutBounds && typeof p.popoutBounds === "object") {
    out.popoutBounds = {};
    Object.keys(p.popoutBounds)
      .slice(0, 40)
      .forEach((id) => {
        const b = p.popoutBounds[id];
        if (/^[a-z]{2,20}$/.test(id) && validBounds(b)) out.popoutBounds[id] = { x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height), max: !!b.max };
      });
  }
  return out;
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow();
    return;
  }
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

/** Resolves with the main window's webContents once it has loaded (creating a hidden one if needed). */
function whenMainReady() {
  return new Promise((resolve) => {
    if (!mainWindow || mainWindow.isDestroyed()) createWindow(true);
    const wc = mainWindow.webContents;
    if (!wc.isLoading()) return resolve(wc);
    wc.once("did-finish-load", () => resolve(wc));
  });
}

/** Returns { ok, reason }. reason: "off" | "unsupported" | "focused" | an error message. */
function notifyNative(title, body, opts) {
  opts = opts || {};
  if (!opts.force && !dprefs.notifications) return { ok: false, reason: "off" };
  if (!Notification.isSupported()) return { ok: false, reason: "unsupported" };
  // Optional: if you're already looking at FocusDesk, the in-app dialog is enough.
  if (!opts.force && !dprefs.notifyAlways && mainWindow && !mainWindow.isDestroyed() && mainWindow.isFocused())
    return { ok: false, reason: "focused" };
  try {
    const n = new Notification({ title: title, body: body });
    n.on("click", showMainWindow);
    n.on("failed", (e, err) => console.error("[focusdesk] notification failed:", err));
    n.show();
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: String((e && e.message) || e) };
  }
}

async function captureInit(kind) {
  const p = { kind: kind };
  if (kind === "card") {
    try {
      // whatever you just copied becomes the front of the card (newer Electron versions read the clipboard asynchronously)
      p.front = String((await clipboard.readText()) || "").trim().slice(0, 500);
    } catch (_) {
      p.front = "";
    }
  }
  return p;
}
function openCapture(kind) {
  if (captureWin && !captureWin.isDestroyed()) {
    const cw = captureWin;
    captureInit(kind).then((init) => {
      if (!cw.isDestroyed()) cw.webContents.send("capture:init", init);
    });
    captureWin.show();
    captureWin.focus();
    return;
  }
  const a = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea;
  const w = 560,
    h = kind === "card" ? 172 : 126;
  const win = new BrowserWindow({
    width: w,
    height: h,
    x: Math.round(a.x + (a.width - w) / 2),
    y: Math.round(a.y + a.height * 0.22),
    frame: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    backgroundColor: "#c0c0c0",
    title: "Quick Capture",
    webPreferences: {
      preload: path.join(__dirname, "capture-preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  captureWin = win;
  win.setMenuBarVisibility(false);
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (ev) => ev.preventDefault());
  win.loadFile(path.join(__dirname, "capture.html"));
  win.webContents.once("did-finish-load", async () => {
    const init = await captureInit(kind);
    if (win.isDestroyed()) return;
    win.webContents.send("capture:init", init);
    win.show();
    win.focus();
  });
  let armed = false;
  setTimeout(() => {
    armed = true;
  }, 500);
  win.on("blur", () => {
    if (armed && !win.isDestroyed()) win.close(); // clicking away dismisses it
  });
  win.on("closed", () => {
    if (captureWin === win) captureWin = null;
  });
}

const HOTKEY_ACTIONS = [
  { id: "capture", on: "hotkey", run: () => openCapture("task") },
  { id: "card", on: "cardHotkey", run: () => openCapture("card") },
  { id: "timer", on: "timerHotkey", run: () => sendCmd("timer-toggle", false) },
  { id: "show", on: "showHotkey", run: () => showMainWindow() },
];
function registerHotkey() {
  try {
    globalShortcut.unregisterAll();
  } catch (_) {}
  hotkeyState = {};
  const used = {};
  for (const a of HOTKEY_ACTIONS) {
    const key = dprefs.hotkeyKeys && dprefs.hotkeyKeys[a.id];
    if (!dprefs[a.on] || !key) {
      hotkeyState[a.id] = "off";
      continue;
    }
    if (used[key.toLowerCase()]) {
      hotkeyState[a.id] = "dup";
      continue;
    }
    used[key.toLowerCase()] = 1;
    let ok = false;
    try {
      ok = globalShortcut.register(key, a.run) && globalShortcut.isRegistered(key);
    } catch (_) {
      ok = false;
    }
    hotkeyState[a.id] = ok ? "ok" : "busy";
  }
  hotkeyOk = hotkeyState.capture === "ok";
  cardHotkeyOk = hotkeyState.card === "ok";
}

const mmss = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(Math.floor(s % 60)).padStart(2, "0");
function updateTrayTimer(t) {
  lastTimer = t;
  if (miniWin && !miniWin.isDestroyed()) miniWin.webContents.send("mini:status", t);
  if (!tray) return;
  const active = t && (t.running || t.paused);
  const label = active ? (t.running ? (t.mode === "focus" ? "Focus " : "Break ") : "Paused ") + mmss(Math.max(0, t.left)) : "";
  try {
    tray.setToolTip(label ? "FocusDesk 96 \u2014 " + label : "FocusDesk 96");
    if (process.platform === "darwin") tray.setTitle(t && t.running ? " " + mmss(Math.max(0, t.left)) : "");
  } catch (_) {}
}

let due = { cards: 0, tasks: 0, tasksOver: 0, assign: 0, assignOver: 0, items: [], badge: null };
let lastTimer = null;
let miniWin = null;

function quickFromArgs(argv) {
  const a = (argv || []).find((x) => /^--quick=(task|card|timer|nowplaying|askclipy|minitimer)$/.test(String(x)));
  return a ? String(a).slice(8) : "";
}
function runQuick(kind) {
  if (kind === "task" || kind === "card") openCapture(kind);
  else if (kind === "timer") sendCmd("timer-toggle", true);
  else if (kind === "nowplaying") openNowPlaying();
  else if (kind === "askclipy") openClipyChat("");
  else if (kind === "minitimer") openMiniTimer();
}
function sendCmd(cmd, show) {
  return whenMainReady().then((wc) => {
    if (show) showMainWindow();
    wc.send("focusdesk:cmd", cmd);
  });
}

/* the menu bar / tray picture: on a Mac a "template" image (black shapes that macOS paints black or white to suit the menu bar), elsewhere the colour one */
function trayImage() {
  if (process.platform === "darwin") {
    const t = nativeImage.createFromPath(path.join(__dirname, "assets", "trayTemplate.png")); // trayTemplate@2x.png is picked up by itself on Retina screens
    if (!t.isEmpty()) {
      t.setTemplateImage(true);
      return t;
    }
  }
  return nativeImage.createFromPath(path.join(__dirname, "assets", "tray.png"));
}
function buildTrayMenu() {
  const total = due.cards + due.tasks + due.assign;
  const items = [{ label: "Open FocusDesk 96", click: showMainWindow }, { type: "separator" }];
  // Due counts live inside the menu (not on the icon) so nothing nags until you click it.
  if (total > 0) {
    if (due.assign > 0) {
      const over = due.assignOver ? " (" + due.assignOver + " overdue)" : "";
      const sub = due.items.map((label) => ({ label: label, click: () => sendCmd("open:planner", true) }));
      sub.push({ type: "separator" }, { label: "Open Assignment Planner", click: () => sendCmd("open:planner", true) });
      items.push({ label: due.assign + (due.assign === 1 ? " assignment" : " assignments") + " due" + over, submenu: sub });
    }
    if (due.tasks > 0) {
      const over = due.tasksOver ? " (" + due.tasksOver + " overdue)" : "";
      items.push({ label: due.tasks + (due.tasks === 1 ? " task" : " tasks") + " due" + over, click: () => sendCmd("open:tasks", true) });
    }
    if (due.cards > 0) items.push({ label: due.cards + (due.cards === 1 ? " card" : " cards") + " due", click: () => sendCmd("open:cards", true) });
  } else items.push({ label: "Nothing due right now", enabled: false });
  items.push(
    { type: "separator" },
    { label: "Start focus session", click: () => sendCmd("focus") },
    { label: "Mini timer", click: openMiniTimer },
    { label: "Now playing", click: openNowPlaying },
    { label: "Add quick task\u2026", click: () => openCapture("task") },
    { label: "New flash card from clipboard\u2026", click: () => openCapture("card") },
    { label: "Ask Clipy\u2026", click: () => openClipyChat("") },
    { label: "Pop out an app", submenu: POPOUT_MENU.map(([id, title]) => ({ label: title, click: () => sendCmd("popout:" + id, false) })) },
    { type: "separator" },
    {
      label: "Quit FocusDesk 96",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    }
  );
  return Menu.buildFromTemplate(items);
}

function applyDue() {
  if (tray) {
    try {
      tray.setContextMenu(buildTrayMenu());
    } catch (_) {}
  }
  const total = due.cards + due.tasks + due.assign;
  try {
    if (process.platform === "win32" && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setOverlayIcon(dprefs.taskbarBadge && total > 0 && due.badge ? nativeImage.createFromDataURL(due.badge) : null, dprefs.taskbarBadge && total > 0 ? total + " due" : "");
    } else if (process.platform === "linux") app.setBadgeCount(dprefs.taskbarBadge ? total : 0);
    else if (process.platform === "darwin" && app.dock) app.dock.setBadge(dprefs.taskbarBadge && total > 0 ? (total > 999 ? "999+" : String(total)) : ""); // the red number on the Dock icon (off unless you turn it on)
  } catch (_) {}
}

function ensureTray() {
  if (tray) return;
  try {
    const img = trayImage();
    if (img.isEmpty()) return;
    tray = new Tray(img);
    tray.setToolTip("FocusDesk 96");
    tray.setContextMenu(buildTrayMenu());
    tray.on("click", () => {
      if (process.platform !== "darwin") showMainWindow();
    });
  } catch (e) {
    console.error("[focusdesk] tray unavailable:", e);
    tray = null;
  }
}

/* ---- mini timer: a small always-on-top pill you can drag to any screen ---- */
const MINI_FILE = path.join(DATA_DIR, "mini-timer.json");
function openMiniTimer() {
  if (miniWin && !miniWin.isDestroyed()) {
    miniWin.show();
    return;
  }
  let pos = null;
  try {
    pos = JSON.parse(fs.readFileSync(MINI_FILE, "utf8"));
  } catch (_) {}
  const w = 330,
    h = 68;
  let x, y;
  const onScreen =
    pos && Number.isFinite(pos.x) && Number.isFinite(pos.y) && screen.getAllDisplays().some((d) => {
      const a = d.workArea;
      return pos.x >= a.x - 20 && pos.x + 60 < a.x + a.width && pos.y >= a.y - 20 && pos.y + 20 < a.y + a.height;
    });
  if (onScreen) {
    x = Math.round(pos.x);
    y = Math.round(pos.y);
  } else {
    const a = screen.getPrimaryDisplay().workArea; // default: top right of the main screen
    x = a.x + a.width - w - 24;
    y = a.y + 24;
  }
  const win = new BrowserWindow({
    width: w,
    height: h,
    x: x,
    y: y,
    frame: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    backgroundColor: "#c0c0c0",
    title: "FocusDesk Timer",
    webPreferences: { preload: path.join(__dirname, "aux-preload.js"), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  miniWin = win;
  win.setAlwaysOnTop(true, "floating");
  if (process.platform === "darwin") win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setMenuBarVisibility(false);
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (ev) => ev.preventDefault());
  win.loadFile(path.join(__dirname, "timer-mini.html"));
  win.webContents.once("did-finish-load", () => {
    win.show();
    if (lastTimer) win.webContents.send("mini:status", lastTimer);
  });
  let saveT = null;
  win.on("move", () => {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try {
        const b = win.getBounds();
        atomicWrite(MINI_FILE, JSON.stringify({ x: b.x, y: b.y })).catch(() => {});
      } catch (_) {}
    }, 400);
  });
  win.on("closed", () => {
    if (miniWin === win) miniWin = null;
  });
}
function closeMiniTimer() {
  if (miniWin && !miniWin.isDestroyed()) miniWin.close();
}

/* ---- now playing: a small always-on-top pill with play/pause/next/previous ---- */
const NP_FILE = path.join(DATA_DIR, "now-playing.json");
let npWin = null;
let npTimer = null;
let npLast = null;
/* ---- album art: read once per song, turned into a small data: image the pill can show safely ---- */
const ART_HOSTS = [/(^|\.)scdn\.co$/i, /(^|\.)mzstatic\.com$/i, /(^|\.)ytimg\.com$/i, /(^|\.)googleusercontent\.com$/i, /(^|\.)sndcdn\.com$/i];
function sniffImage(b) {
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length > 6 && b.slice(0, 4).toString("latin1") === "GIF8") return "image/gif";
  if (b.length > 12 && b.slice(0, 4).toString("latin1") === "RIFF" && b.slice(8, 12).toString("latin1") === "WEBP") return "image/webp";
  return null;
}
function toDataUrl(buf) {
  if (!buf || buf.length < 32 || buf.length > 2.5 * 1024 * 1024) return null;
  const mime = sniffImage(buf);
  return mime ? "data:" + mime + ";base64," + buf.toString("base64") : null;
}
/* Optional: the player gave no picture, so ask Apple's public music search for the cover. Only an exact song-and-artist match counts. */
const coverCache = new Map();
const normTitle = (t) => String(t || "").toLowerCase().replace(/\(.*?\)|\[.*?\]/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
async function lookupCover(s) {
  const title = normTitle(s.title),
    artist = normTitle(s.artist);
  if (title.length < 2 || !artist) return null; // a video or tab with no artist: don't guess
  const key = title + "|" + artist;
  if (coverCache.has(key)) return coverCache.get(key) || null;
  let out = "";
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 8000);
  try {
    const q = encodeURIComponent((String(s.title) + " " + String(s.artist)).slice(0, 120));
    const res = await net.fetch("https://itunes.apple.com/search?media=music&entity=song&limit=5&term=" + q, { signal: ctl.signal });
    if (res.ok) {
      const j = await res.json();
      const hit = ((j && j.results) || []).find((r) => {
        const t = normTitle(r.trackName),
          a = normTitle(r.artistName);
        return t && a && (t === title || title.indexOf(t) === 0 || t.indexOf(title) === 0) && (a === artist || artist.indexOf(a) >= 0 || a.indexOf(artist) >= 0);
      });
      if (hit && /^https:\/\/[a-z0-9.-]+\.mzstatic\.com\//i.test(hit.artworkUrl100 || "")) {
        const img = await net.fetch(String(hit.artworkUrl100).replace(/\/\d+x\d+bb\.(jpg|png)$/i, "/600x600bb.$1"), { signal: ctl.signal });
        if (img.ok) out = toDataUrl(Buffer.from(await img.arrayBuffer())) || "";
      }
    }
  } catch (_) {
  } finally {
    clearTimeout(timer);
  }
  coverCache.set(key, out);
  if (coverCache.size > 60) coverCache.delete(coverCache.keys().next().value);
  return out || null;
}
async function resolveArt(s) {
  try {
    if (s.artUrl) {
      if (/^file:/i.test(s.artUrl)) {
        const p = fileURLToPath(s.artUrl);
        if (fs.statSync(p).size > 2.5 * 1024 * 1024) return null;
        return toDataUrl(fs.readFileSync(p)); // must really be an image, or it is ignored
      }
      const u = new URL(s.artUrl);
      if (u.protocol !== "https:" || !ART_HOSTS.some((re) => re.test(u.hostname))) return null;
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 8000);
      try {
        const res = await net.fetch(u.toString(), { signal: ctl.signal, redirect: "follow" });
        if (!res.ok) return null;
        return toDataUrl(Buffer.from(await res.arrayBuffer()));
      } finally {
        clearTimeout(timer);
      }
    }
    const a = await nowPlaying.art(s.source);
    if (a && a.b64) return toDataUrl(Buffer.from(a.b64, "base64"));
    if (a && a.file) {
      try {
        return toDataUrl(fs.readFileSync(a.file));
      } finally {
        fs.unlink(a.file, () => {});
      }
    }
    if (dprefs.npCoverLookup) return await lookupCover(s);
  } catch (_) {}
  return null;
}
let npKey = "";
let npArt = "";
let npMainWatch = false; // the clock flyout and taskbar indicator inside FocusDesk are listening too
const npNeeded = () => (npWin && !npWin.isDestroyed()) || npMainWatch;
function npEnsureTimer() {
  if (npNeeded()) {
    if (!npTimer) {
      npTimer = setInterval(npPoll, 3500); // only while something is showing it
      npPoll();
    }
  } else if (npTimer) {
    clearInterval(npTimer);
    npTimer = null;
  }
}
function npBroadcast(payload) {
  if (npWin && !npWin.isDestroyed()) npWin.webContents.send("np:status", payload);
  if (npMainWatch && mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send("focusdesk:np", payload);
}
async function npPoll() {
  if (!npNeeded()) return;
  const s = await nowPlaying.status();
  npLast = s;
  const key = s && s.title ? [s.source, s.title, s.artist].join("|") : "";
  if (key !== npKey) {
    npKey = key;
    npArt = "";
    if (key)
      resolveArt(s).then((a) => {
        if (npKey !== key) return; // the song changed again while the cover was loading
        npArt = a || "";
        npBroadcast(Object.assign({}, npLast, { art: npArt }));
      });
  }
  npBroadcast(Object.assign({}, s, { art: npArt }));
}
/* play, pause, skip, seek, shuffle and repeat, from the pill or from inside FocusDesk */
async function npControl(msg, fromPill) {
  const cmd = msg && typeof msg === "object" ? msg.cmd : msg;
  if (fromPill && cmd === "close") return closeNowPlaying();
  if (fromPill && cmd === "open") return showMainWindow();
  const src = npLast && npLast.source;
  if (cmd === "toggle" || cmd === "next" || cmd === "prev") await nowPlaying.control(cmd, src);
  else if (cmd === "seek") {
    const sec = Number(msg && msg.sec);
    if (!Number.isFinite(sec)) return;
    await nowPlaying.control("seek", src, sec);
  } else if (cmd === "shuffle") await nowPlaying.control("shuffle", src, !(npLast && npLast.shuffle));
  else if (cmd === "repeat") {
    const cyc = { off: "all", all: "one", one: "off" };
    if (src === "Spotify") cyc.all = "off"; // Spotify only has repeat on or off
    await nowPlaying.control("repeat", src, cyc[(npLast && npLast.repeat) || "off"] || "all");
  } else return;
  setTimeout(npPoll, 350); // show the new state right away
}
function openNowPlaying() {
  if (npWin && !npWin.isDestroyed()) {
    npWin.show();
    return;
  }
  let pos = null;
  try {
    pos = JSON.parse(fs.readFileSync(NP_FILE, "utf8"));
  } catch (_) {}
  const w = 480,
    h = 106;
  const onScreen =
    pos && Number.isFinite(pos.x) && Number.isFinite(pos.y) && screen.getAllDisplays().some((d) => {
      const a = d.workArea;
      return pos.x >= a.x - 20 && pos.x + 80 < a.x + a.width && pos.y >= a.y - 20 && pos.y + 20 < a.y + a.height;
    });
  const wa = screen.getPrimaryDisplay().workArea;
  const win = new BrowserWindow({
    width: w,
    height: h,
    x: onScreen ? Math.round(pos.x) : wa.x + 24,
    y: onScreen ? Math.round(pos.y) : wa.y + wa.height - h - 24,
    frame: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    backgroundColor: "#c0c0c0",
    title: "Now Playing",
    webPreferences: { preload: path.join(__dirname, "aux-preload.js"), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  npWin = win;
  win.setAlwaysOnTop(true, "floating");
  if (process.platform === "darwin") win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setMenuBarVisibility(false);
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (ev) => ev.preventDefault());
  win.loadFile(path.join(__dirname, "nowplaying.html"));
  win.webContents.once("did-finish-load", () => {
    win.show();
    npPoll();
  });
  npEnsureTimer();
  let saveT = null;
  win.on("move", () => {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try {
        const b = win.getBounds();
        atomicWrite(NP_FILE, JSON.stringify({ x: b.x, y: b.y })).catch(() => {});
      } catch (_) {}
    }, 400);
  });
  win.on("closed", () => {
    if (npWin === win) npWin = null;
    npKey = "";
    npArt = "";
    npEnsureTimer();
  });
}
function closeNowPlaying() {
  if (npWin && !npWin.isDestroyed()) npWin.close();
}

/* ---- Ask Clipy: the real Clipy panel, in its own always-on-top window (built by the app itself) ---- */
function openClipyChat(question) {
  return sendCmd(question ? "clipy:" + String(question).slice(0, 2000) : "clipy");
}

function applyLoginItem() {
  if (!app.isPackaged) return { ok: false, reason: "Only available in the installed app." };
  try {
    if (process.platform === "linux") {
      const dir = path.join(app.getPath("home"), ".config", "autostart");
      const f = path.join(dir, "focusdesk-96.desktop");
      if (dprefs.launchAtLogin) {
        fs.mkdirSync(dir, { recursive: true });
        const exe = process.env.APPIMAGE || process.execPath;
        fs.writeFileSync(f, '[Desktop Entry]\nType=Application\nName=FocusDesk 96\nExec="' + exe + '" --hidden\nX-GNOME-Autostart-enabled=true\n');
      } else fs.rmSync(f, { force: true });
    } else {
      app.setLoginItemSettings({ openAtLogin: dprefs.launchAtLogin, args: ["--hidden"] });
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: String((e && e.message) || e) };
  }
}

function launchedHidden() {
  return (
    dprefs.startHidden &&
    !!tray &&
    (process.argv.indexOf("--hidden") >= 0 || (process.platform === "darwin" && app.getLoginItemSettings().wasOpenedAtLogin))
  );
}

function applyDesktopPrefs() {
  ensureTray();
  registerHotkey();
  applyLoginItem();
}

function registerDesktopIpc() {
  const isCaptureSender = (e) => captureWin && !captureWin.isDestroyed() && e.sender === captureWin.webContents;
  const trusted = (e) => {
    try {
      assertTrusted(e);
      return true;
    } catch (_) {
      return false;
    }
  };

  ipcMain.handle("focusdesk:notify", (e, p) => {
    assertTrusted(e);
    return notifyNative(String((p && p.title) || "FocusDesk 96").slice(0, 100), String((p && p.body) || "").slice(0, 300));
  });

  ipcMain.handle("focusdesk:testNotify", (e) => {
    assertTrusted(e);
    return notifyNative("FocusDesk 96", "Notifications are working. You'll see reminders and finished focus sessions here.", { force: true });
  });

  ipcMain.handle("focusdesk:setDesktopPrefs", async (e, p) => {
    assertTrusted(e);
    dprefs = mergeDprefs(dprefs, p);
    if (p && p.resetPopoutBounds === true) dprefs.popoutBounds = {}; // forget where pop-outs were
    await atomicWrite(FILES.desktop, JSON.stringify(dprefs, null, 2));
    registerHotkey();
    ensureTray();
    if (p && p.taskbarBadge !== undefined) applyDue();
    if (p && p.backupKeep !== undefined) {
      backupCheckedFor = null;
      await ensureDailyBackup();
    }
    const login = applyLoginItem();
    return { ok: true, prefs: dprefs, hotkeyOk: hotkeyOk, cardHotkeyOk: cardHotkeyOk, hotkeys: hotkeyState, updater: { supported: !!updater, mode: dprefs.updateMode }, trayOk: !!tray, login: login };
  });

  ipcMain.handle("focusdesk:popupMenu", (e, p) => {
    assertTrusted(e);
    const win = BrowserWindow.fromWebContents(e.sender);
    const m = Menu.getApplicationMenu();
    if (!win || !m) return { ok: false };
    m.popup({ window: win, x: Math.round(Number(p && p.x) || 0), y: Math.round(Number(p && p.y) || 0) });
    return { ok: true };
  });

  ipcMain.handle("focusdesk:openCapture", (e, p) => {
    assertTrusted(e);
    const k = p && p.kind;
    openCapture(["task", "note", "reminder", "event", "card", "ask"].indexOf(k) >= 0 ? k : "task");
    return { ok: true };
  });

  /* The mini timer and the Now Playing pill are dragged by the page (works the same on every system). */
  ipcMain.on("win:move", (e, p) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (!win || win.isDestroyed() || (win !== miniWin && win !== npWin)) return;
    let x = Math.round(Number(p && p.x)),
      y = Math.round(Number(p && p.y));
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    const b = win.getBounds();
    const d = screen.getDisplayNearestPoint({ x: x + Math.round(b.width / 2), y: y + 10 }).workArea;
    x = Math.max(d.x - b.width + 80, Math.min(x, d.x + d.width - 80)); // always leave part of it on a screen
    y = Math.max(d.y, Math.min(y, d.y + d.height - 40));
    win.setBounds({ x: x, y: y, width: b.width, height: b.height }); // keep the size fixed while moving
  });

  /* Newest release: GitHub's API first, then the public release feed (which has no request limit). */
  ipcMain.handle("focusdesk:latestRelease", async (e) => {
    assertTrusted(e);
    const REPO = "apojidelegraphics/FocusDesk-96";
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 15000);
    const get = (url, accept) => net.fetch(url, { signal: ctl.signal, redirect: "follow", headers: { "User-Agent": "FocusDesk96", Accept: accept } });
    let status = 0;
    try {
      try {
        const r = await get("https://api.github.com/repos/" + REPO + "/releases/latest", "application/vnd.github+json");
        status = r.status;
        if (r.ok) {
          const rel = await r.json();
          const tag = String(rel.tag_name || "").replace(/^v/i, "");
          if (/^\d+(\.\d+){1,3}$/.test(tag)) {
            let browserVer = "",
              browserUrl = "";
            (rel.assets || []).forEach((a) => {
              const mm = /^FocusDesk-96-Browser-(\d+(?:\.\d+)*)\.zip$/.exec((a && a.name) || "");
              if (mm && /^https:\/\/github\.com\//.test(a.browser_download_url || "")) {
                browserVer = mm[1];
                browserUrl = a.browser_download_url;
              }
            });
            const url = /^https:\/\/github\.com\//.test(rel.html_url || "") ? rel.html_url : "https://github.com/" + REPO + "/releases";
            return { ok: true, info: { tag: tag, url: url, browserVer: browserVer, browserUrl: browserUrl, tags: tagsFromName(rel.name) } };
          }
        }
      } catch (_) {
        status = status || 0;
      }
      // the API said no (busy, blocked, or odd answer): the release feed lists the same releases
      try {
        const f = await get("https://github.com/" + REPO + "/releases.atom", "application/atom+xml,text/xml,*/*");
        if (f.ok) {
          const xml = await f.text();
          const hit = latestFromFeed(xml);
          if (hit) return { ok: true, info: { tag: hit[1], url: "https://github.com/" + REPO + "/releases/tag/v" + hit[1], browserVer: "", browserUrl: "", tags: hit.tags || [] } };
        }
      } catch (_) {}
      return { ok: false, status: status };
    } finally {
      clearTimeout(timer);
    }
  });

  /* Download a web page so the Citation Maker can read its title, author and date. https only, size and time limited. */
  ipcMain.handle("focusdesk:fetchPage", async (e, p) => {
    assertTrusted(e);
    let u;
    try {
      u = new URL(String((p && p.url) || "").trim());
    } catch (_) {
      return { ok: false, error: "That isn't a valid link." };
    }
    if (u.protocol !== "https:") return { ok: false, error: "The link has to start with https://." };
    if (isPrivateHost(u.hostname)) return { ok: false, error: "That address is on your own network, so it was blocked." };
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 15000);
    try {
      const res = await net.fetch(u.toString(), { signal: ctl.signal, redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (compatible; FocusDesk96)", Accept: "text/html,application/xhtml+xml" } });
      if (!res.ok) return { ok: false, error: "The site answered " + res.status + "." };
      if (res.url && isPrivateHost(new URL(res.url).hostname)) return { ok: false, error: "The link redirected to an address on your own network, so it was blocked." };
      if (res.url && !/^https:/i.test(res.url)) return { ok: false, error: "The link redirected to an unsecured page, so it was blocked." };
      const reader = res.body.getReader();
      const chunks = [];
      let size = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 2 * 1024 * 1024) {
          ctl.abort();
          break; // the title and author are near the top, so a partial page is fine
        }
        chunks.push(Buffer.from(value));
      }
      return { ok: true, text: Buffer.concat(chunks).toString("utf8").slice(0, 2 * 1024 * 1024) };
    } catch (err) {
      return { ok: false, error: err && err.name === "AbortError" ? "The page didn't answer in time." : "Couldn't reach that page." };
    } finally {
      clearTimeout(timer);
    }
  });

  ipcMain.handle("focusdesk:updateCheck", (e) => {
    assertTrusted(e);
    if (!updater) return { ok: false, supported: false };
    sendUpdate({ phase: "checking" });
    checkForUpdate();
    return { ok: true, supported: true };
  });
  ipcMain.handle("focusdesk:updateDownload", (e) => {
    assertTrusted(e);
    if (!updater) return { ok: false };
    startUpdateDownload();
    return { ok: true };
  });
  ipcMain.handle("focusdesk:updateInstallOnQuit", (e) => {
    assertTrusted(e);
    if (updater) updater.autoInstallOnAppQuit = true;
    return { ok: !!updater };
  });
  ipcMain.handle("focusdesk:updateInstall", async (e) => {
    assertTrusted(e);
    if (!updater || updState.phase !== "ready") return { ok: false };
    await flushDirty().catch(() => {}); // save everything first
    installingUpdate = true;
    updater.quitAndInstall(true, true); // silent installer (no setup wizard) and start FocusDesk again afterwards
    return { ok: true };
  });
  ipcMain.handle("focusdesk:toggleFullscreen", (e) => {
    assertTrusted(e);
    const win = BrowserWindow.fromWebContents(e.sender);
    if (!win || win.isDestroyed()) return { ok: false };
    win.setFullScreen(!win.isFullScreen());
    return { ok: true, fullScreen: win.isFullScreen() };
  });
  ipcMain.handle("focusdesk:openDataFolder", async (e) => {
    assertTrusted(e);
    const err = await shell.openPath(DATA_DIR);
    return { ok: !err, error: err || "", folder: DATA_DIR };
  });
  ipcMain.handle("focusdesk:npDiag", async (e) => {
    assertTrusted(e);
    return nowPlaying.diag();
  });

  /* Apple Calendar and Reminders (Mac only): reading, and writing to a calendar and list named FocusDesk. */
  ipcMain.handle("focusdesk:apple", (e, p) => {
    assertTrusted(e);
    return apple.call(String((p && p.action) || ""), (p && p.args) || {});
  });

  ipcMain.handle("focusdesk:nowPlaying", (e, p) => {
    assertTrusted(e);
    if (p && p.close) closeNowPlaying();
    else openNowPlaying();
    return { ok: true };
  });
  ipcMain.on("np:cmd", (e, msg) => {
    if (!npWin || npWin.isDestroyed() || e.sender !== npWin.webContents) return;
    npControl(msg, true);
  });
  ipcMain.handle("focusdesk:npCmd", async (e, msg) => {
    assertTrusted(e);
    await npControl(msg, false);
    return { ok: true };
  });
  ipcMain.handle("focusdesk:npWatch", (e, p) => {
    assertTrusted(e);
    npMainWatch = !!(p && p.on);
    npEnsureTimer();
    return { ok: true };
  });

  /* Download a calendar (.ics) feed for the Calendar Link app. https only, size and time limited. */
  ipcMain.handle("focusdesk:fetchIcs", async (e, p) => {
    assertTrusted(e);
    let raw = String((p && p.url) || "").trim().replace(/^webcal:\/\//i, "https://");
    let u;
    try {
      u = new URL(raw);
    } catch (_) {
      return { ok: false, error: "That isn't a valid link." };
    }
    if (u.protocol !== "https:") return { ok: false, error: "The link has to start with https:// or webcal://." };
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 20000);
    try {
      const res = await net.fetch(u.toString(), { signal: ctl.signal, redirect: "follow", headers: { "User-Agent": "FocusDesk96", Accept: "text/calendar,*/*" } });
      if (!res.ok) return { ok: false, error: "The calendar server answered " + res.status + "." };
      if (res.url && !/^https:/i.test(res.url)) return { ok: false, error: "The link redirected to an unsecured page, so it was blocked." };
      const reader = res.body.getReader();
      const chunks = [];
      let size = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 5 * 1024 * 1024) {
          ctl.abort();
          return { ok: false, error: "That calendar file is too big." };
        }
        chunks.push(Buffer.from(value));
      }
      const text = Buffer.concat(chunks).toString("utf8");
      if (!/BEGIN:VCALENDAR/i.test(text)) return { ok: false, error: "That link didn't return a calendar (.ics) file." };
      return { ok: true, text: text };
    } catch (err) {
      return { ok: false, error: err && err.name === "AbortError" ? "The calendar didn't answer in time." : "Couldn't reach that link." };
    } finally {
      clearTimeout(timer);
    }
  });

  ipcMain.handle("focusdesk:miniTimer", (e, p) => {
    assertTrusted(e);
    if (p && p.close) closeMiniTimer();
    else openMiniTimer();
    return { ok: true };
  });
  ipcMain.on("mini:cmd", (e, cmd) => {
    if (!miniWin || miniWin.isDestroyed() || e.sender !== miniWin.webContents) return;
    if (cmd === "toggle") sendCmd("timer-toggle");
    else if (cmd === "reset") sendCmd("timer-reset");
    else if (cmd === "open") showMainWindow();
    else if (cmd === "close") closeMiniTimer();
  });

  ipcMain.handle("focusdesk:openClipy", (e, p) => {
    assertTrusted(e);
    openClipyChat(p && typeof p.question === "string" ? p.question.slice(0, 2000) : "");
    return { ok: true };
  });
  /* "Continue with Clipy" from a popped-out app: the main window opens Clipy's own pop-out with the search or answer */
  ipcMain.handle("focusdesk:openClipySeed", (e, p) => {
    assertTrusted(e);
    const topic = p && typeof p.topic === "string" ? p.topic.slice(0, 300) : "";
    const text = p && typeof p.text === "string" ? p.text.slice(0, 12000) : "";
    if (!topic.trim() && !text.trim()) return { ok: false };
    sendCmd("clipyseed:" + JSON.stringify({ topic: topic, text: text }));
    return { ok: true };
  });
  ipcMain.on("focusdesk:dueCounts", (e, d) => {
    if (!trusted(e) || !d) return;
    const n = (v) => Math.max(0, Math.min(9999, Math.floor(Number(v) || 0)));
    due = {
      cards: n(d.cards),
      tasks: n(d.tasks),
      tasksOver: n(d.tasksOver),
      assign: n(d.assign),
      assignOver: n(d.assignOver),
      items: Array.isArray(d.items) ? d.items.slice(0, 10).map((x) => String(x).slice(0, 90)) : [],
      badge: typeof d.badge === "string" && /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(d.badge) && d.badge.length < 40000 ? d.badge : null,
    };
    applyDue();
  });

  ipcMain.handle("focusdesk:chooseBackupFolder", async (e) => {
    assertTrusted(e);
    const win = BrowserWindow.fromWebContents(e.sender);
    const res = await dialog.showOpenDialog(win, {
      title: "Choose where daily backups are saved",
      defaultPath: backupDir(),
      properties: ["openDirectory", "createDirectory"],
    });
    if (res.canceled || !res.filePaths.length) return { ok: false, canceled: true };
    const dir = res.filePaths[0];
    try {
      const probe = path.join(dir, ".focusdesk-write-test-" + process.pid);
      await fsp.writeFile(probe, "ok");
      await fsp.unlink(probe);
    } catch (err) {
      return { ok: false, error: "FocusDesk can't write to that folder." };
    }
    dprefs = Object.assign({}, dprefs, { backupPath: dir });
    await atomicWrite(FILES.desktop, JSON.stringify(dprefs, null, 2));
    backupCheckedFor = null;
    await ensureDailyBackup();
    return { ok: true, path: dir, prefs: dprefs, note: backupNote, backup: backups.status() };
  });
  ipcMain.handle("focusdesk:resetBackupFolder", async (e) => {
    assertTrusted(e);
    dprefs = Object.assign({}, dprefs, { backupPath: "" });
    await atomicWrite(FILES.desktop, JSON.stringify(dprefs, null, 2));
    backupCheckedFor = null;
    await ensureDailyBackup();
    return { ok: true, path: backupDir(), prefs: dprefs };
  });
  ipcMain.handle("focusdesk:backupNow", async (e) => {
    assertTrusted(e);
    return { ok: true, status: await backupNow() };
  });
  ipcMain.handle("focusdesk:backupStatus", (e) => {
    assertTrusted(e);
    return { ok: true, status: backups.status() };
  });
  /* ---- the crash log (everything here is local; "send" only opens a draft in the browser for the person to read and submit) ---- */
  const crashFile = path.join(DATA_DIR, "crash.log");
  let pageErrors = 0;
  ipcMain.handle("focusdesk:crashInfo", (e) => {
    assertTrusted(e);
    return Object.assign({ ok: true }, crash.info());
  });
  ipcMain.handle("focusdesk:crashReport", (e) => {
    assertTrusted(e);
    return { ok: true, text: crash.report(6000) };
  });
  ipcMain.handle("focusdesk:crashSeen", (e) => {
    assertTrusted(e);
    crash.markSeen();
    return { ok: true };
  });
  ipcMain.handle("focusdesk:crashClear", (e) => {
    assertTrusted(e);
    crash.clear();
    return { ok: true };
  });
  ipcMain.handle("focusdesk:crashOpen", async (e) => {
    assertTrusted(e);
    if (fs.existsSync(crashFile)) shell.showItemInFolder(crashFile);
    else await shell.openPath(DATA_DIR);
    return { ok: true };
  });
  ipcMain.handle("focusdesk:crashSend", async (e) => {
    assertTrusted(e);
    const url = crash.issueUrl(REPO_URL, "Crash report: FocusDesk 96 " + app.getVersion());
    await shell.openExternal(url); // only ever the project's own issue page, and nothing is sent until the person presses Submit there
    return { ok: true };
  });
  ipcMain.handle("focusdesk:logCrash", (e, p) => {
    assertTrusted(e);
    if (!p || typeof p !== "object" || ++pageErrors > 20) return { ok: false };
    crash.record("page-error", typeof p.message === "string" ? p.message.slice(0, 600) : "", typeof p.stack === "string" ? p.stack.slice(0, 2000) : "");
    return { ok: true };
  });
  ipcMain.handle("focusdesk:openBackupDir", async (e) => {
    assertTrusted(e);
    await fsp.mkdir(backupDir(), { recursive: true }).catch(() => {});
    const err = await shell.openPath(backupDir());
    return { ok: !err, path: backupDir(), error: err || null };
  });

  ipcMain.on("focusdesk:timerStatus", (e, t) => {
    if (!trusted(e) || !t || typeof t !== "object") return;
    updateTrayTimer({ running: !!t.running, paused: !!t.paused, mode: t.mode === "focus" ? "focus" : "break", left: Number(t.left) || 0 });
  });

  ipcMain.on("focusdesk:captureDone", (e, r) => {
    if (trusted(e) && r && typeof r.msg === "string") notifyNative("FocusDesk 96", r.msg.slice(0, 200));
  });

  ipcMain.on("capture:cancel", (e) => {
    if (isCaptureSender(e)) captureWin.close();
  });
  ipcMain.on("capture:resize", (e, h) => {
    if (!isCaptureSender(e) || !captureWin || captureWin.isDestroyed()) return;
    h = Math.round(Number(h));
    if (Number.isFinite(h)) captureWin.setContentSize(560, Math.max(100, Math.min(260, h)));
  });
  ipcMain.on("capture:submit", async (e, p) => {
    if (!isCaptureSender(e)) return;
    const kind = p && p.kind;
    let text = p && typeof p.text === "string" ? p.text.trim().slice(0, 1200) : "";
    captureWin.close();
    if (kind === "card") {
      // the window sends {front, back}; each side is limited on its own
      let o = null;
      try {
        o = JSON.parse(text);
      } catch (_) {}
      const front = o && typeof o.front === "string" ? o.front.trim().slice(0, 500) : "";
      const back = o && typeof o.back === "string" ? o.back.trim().slice(0, 500) : "";
      if (!front) return;
      const wc2 = await whenMainReady();
      wc2.send("focusdesk:capture", { kind: "card", text: JSON.stringify({ front: front, back: back }) });
      return;
    }
    text = text.slice(0, 500);
    if (!text || ["task", "note", "reminder", "event", "ask"].indexOf(kind) < 0) return;
    if (kind === "ask") {
      openClipyChat(text);
      return;
    }
    const wc = await whenMainReady();
    wc.send("focusdesk:capture", { kind: kind, text: text });
  });
}

/* ---------------------------------------------------------------------------
 * Window + close flow
 * ------------------------------------------------------------------------- */
let mainWindow = null;
let isQuitting = false;

function loadWindowState() {
  const def = { width: 1280, height: 800 };
  try {
    const s = JSON.parse(fs.readFileSync(FILES.window, "utf8"));
    if (!isPlainObject(s)) return def;
    const out = { width: def.width, height: def.height, maximized: !!s.maximized, fullScreen: !!s.fullScreen };
    if (Number.isFinite(s.width) && Number.isFinite(s.height)) {
      out.width = Math.max(800, Math.round(s.width));
      out.height = Math.max(560, Math.round(s.height));
    }
    if (Number.isFinite(s.x) && Number.isFinite(s.y)) {
      // Only restore the position if the window would still be reachable on a connected display.
      const onScreen = screen.getAllDisplays().some((d) => {
        const a = d.workArea;
        return s.x + 100 < a.x + a.width && s.x + out.width - 100 > a.x && s.y >= a.y - 20 && s.y + 60 < a.y + a.height;
      });
      if (onScreen) {
        out.x = Math.round(s.x);
        out.y = Math.round(s.y);
      }
    }
    return out;
  } catch (_) {
    return def;
  }
}

function saveWindowState(win) {
  try {
    if (win.isDestroyed()) return;
    const b = win.getNormalBounds();
    atomicWriteSync(
      FILES.window,
      JSON.stringify({ x: b.x, y: b.y, width: b.width, height: b.height, maximized: win.isMaximized(), fullScreen: win.isFullScreen() }, null, 2)
    );
  } catch (e) {
    console.error("[focusdesk] could not save window state:", e);
  }
}

function askRendererToFlush(win) {
  return new Promise((resolve) => {
    const wc = win.webContents;
    if (wc.isDestroyed() || wc.isCrashed()) return resolve();
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      ipcMain.removeListener("focusdesk:flushed", onAck);
      resolve();
    };
    const onAck = (ev) => {
      if (ev.sender === wc) finish();
    };
    const timer = setTimeout(finish, 2000); // never let a hung renderer block quitting
    ipcMain.on("focusdesk:flushed", onAck);
    try {
      wc.send("focusdesk:flush");
    } catch (_) {
      finish();
    }
  });
}

/* ---- automatic updates (Windows and Linux). A Mac always uses the notify-and-download notice, because Apple signing isn't paid for. ----
   If anything goes wrong, the app falls back to that notice, so a broken update can never leave anyone stuck. */
let updater = null;
let updState = { phase: "idle" };
let installingUpdate = false;
let quitFlushed = false;
function sendUpdate(st) {
  updState = st;
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send("focusdesk:update", st);
}
function setupUpdater() {
  if (process.platform !== "win32" && process.platform !== "linux") return;
  if (!app.isPackaged && !process.env.FD_TEST_UPDATER) return; // a development run doesn't update itself
  try {
    updater = require("electron-updater").autoUpdater;
  } catch (e) {
    logLine("automatic updates unavailable: " + String((e && e.message) || e).slice(0, 150));
    updater = null;
    return;
  }
  updater.autoDownload = false;
  updater.autoInstallOnAppQuit = false;
  updater.allowPrerelease = false;
  updater.allowDowngrade = false;
  if (process.env.FD_TEST_UPDATER === "real") updater.forceDevUpdateConfig = true;
  updater.on("update-available", (info) => {
    sendUpdate({ phase: "available", version: String((info && info.version) || ""), tags: tagsFromName(info && info.releaseName) });
    if (dprefs.updateMode === "auto") startUpdateDownload();
  });
  updater.on("update-not-available", () => sendUpdate({ phase: "none" }));
  updater.on("download-progress", (p) => sendUpdate({ phase: "progress", version: updState.version || "", tags: updState.tags || [], percent: Math.max(0, Math.min(100, Math.round((p && p.percent) || 0))) }));
  updater.on("update-downloaded", (info) => {
    if (dprefs.updateMode === "auto") updater.autoInstallOnAppQuit = true; // installs when FocusDesk is closed
    sendUpdate({ phase: "ready", version: String((info && info.version) || ""), tags: tagsFromName(info && info.releaseName), auto: dprefs.updateMode === "auto" });
  });
  updater.on("error", (err) => {
    const msg = String((err && err.message) || err).replace(/\s+/g, " ").slice(0, 200);
    logLine("update problem: " + msg);
    sendUpdate({ phase: "error", message: msg });
  });
}
function startUpdateDownload() {
  if (updater) updater.downloadUpdate().catch(() => {}); // problems arrive as an "error" event
}
function checkForUpdate() {
  if (!updater) return false;
  Promise.resolve(updater.checkForUpdates()).catch(() => {});
  return true;
}
function updateTick() {
  if (updater && dprefs.updateMode !== "notify" && ["checking", "progress", "ready"].indexOf(updState.phase) < 0) checkForUpdate();
}

/* ---- where each popped-out app was last: size and position, kept between runs ---- */
function rememberPopout(win, id) {
  if (!win || win.isDestroyed()) return;
  const b = win.getNormalBounds();
  dprefs.popoutBounds = Object.assign({}, dprefs.popoutBounds, { [id]: { x: b.x, y: b.y, width: b.width, height: b.height, max: win.isMaximized() } });
  atomicWrite(FILES.desktop, JSON.stringify(dprefs, null, 2)).catch(() => {});
}

/* ---- pop-out windows: an app in its own real window (same data, kept in step with the main window) ---- */
const popouts = new Set();
// the apps that can be popped out, with their names (checked against the app by scripts/check-menu-apps.js)
const POPOUT_MENU = [
  ["planner", "Assignment Planner"],
  ["calc", "Calculator"],
  ["calendar", "Calendar"],
  ["cite", "Citation Maker"],
  ["schedule", "Class Schedule"],
  ["dict", "Dictionary / Thesaurus"],
  ["equation", "Equation Solver"],
  ["links", "Favorites"],
  ["find", "Find"],
  ["cards", "Flash Cards"],
  ["folders", "Folders"],
  ["formula", "Formula Sheet"],
  ["grades", "Grade Calculator"],
  ["habits", "Habit Tracker"],
  ["grapher", "Math Grapher"],
  ["notepad", "Notepad"],
  ["periodic", "Periodic Table"],
  ["reminders", "Reminders"],
  ["research", "Research"],
  ["paint", "Sketch Pad"],
  ["tasks", "Tasks"],
  ["convert", "Unit Converter"],
  ["weekly", "Weekly Review"],
];
const POPOUT_APPS = POPOUT_MENU.map((x) => x[0]);
function openPopout(id, near) {
  if (POPOUT_APPS.indexOf(id) < 0) return { ok: false };
  for (const p of popouts) if (!p.isDestroyed() && p.__appId === id) {
    if (p.isMinimized()) p.restore();
    p.show();
    p.focus();
    return { ok: true, existing: true };
  }
  const iconPath = path.join(__dirname, "build", "icon.png");
  const at = near && !near.isDestroyed() ? near.getBounds() : null;
  let displays = [];
  try {
    displays = screen.getAllDisplays();
  } catch (_) {}
  const pl = placePopout(dprefs.popoutBounds && dprefs.popoutBounds[id], at, displays, popouts.size);
  const win = new BrowserWindow({
    width: pl.width,
    height: pl.height,
    x: pl.x,
    y: pl.y,
    minWidth: 420,
    minHeight: 320,
    show: false,
    backgroundColor: "#c0c0c0",
    title: APP_TITLE,
    autoHideMenuBar: true,
    // Windows with the slim title bar: the same merged title bar as the main window (otherwise there would be two)
    ...(process.platform === "win32" && compactActive ? { titleBarStyle: "hidden", titleBarOverlay: { color: "#000080", symbolColor: "#ffffff", height: 32 } } : {}),
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.__appId = id;
  popouts.add(win);
  try {
    // a second time, now that the window exists: on Windows with screens of different scaling, the size given at creation can come out wrong
    win.setBounds({ x: pl.x, y: pl.y, width: pl.width, height: pl.height });
  } catch (_) {}
  let rememberT = null,
    shown = false; // nothing is remembered until the window is really on screen (so the setting-up moves aren't saved as if the person chose them)
  const remember = () => {
    if (!shown) return;
    clearTimeout(rememberT);
    rememberT = setTimeout(() => rememberPopout(win, id), 700);
  };
  win.on("resize", remember);
  win.on("move", remember);
  win.on("close", () => {
    clearTimeout(rememberT);
    if (shown) rememberPopout(win, id);
  });
  win.setMenuBarVisibility(false);
  const showNow = () => {
    if (win.isDestroyed() || shown) return;
    if (pl.max) win.maximize(); // maximize when it is shown (doing it before can be ignored on Windows)
    win.show();
    shown = true;
    settle();
  };
  /* A pop-out loads while its window is still hidden, and then appears at its final size without any "resize" ever happening,
     so the app inside never re-measures itself and sits at the wrong size until you drag a corner. Once the window is really
     on screen, put it at its size once more and tell the page to re-measure (a few times, as a Mac can take a moment). */
  const settle = () => {
    [60, 300, 900].forEach((ms, i) =>
      setTimeout(() => {
        if (win.isDestroyed()) return;
        try {
          if (!win.isMaximized() && !win.isFullScreen() && !win.isMinimized()) {
            win.setBounds({ x: pl.x, y: pl.y, width: pl.width, height: pl.height });
            if (process.platform === "darwin" && i === 0) {
              // the same small nudge dragging a corner gives: one pixel wider and straight back
              win.setSize(pl.width + 1, pl.height);
              setTimeout(() => {
                if (!win.isDestroyed() && !win.isMaximized() && !win.isFullScreen()) win.setSize(pl.width, pl.height);
              }, 40);
            }
          }
          win.webContents.executeJavaScript("window.dispatchEvent(new Event('resize'))").catch(() => {});
        } catch (_) {}
      }, ms)
    );
  };
  win.once("ready-to-show", showNow);
  const showT = setTimeout(showNow, 6000); // if the page is slow to say it is ready, the window still appears
  win.on("closed", () => {
    clearTimeout(showT);
    popouts.delete(win);
  });
  let retried = false;
  win.webContents.on("did-fail-load", (ev, code, desc, url, isMain) => {
    // a page that fails to load (not a cancelled navigation) is tried once more instead of leaving an empty window
    if (isMain && !retried && code !== -3) {
      retried = true;
      setTimeout(() => {
        if (!win.isDestroyed()) win.loadFile(INDEX_FILE, { query: { popout: id } });
      }, 400);
    }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (ev, url) => {
    if (!isAppUrl(url)) {
      ev.preventDefault();
      if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    }
  });
  win.loadFile(INDEX_FILE, { query: { popout: id } });
  return { ok: true };
}
/* when one window saves, the other FocusDesk windows get the new data */
function broadcastExternal(sender, data) {
  const all = [mainWindow, ...popouts].filter((w) => w && !w.isDestroyed());
  if (all.length < 2) return;
  for (const w of all) if (w.webContents !== sender) w.webContents.send("focusdesk:external", data);
}
function createWindow(hidden) {
  const st = loadWindowState();
  const keepHidden = !!hidden || (firstWindow && launchedHidden());
  firstWindow = false;
  // Windows only: the menu moves into a ⋯ button in a slim custom title bar (opt-in, applies on restart).
  const compact = (process.platform === "win32" && dprefs.slimTitle) || process.env.FD_TEST_TITLEBAR === "1";
  compactActive = compact;
  const iconPath = path.join(__dirname, "build", "icon.png");
  const win = new BrowserWindow({
    width: st.width,
    height: st.height,
    x: st.x,
    y: st.y,
    minWidth: 800,
    minHeight: 560,
    show: false,
    backgroundColor: "#008080",
    title: APP_TITLE,
    ...(process.platform === "win32" && compact
      ? { titleBarStyle: "hidden", titleBarOverlay: { color: "#000080", symbolColor: "#ffffff", height: 32 } }
      : {}),
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  mainWindow = win;
  win.on("unresponsive", () => crash.record("unresponsive", "the main window stopped responding"));
  win.on("closed", () => {
    for (const p of [...popouts]) if (!p.isDestroyed()) p.close(); // pop-outs belong to this window
  });
  if (compact) win.setMenuBarVisibility(false);
  win.on("enter-full-screen", () => win.webContents.send("focusdesk:fs", true));
  win.on("leave-full-screen", () => win.webContents.send("focusdesk:fs", false));
  if (st.maximized) win.maximize();
  // full screen is never restored at launch: it left some people stuck in it
  win.webContents.on("before-input-event", (ev, input) => {
    // F11 is handled here, once, so the menu and the page can't both toggle it
    if (input.type === "keyDown" && input.key === "F11" && !input.alt && !input.control && !input.meta) {
      ev.preventDefault();
      win.setFullScreen(!win.isFullScreen());
    }
  });
  win.once("ready-to-show", () => {
    if (!keepHidden) win.show();
  });

  // Links open in the real browser; the app window itself never navigates away.
  win.webContents.setWindowOpenHandler(({ url, frameName }) => {
    if (frameName === "focusdesk-clipy") {
      // Bottom-right of the screen FocusDesk is on, like Clipy's spot in the app itself.
      const wa = screen.getDisplayMatching(win.isDestroyed() ? screen.getPrimaryDisplay().bounds : win.getBounds()).workArea;
      const cw = 400,
        ch = Math.min(580, wa.height - 32);
      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          x: wa.x + wa.width - cw - 16,
          y: wa.y + wa.height - ch - 16,
          width: cw,
          height: ch,
          minWidth: 320,
          minHeight: 380,
          alwaysOnTop: true,
          title: "Clipy",
          icon: path.join(__dirname, "assets", "clipy.png"),
          backgroundColor: "#c0c0c0",
          autoHideMenuBar: true,
          fullscreenable: false,
        },
      };
    }
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("did-create-window", (child) => {
    child.setAlwaysOnTop(true, "floating");
    child.setMenuBarVisibility(false);
    child.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    child.webContents.on("will-navigate", (ev) => ev.preventDefault());
  });
  win.webContents.on("will-navigate", (ev, url) => {
    if (isAppUrl(url)) return;
    ev.preventDefault();
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
  });

  let closing = false;
  let readyToClose = false;
  win.on("close", (ev) => {
    saveWindowState(win);
    if (readyToClose) return;
    if (dprefs.closeToTray && tray && !isQuitting) {
      ev.preventDefault();
      win.hide(); // keep running in the tray / menu bar
      return;
    }
    ev.preventDefault();
    if (closing) return;
    closing = true;
    askRendererToFlush(win)
      .then(() => flushDirty())
      .catch(() => {})
      .then(() => {
        readyToClose = true;
        if (!win.isDestroyed()) win.close();
        if (isQuitting) app.quit();
      });
  });
  win.on("closed", () => {
    if (mainWindow === win) mainWindow = null;
  });

  win.loadFile(INDEX_FILE);
  return win;
}

/* ---------------------------------------------------------------------------
 * Menu
 * ------------------------------------------------------------------------- */
function showAbout() {
  const parent = BrowserWindow.getFocusedWindow() || mainWindow || undefined;
  dialog
    .showMessageBox(parent, {
      type: "info",
      title: "About " + APP_TITLE,
      message: APP_TITLE,
      detail: "Desktop Edition " + app.getVersion() + "\nPublisher: " + PUBLISHER + "\n\nStudy. Focus. Repeat.\n\n" + REPO_URL,
      buttons: ["OK", "Open GitHub Repository"],
      defaultId: 0,
      cancelId: 0,
      noLink: true,
    })
    .then((r) => {
      if (r.response === 1) shell.openExternal(REPO_URL);
    });
}

function buildMenu() {
  const isMac = process.platform === "darwin";
  const go = (id) => () => sendCmd("open:" + id, true);
  const template = [];
  if (isMac) {
    template.push({
      label: APP_TITLE,
      submenu: [
        { label: "About " + APP_TITLE, click: showAbout },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    });
  }
  template.push({
    label: "File",
    submenu: [
      { label: "New Note", accelerator: "CmdOrCtrl+N", click: () => sendCmd("new-note", true) },
      { label: "New Task\u2026", click: () => openCapture("task") },
      { label: "Quick Capture\u2026", click: () => openCapture("task") },
      { label: "New Flash Card from Clipboard\u2026", click: () => openCapture("card") },
      { label: "Ask Clipy\u2026", click: () => openClipyChat("") },
      { label: "Pop Out App", submenu: POPOUT_MENU.map(([id, title]) => ({ label: title, click: () => sendCmd("popout:" + id, false) })) },
      { type: "separator" },
      { label: "Save Backup Now", click: () => sendCmd("backup-now", true) },
      { label: "Open Backups Folder", click: () => shell.openPath(backupDir()) },
      { type: "separator" },
      isMac ? { role: "close" } : { role: "quit" },
    ],
  });
  template.push({
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "selectAll" },
      { type: "separator" },
      { label: "Find\u2026", accelerator: "CmdOrCtrl+F", click: go("find") },
    ],
  });
  template.push({
    label: "Go",
    submenu: [
      { label: "Today", click: go("today") },
      { label: "Calendar", click: go("calendar") },
      { label: "Tasks", click: go("tasks") },
      { label: "Notepad", click: go("notepad") },
      { label: "Flash Cards", click: go("cards") },
      { label: "Focus Timer", click: go("timer") },
      { label: "Habit Tracker", click: go("habits") },
      { label: "Habit Breaker", click: go("breaker") },
      { label: "Study Stats", click: go("stats") },
      { label: "Achievements", click: go("achievements") },
      { type: "separator" },
      { label: "Control Panel", click: go("control") },
    ],
  });
  template.push({
    label: "Timer",
    submenu: [
      { label: "Start / Pause", accelerator: "CmdOrCtrl+Shift+T", click: () => sendCmd("timer-toggle") },
      { label: "Reset", click: () => sendCmd("timer-reset") },
      { type: "separator" },
      { label: "Mini Timer", click: openMiniTimer },
      { label: "Now Playing", click: openNowPlaying },
    ],
  });
  template.push({
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom", label: "Actual Size" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  });
  if (isMac) template.push({ role: "windowMenu" });
  template.push({
    role: "help",
    submenu: [
      { label: "About " + APP_TITLE, click: showAbout },
      { label: "Check for Updates", click: () => sendCmd("check-updates", true) },
      { type: "separator" },
      { label: "Documentation", click: () => shell.openExternal(REPO_URL) },
      { label: "Terms of Use", click: () => shell.openExternal(REPO_URL + "/blob/main/TERMS.md") },
      { label: "Report an Issue", click: () => shell.openExternal(REPO_URL + "/issues") },
    ],
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

/* ---------------------------------------------------------------------------
 * App lifecycle
 * ------------------------------------------------------------------------- */
if (!app.requestSingleInstanceLock()) {
  // A second copy would fight the first over the same files.
  app.quit();
} else {
  app.on("second-instance", (e, argv) => {
    const q = quickFromArgs(argv);
    if (q) runQuick(q);
    else showMainWindow();
  });
  app.on("before-quit", () => {
    isQuitting = true;
  });
  app.on("quit", () => {
    try {
      fs.rmSync(RUNNING_FLAG, { force: true }); // a normal close: the next start knows nothing went wrong
    } catch (_) {}
  });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  app.on("activate", () => {
    if (app.isReady()) showMainWindow();
  });
  app.on("will-quit", (e) => {
    globalShortcut.unregisterAll();
    // The page's last save can land just as the final window closes: let it finish.
    if (!quitFlushed && !installingUpdate) {
      e.preventDefault();
      // save everything, then quit again the normal way (so an update waiting to install gets its turn)
      flushDirty().catch(() => {}).then(() => mirrorLatest(true)).catch(() => {}).then(() => backupNow()).catch(() => {}).then(() => {
        quitFlushed = true;
        app.quit();
      });
    }
  });

  app
    .whenReady()
    .then(async () => {
      try {
        await loadAll();
      } catch (e) {
        dialog.showErrorBox(
          "FocusDesk 96 can't open its data folder",
          "Folder: " + DATA_DIR + "\n\n" + ((e && e.message) || e) + "\n\nCheck that the folder exists and that you can write to it."
        );
        app.exit(1);
        return;
      }
      try {
        if (fs.existsSync(RUNNING_FLAG)) crash.record("unclean-exit", "FocusDesk didn't close normally last time (it may have crashed, been force-quit, or lost power)");
        fs.writeFileSync(RUNNING_FLAG, String(Date.now()));
      } catch (_) {}
      registerIpc();
      registerDesktopIpc();
      setInterval(backupTick, 10 * 60 * 1000).unref(); // keeps today's backup current (and starts a new day's file if the app stays open past midnight)
      buildMenu();
      applyDesktopPrefs();
      createWindow();
      setupUpdater();
      setTimeout(updateTick, 25000);
      setInterval(updateTick, 12 * 3600000);
      if (process.platform === "win32" && app.isPackaged) {
        // the menu you get by right-clicking the taskbar icon
        const task = (arg, title, description) => ({ program: process.execPath, arguments: "--quick=" + arg, title: title, description: description, iconPath: process.execPath, iconIndex: 0 });
        try {
          app.setUserTasks([
            task("task", "Add a quick task", "Open quick capture"),
            task("card", "New flash card from the clipboard", "Turn what you copied into a card"),
            task("askclipy", "Ask Clipy", "Open Clipy and ask a question"),
            task("timer", "Start or pause the focus timer", "Control the focus timer"),
            task("minitimer", "Show the mini timer", "Show the small floating timer"),
            task("nowplaying", "Open Now Playing", "Show what is playing"),
          ]);
        } catch (_) {}
      }
      const first = quickFromArgs(process.argv);
      if (first) setTimeout(() => runQuick(first), 2000);
    })
    .catch((e) => {
      console.error(e);
      app.exit(1);
    });
}
