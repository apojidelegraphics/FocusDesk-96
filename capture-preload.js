"use strict";
/* Preload for the small Quick Capture window. Only three things cross the bridge. */
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("captureApi", {
  submit: (kind, text) => ipcRenderer.send("capture:submit", { kind, text }),
  cancel: () => ipcRenderer.send("capture:cancel"),
  onInit: (cb) => ipcRenderer.on("capture:init", (e, p) => cb(p)),
});
