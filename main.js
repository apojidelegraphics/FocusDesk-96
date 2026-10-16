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

const { app, BrowserWindow, Menu, dialog, ipcMain, shell, screen } = require("electron");
const path = require("path");
const fs = require("fs");
const fsp = fs.promises;
const { fileURLToPath } = require("url");

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
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const MIGRATE_DIR = path.join(DATA_DIR, "migrate");
const FILES = {
  data: path.join(DATA_DIR, "data.json"),
  wall: path.join(DATA_DIR, "wall.json"),
  settings: path.join(DATA_DIR, "settings.json"),
  keys: path.join(DATA_DIR, "keys.json"),
  window: path.join(DATA_DIR, "window-state.json"),
};
const INDEX_FILE = path.join(__dirname, "index.html");
const KEEP_BACKUPS = 7;
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
/** Writes everything that is dirty. Calls are serialized; resolves once disk is current. */
function flushDirty() {
  const run = async () => {
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
/** If the newest daily backup is older than today, copy data.json to backups/YYYY-MM-DD.json. Keep 7. */
async function ensureDailyBackup() {
  const today = ymd(new Date());
  if (backupCheckedFor === today) return;
  backupCheckedFor = today; // one attempt per calendar day, success or not
  try {
    await fsp.mkdir(BACKUP_DIR, { recursive: true });
    const list = async () =>
      (await fsp.readdir(BACKUP_DIR)).filter((n) => /^\d{4}-\d{2}-\d{2}\.json$/.test(n)).sort();
    let names = await list();
    const latest = names[names.length - 1];
    if (!latest || latest.slice(0, 10) < today) {
      let raw = null;
      try {
        raw = await fsp.readFile(FILES.data);
      } catch (e) {
        if (e.code !== "ENOENT") throw e;
      }
      if (raw) await atomicWrite(path.join(BACKUP_DIR, today + ".json"), raw);
    }
    names = await list();
    while (names.length > KEEP_BACKUPS) await fsp.unlink(path.join(BACKUP_DIR, names.shift())).catch(() => {});
  } catch (e) {
    console.error("[focusdesk] daily backup failed:", e);
  }
}

/** Remove half-written temp files left behind by a crash or power cut (single-instance, so none are live). */
async function cleanStaleTemps() {
  for (const dir of [DATA_DIR, BACKUP_DIR, MIGRATE_DIR]) {
    let names = [];
    try {
      names = await fsp.readdir(dir);
    } catch (_) {}
    for (const n of names) if (/\.\d+(\.\d+)?\.tmp$/.test(n)) await fsp.unlink(path.join(dir, n)).catch(() => {});
  }
}

async function loadAll() {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  await fsp.mkdir(BACKUP_DIR, { recursive: true });
  await fsp.mkdir(MIGRATE_DIR, { recursive: true });
  await cleanStaleTemps();
  bootCorrupt = [];
  mem.data = await loadJson(FILES.data, isPlainObject);
  const wall = await loadJson(FILES.wall, isPlainObject);
  mem.wall = wall && typeof wall.dataUrl === "string" && wall.dataUrl ? wall.dataUrl : null;
  mem.settings = cleanStringMap(await loadJson(FILES.settings, isPlainObject));
  mem.keys = cleanStringMap(await loadJson(FILES.keys, isPlainObject));
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
    dirs: { data: DATA_DIR, backups: BACKUP_DIR, migrate: MIGRATE_DIR },
    platform: process.platform,
    appVersion: app.getVersion(),
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

function createWindow() {
  const st = loadWindowState();
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
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  mainWindow = win;
  if (st.maximized) win.maximize();
  if (st.fullScreen) win.setFullScreen(true);
  win.once("ready-to-show", () => win.show());

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
      { label: "Open Backups Folder", click: () => shell.openPath(DATA_DIR) },
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
      { label: "Documentation", click: () => shell.openExternal(REPO_URL) },
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
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });
  app.on("before-quit", () => {
    isQuitting = true;
  });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  app.on("activate", () => {
    if (app.isReady() && BrowserWindow.getAllWindows().length === 0) createWindow();
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
      buildMenu();
      createWindow();
    })
    .catch((e) => {
      console.error(e);
      app.exit(1);
    });
}
