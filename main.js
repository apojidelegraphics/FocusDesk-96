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

const { app, BrowserWindow, Menu, dialog, ipcMain, shell, screen, globalShortcut, Tray, nativeImage, Notification } = require("electron");
const path = require("path");
const fs = require("fs");
const fsp = fs.promises;
const { fileURLToPath } = require("url");

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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
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

async function renameRetry(from, to) {
  for (let i = 0; ; i++) {
    try {
      return await fsp.rename(from, to);
    } catch (e) {
      // Windows can briefly refuse a rename while antivirus / Dropbox holds the file.
      if (i < 6 && (e.code === "EPERM" || e.code === "EBUSY" || e.code === "EACCES")) await sleep(50 * (i + 1));
      else throw e;
    }
  }
}

/** Atomic write: temp file in the same folder -> fsync -> rename over the target. */
async function atomicWrite(file, contents) {
  const tmp = file + "." + process.pid + "." + Date.now() + ".tmp";
  let fh = null;
  try {
    fh = await fsp.open(tmp, "w");
    await fh.writeFile(contents);
    await fh.sync();
    await fh.close();
    fh = null;
    await renameRetry(tmp, file);
  } catch (e) {
    if (fh) await fh.close().catch(() => {});
    await fsp.unlink(tmp).catch(() => {});
    throw e;
  }
}

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
      } catch (e) {
        dirty[kind] = true; // retry on the next flush
        console.error("[focusdesk] write failed:", kind, e);
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
/** If the newest daily backup is older than today, copy data.json to <backup folder>/YYYY-MM-DD.json, then prune. */
async function ensureDailyBackup() {
  const today = ymd(new Date());
  if (backupCheckedFor === today) return;
  backupCheckedFor = today; // one attempt per calendar day, success or not
  const keep = dprefs.backupKeep; // 0 = keep everything
  const attempt = async (dir) => {
    await fsp.mkdir(dir, { recursive: true });
    const list = async () => (await fsp.readdir(dir)).filter((n) => /^\d{4}-\d{2}-\d{2}\.json$/.test(n)).sort();
    let names = await list();
    const latest = names[names.length - 1];
    if (!latest || latest.slice(0, 10) < today) {
      let raw = null;
      try {
        raw = await fsp.readFile(FILES.data);
      } catch (e) {
        if (e.code !== "ENOENT") throw e;
      }
      if (raw) await atomicWrite(path.join(dir, today + ".json"), raw);
    }
    names = await list();
    if (keep > 0) while (names.length > keep) await fsp.unlink(path.join(dir, names.shift())).catch(() => {});
  };
  try {
    await attempt(backupDir());
    backupNote = "";
  } catch (e) {
    console.error("[focusdesk] daily backup failed:", e);
    if (dprefs.backupPath) {
      // e.g. an unplugged drive or a Dropbox folder that moved: fall back so today is still protected
      try {
        await attempt(BACKUP_DIR_DEFAULT);
        backupNote = "Couldn't reach your backup folder, so today's backup went to the default folder.";
      } catch (e2) {
        backupNote = "Couldn't write a backup today.";
      }
    }
  }
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
  dprefs = Object.assign({}, DEFAULT_DPREFS, cleanDprefs(await loadJson(FILES.desktop, isPlainObject)));
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
    platform: process.platform,
    appVersion: app.getVersion(),
    dprefs: dprefs,
    hotkeyOk: hotkeyOk,
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
    (e) => ({ ok: false, error: String((e && e.message) || e) })
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
    return applyWrite({ data: p && p.data, wall: p && p.wall });
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
  hotkey: true,
  closeToTray: false,
  launchAtLogin: false,
  startHidden: false,
  slimTitle: true, // Windows: menu behind a ⋯ button in a slim title bar. (Set false in desktop.json to turn off.)
  backupPath: "",
  backupKeep: 7,
};
let compactActive = false; // was the current window built with the slim title bar? (Windows only, set at creation)
const HOTKEY = "CommandOrControl+Shift+Space";
let dprefs = Object.assign({}, DEFAULT_DPREFS);
let tray = null;
let captureWin = null;
let hotkeyOk = false;
let firstWindow = true;

function cleanDprefs(p) {
  const out = {};
  if (p && typeof p === "object")
    for (const k of Object.keys(DEFAULT_DPREFS)) {
      if (typeof DEFAULT_DPREFS[k] === "boolean" && typeof p[k] === "boolean") out[k] = p[k];
    }
  if (p && typeof p.backupPath === "string" && p.backupPath.length < 1000 && path.isAbsolute(p.backupPath)) out.backupPath = p.backupPath;
  if (p && p.backupPath === "") out.backupPath = "";
  if (p && [0, 7, 14, 30].indexOf(p.backupKeep) >= 0) out.backupKeep = p.backupKeep;
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

function openCapture(kind) {
  if (captureWin && !captureWin.isDestroyed()) {
    captureWin.webContents.send("capture:init", { kind: kind });
    captureWin.show();
    captureWin.focus();
    return;
  }
  const a = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea;
  const w = 560,
    h = 126;
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
  win.webContents.once("did-finish-load", () => {
    win.webContents.send("capture:init", { kind: kind });
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

function registerHotkey() {
  try {
    globalShortcut.unregister(HOTKEY);
  } catch (_) {}
  hotkeyOk = false;
  if (!dprefs.hotkey) return;
  try {
    hotkeyOk = globalShortcut.register(HOTKEY, () => openCapture("task")) && globalShortcut.isRegistered(HOTKEY);
  } catch (_) {
    hotkeyOk = false;
  }
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

let due = { cards: 0, tasks: 0, badge: null };
let lastTimer = null;
let miniWin = null;
let clipyWin = null;

function sendCmd(cmd, show) {
  return whenMainReady().then((wc) => {
    if (show) showMainWindow();
    wc.send("focusdesk:cmd", cmd);
  });
}

function buildTrayMenu() {
  const total = due.cards + due.tasks;
  const items = [{ label: "Open FocusDesk 96", click: showMainWindow }, { type: "separator" }];
  // Due counts live inside the menu (not on the icon) so nothing nags until you click it.
  if (total > 0) {
    if (due.cards > 0) items.push({ label: due.cards + (due.cards === 1 ? " card" : " cards") + " due", click: () => sendCmd("open:cards", true) });
    if (due.tasks > 0) items.push({ label: due.tasks + (due.tasks === 1 ? " task" : " tasks") + " due today", click: () => sendCmd("open:tasks", true) });
  } else items.push({ label: "Nothing due right now", enabled: false });
  items.push(
    { type: "separator" },
    { label: "Start focus session", click: () => sendCmd("focus") },
    { label: "Mini timer", click: openMiniTimer },
    { label: "Add quick task\u2026", click: () => openCapture("task") },
    { label: "Ask Clipy\u2026", click: () => openClipyChat("") },
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
  const total = due.cards + due.tasks;
  try {
    if (process.platform === "win32" && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setOverlayIcon(total > 0 && due.badge ? nativeImage.createFromDataURL(due.badge) : null, total > 0 ? total + " due" : "");
    } else if (process.platform === "linux") app.setBadgeCount(total);
    // macOS: no dock badge on purpose; the counts are inside the menu bar menu.
  } catch (_) {}
}

function ensureTray() {
  if (tray) return;
  try {
    const img = nativeImage.createFromPath(path.join(__dirname, "assets", "tray.png"));
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
  const w = 236,
    h = 52;
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

/* ---- Ask Clipy: its own always-on-top chat window ---- */
const pendingAsks = new Map();
let askSeq = 0;
function openClipyChat(question) {
  if (clipyWin && !clipyWin.isDestroyed()) {
    clipyWin.show();
    clipyWin.focus();
    if (question) clipyWin.webContents.send("clipy:init", { question: question });
    return;
  }
  const a = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea;
  const w = 400,
    h = 540;
  const win = new BrowserWindow({
    width: w,
    height: h,
    x: Math.round(a.x + a.width - w - 40),
    y: Math.round(a.y + Math.max(20, (a.height - h) / 2)),
    minWidth: 320,
    minHeight: 360,
    alwaysOnTop: true,
    minimizable: true,
    maximizable: false,
    fullscreenable: false,
    show: false,
    backgroundColor: "#c0c0c0",
    title: "Clipy",
    icon: fs.existsSync(path.join(__dirname, "build", "icon.png")) ? path.join(__dirname, "build", "icon.png") : undefined,
    webPreferences: { preload: path.join(__dirname, "aux-preload.js"), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  clipyWin = win;
  win.setAlwaysOnTop(true, "floating");
  win.removeMenu();
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (ev) => ev.preventDefault());
  win.loadFile(path.join(__dirname, "clipy.html"));
  win.webContents.once("did-finish-load", () => {
    win.show();
    win.focus();
    if (question) win.webContents.send("clipy:init", { question: question });
  });
  win.on("closed", () => {
    if (clipyWin === win) clipyWin = null;
  });
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
    dprefs = Object.assign({}, dprefs, cleanDprefs(p));
    await atomicWrite(FILES.desktop, JSON.stringify(dprefs, null, 2));
    registerHotkey();
    ensureTray();
    if (p && p.backupKeep !== undefined) {
      backupCheckedFor = null;
      await ensureDailyBackup();
    }
    const login = applyLoginItem();
    return { ok: true, prefs: dprefs, hotkeyOk: hotkeyOk, trayOk: !!tray, login: login };
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
    openCapture(["task", "note", "reminder", "event", "ask"].indexOf(k) >= 0 ? k : "task");
    return { ok: true };
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
  ipcMain.handle("clipy:ask", async (e, p) => {
    if (!clipyWin || clipyWin.isDestroyed() || e.sender !== clipyWin.webContents) return { ok: false, text: "Not allowed." };
    const text = p && typeof p.text === "string" ? p.text.trim().slice(0, 2000) : "";
    if (!text) return { ok: false, text: "" };
    const wc = await whenMainReady();
    const id = ++askSeq;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        pendingAsks.delete(id);
        resolve({ ok: false, text: "Clipy took too long to answer. Try again." });
      }, 90000);
      pendingAsks.set(id, (r) => {
        clearTimeout(timer);
        resolve(r);
      });
      wc.send("focusdesk:ask", { id: id, text: text });
    });
  });
  ipcMain.on("focusdesk:askReply", (e, r) => {
    if (!trusted(e) || !r) return;
    const done = pendingAsks.get(r.id);
    if (!done) return;
    pendingAsks.delete(r.id);
    done({ ok: !!r.ok, text: String(r.text || "").slice(0, 20000) });
  });

  ipcMain.on("focusdesk:dueCounts", (e, d) => {
    if (!trusted(e) || !d) return;
    const n = (v) => Math.max(0, Math.min(9999, Math.floor(Number(v) || 0)));
    due = {
      cards: n(d.cards),
      tasks: n(d.tasks),
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
    return { ok: true, path: dir, prefs: dprefs, note: backupNote };
  });
  ipcMain.handle("focusdesk:resetBackupFolder", async (e) => {
    assertTrusted(e);
    dprefs = Object.assign({}, dprefs, { backupPath: "" });
    await atomicWrite(FILES.desktop, JSON.stringify(dprefs, null, 2));
    backupCheckedFor = null;
    await ensureDailyBackup();
    return { ok: true, path: backupDir(), prefs: dprefs };
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
  ipcMain.on("capture:submit", async (e, p) => {
    if (!isCaptureSender(e)) return;
    const kind = p && p.kind;
    const text = p && typeof p.text === "string" ? p.text.trim().slice(0, 500) : "";
    captureWin.close();
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
  if (compact) win.setMenuBarVisibility(false);
  win.on("enter-full-screen", () => win.webContents.send("focusdesk:fs", true));
  win.on("leave-full-screen", () => win.webContents.send("focusdesk:fs", false));
  if (st.maximized) win.maximize();
  if (st.fullScreen) win.setFullScreen(true);
  win.once("ready-to-show", () => {
    if (!keepHidden) win.show();
  });

  // Links open in the real browser; the app window itself never navigates away.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: "deny" };
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
      { label: "Ask Clipy\u2026", click: () => openClipyChat("") },
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
  app.on("second-instance", () => {
    showMainWindow();
  });
  app.on("before-quit", () => {
    isQuitting = true;
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
    if (writing > 0 || Object.keys(dirty).some((k) => dirty[k])) {
      e.preventDefault();
      flushDirty().catch(() => {}).then(() => app.exit(0));
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
      registerIpc();
      registerDesktopIpc();
      buildMenu();
      applyDesktopPrefs();
      createWindow();
    })
    .catch((e) => {
      console.error(e);
      app.exit(1);
    });
}
