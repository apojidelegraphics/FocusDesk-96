"use strict";
/* Preload for the small helper windows (mini timer, Clipy chat). Strict allow-lists only. */
const { contextBridge, ipcRenderer } = require("electron");
const SEND = new Set(["mini:cmd", "np:cmd", "win:move"]);
const INVOKE = new Set([]);
const ON = new Set(["mini:status", "np:status"]);
contextBridge.exposeInMainWorld("auxApi", {
  send: (ch, p) => {
    if (SEND.has(ch)) ipcRenderer.send(ch, p);
  },
  invoke: (ch, p) => (INVOKE.has(ch) ? ipcRenderer.invoke(ch, p) : Promise.reject(new Error("blocked"))),
  on: (ch, cb) => {
    if (ON.has(ch)) ipcRenderer.on(ch, (e, p) => cb(p));
  },
});
