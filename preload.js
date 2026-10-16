"use strict";
/*
 * Exposes the narrow window.focusdesk API. This is the ONLY thing the page can use
 * to reach the disk — there is no fs, no require, no Node in the renderer.
 */
const { contextBridge, ipcRenderer } = require("electron");

// Synchronous read at load time: focusdesk.js boots synchronously and needs its
// data before its first line runs. Result is exposed as window.focusdesk.initial.
let initial = null;
try {
  initial = ipcRenderer.sendSync("focusdesk:readSync");
} catch (e) {
  initial = null;
}
if (!initial) initial = { data: null, wall: null, settings: {}, keys: {}, corrupt: [], dirs: {} };

contextBridge.exposeInMainWorld("focusdesk", {
  isDesktop: true,
  initial: initial,

  // async API (all return promises)
  read: () => ipcRenderer.invoke("focusdesk:readData"),
  write: (data, wall) => ipcRenderer.invoke("focusdesk:writeData", { data, wall }),
  writeSettings: (settings, keys) => ipcRenderer.invoke("focusdesk:writeSettings", { settings, keys }),
  saveFile: (name, contents, opts) =>
    ipcRenderer.invoke("focusdesk:saveFile", Object.assign({}, opts, { name, contents })),
  openFile: (accept, opts) => ipcRenderer.invoke("focusdesk:openFile", Object.assign({}, opts, { accept })),
  openBackupFolder: () => ipcRenderer.invoke("focusdesk:openBackupFolder"),

  // desktop 1.1: notifications, quick capture, tray, startup
  notify: (title, body) => ipcRenderer.invoke("focusdesk:notify", { title, body }),
  setDesktopPrefs: (p) => ipcRenderer.invoke("focusdesk:setDesktopPrefs", p),
  openCapture: (kind) => ipcRenderer.invoke("focusdesk:openCapture", { kind }),
  setTimerStatus: (t) => ipcRenderer.send("focusdesk:timerStatus", t),
  captureDone: (r) => ipcRenderer.send("focusdesk:captureDone", r),
  onCapture: (cb) => {
    ipcRenderer.on("focusdesk:capture", (e, p) => {
      try {
        cb(p);
      } catch (err) {}
    });
  },
  onCommand: (cb) => {
    ipcRenderer.on("focusdesk:cmd", (e, c) => {
      try {
        cb(c);
      } catch (err) {}
    });
  },

  // quit/close handshake: main asks the page to flush, the page answers when done
  onFlushRequest: (cb) => {
    ipcRenderer.on("focusdesk:flush", () => {
      try {
        cb();
      } catch (e) {}
    });
  },
  flushDone: () => ipcRenderer.send("focusdesk:flushed"),
});
