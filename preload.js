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
