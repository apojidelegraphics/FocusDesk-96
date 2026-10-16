/*
 * focusdesk-desk.js — desktop shim. Loaded BEFORE focusdesk.js (see index.html).
 *
 * focusdesk.js lives in one IIFE, so its functions can't be patched from outside.
 * Instead this file changes the world it runs in:
 *   1. Publishes the boot data (read synchronously by preload.js) for focusdesk.js.
 *   2. Replaces window.localStorage with a file-backed store (data.json, wall.json,
 *      settings.json, keys.json). Every localStorage call in the app now lands on disk.
 *   3. Provides window.claude.use("downloads"), which focusdesk.js's saveFile()
 *      already prefers, backed by native Save dialogs.
 *   4. Intercepts <input type="file"> clicks and opens native Open dialogs instead.
 *   5. Offers window.__focusdeskWrite(): the debounced, queued writer flush() calls.
 *
 * In a plain browser window.focusdesk doesn't exist and this file does nothing.
 */
(function () {
  "use strict";
  var fd = window.focusdesk;
  if (!fd || !fd.isDesktop) return;

  window.__focusdeskIsDesktop = true;

  var init = fd.initial || {};
  var KEY = "focusdesk96.v1";
  var WALLKEY = KEY + ".wall";
  var KEYS_FILE_KEYS = { "focusdesk96.keys": 1, "focusdesk96.orkey": 1 };
  var MIN_GAP = 500; // at most one disk write per 500 ms

  /* ---------- 1. boot data for focusdesk.js ---------- */
  window.__focusdeskInitialData = init.data || null;
  window.__focusdeskInitialWall = init.wall || null;
  window.__focusdeskCorrupt = init.corrupt || [];
  window.__focusdeskDirs = init.dirs || {};
  if (window.__focusdeskCorrupt.length) {
    window.__focusdeskCorruptNote =
      "\n\nDamaged file(s): " +
      window.__focusdeskCorrupt
        .map(function (c) {
          return c.file + " (kept as " + c.movedTo + ")";
        })
        .join(", ") +
      "\nFolder: " +
      (window.__focusdeskDirs.data || "your FocusDesk 96 data folder") +
      "\nA daily backup may be in the backups folder inside it.";
  }

  /* ---------- 2. file-backed localStorage ---------- */
  var mem = Object.create(null);
  var latestData = init.data || null;
  var latestWall = init.wall || null;
  var dirty = {};
  var timer = null;
  var inflight = false;
  var lastSend = 0;
  var unloading = false;
  var outstanding = Promise.resolve();

  function classify(k) {
    if (k === KEY) return "data";
    if (k === WALLKEY) return "wall";
    if (KEYS_FILE_KEYS[k]) return "keys";
    // Per-session restore points: main.js writes real daily backups, and these would
    // only bloat the files (each one is a full copy of your data). Memory only.
    if (
      k === KEY + ".bak" ||
      k === KEY + ".baktime" ||
      k === KEY + ".corrupt" ||
      k === KEY + ".t" ||
      k.indexOf("focusdesk96.bak.daily.") === 0
    )
      return "ephemeral";
    return "settings";
  }

  // seed from the files main.js loaded
  var s0 = init.settings || {};
  Object.keys(s0).forEach(function (k) {
    if (typeof s0[k] === "string") mem[k] = s0[k];
  });
  var k0 = init.keys || {};
  Object.keys(k0).forEach(function (k) {
    if (typeof k0[k] === "string") mem[k] = k0[k];
  });
  if (init.data) mem[KEY] = "1"; // placeholder so the key enumerates; value is built on demand
  if (init.wall) mem[WALLKEY] = init.wall;

  function bucket(kind) {
    var o = {};
    Object.keys(mem).forEach(function (k) {
      if (classify(k) === kind) o[k] = mem[k];
    });
    return o;
  }
  function readItem(k) {
    if (k === KEY) {
      try {
        return latestData ? JSON.stringify(latestData) : null;
      } catch (e) {
        return null;
      }
    }
    return mem[k];
  }
  function put(k, v) {
    var kind = classify(k);
    if (kind === "data") {
      var obj = null;
      try {
        obj = JSON.parse(v);
      } catch (e) {}
      if (!obj || typeof obj !== "object" || Array.isArray(obj)) return;
      latestData = obj;
      mem[KEY] = "1";
      dirty.data = true;
      schedule();
      return;
    }
    mem[k] = v;
    if (kind === "wall") {
      latestWall = v || null;
      dirty.wall = true;
      schedule();
    } else if (kind !== "ephemeral") {
      dirty[kind] = true;
      schedule();
    }
  }
  function drop(k) {
    var kind = classify(k);
    if (kind === "data") return; // never delete the user's data through a stray removeItem
    delete mem[k];
    if (kind === "wall") {
      latestWall = null;
      dirty.wall = true;
      schedule();
    } else if (kind !== "ephemeral") {
      dirty[kind] = true;
      schedule();
    }
  }

  var methods = {
    getItem: function (k) {
      k = String(k);
      return k in mem ? readItem(k) : null;
    },
    setItem: function (k, v) {
      put(String(k), String(v));
    },
    removeItem: function (k) {
      drop(String(k));
    },
    clear: function () {
      Object.keys(mem).forEach(drop);
    },
    key: function (i) {
      var ks = Object.keys(mem);
      return i >= 0 && i < ks.length ? ks[i] : null;
    },
    hasOwnProperty: function (k) {
      return Object.prototype.hasOwnProperty.call(mem, k);
    },
  };
  var store = new Proxy(mem, {
    get: function (t, p) {
      if (typeof p === "symbol") return undefined;
      if (p === "length") return Object.keys(t).length;
      if (Object.prototype.hasOwnProperty.call(methods, p)) return methods[p];
      return p in t ? readItem(p) : undefined;
    },
    set: function (t, p, v) {
      if (typeof p !== "symbol") put(p, String(v));
      return true;
    },
    deleteProperty: function (t, p) {
      if (typeof p !== "symbol") drop(p);
      return true;
    },
  });
  try {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      enumerable: true,
      get: function () {
        return store;
      },
    });
  } catch (e) {
    console.error("[focusdesk] could not install file-backed storage:", e);
  }

  /* ---------- 5. debounced, queued writer ---------- */
  function setWarn(failed) {
    var w = document.getElementById("saveWarn");
    if (!w) return;
    w.hidden = !failed;
    if (failed) w.title = "Couldn't write to disk — changes are NOT being saved.";
  }
  function hasDirty() {
    for (var k in dirty) if (dirty[k]) return true;
    return false;
  }
  function schedule() {
    if (unloading) {
      send(true);
      return;
    }
    if (timer) return;
    timer = setTimeout(function () {
      send(false);
    }, MIN_GAP);
  }
  function send(force) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (inflight && !force) return; // the completion handler re-schedules
    var d = dirty;
    dirty = {};
    var jobs = [];
    if (d.data || d.wall) jobs.push(fd.write(d.data ? latestData : undefined, d.wall ? latestWall : undefined));
    if (d.settings || d.keys)
      jobs.push(fd.writeSettings(d.settings ? bucket("settings") : undefined, d.keys ? bucket("keys") : undefined));
    if (!jobs.length) return;
    inflight = true;
    lastSend = Date.now();
    var job = Promise.all(jobs).then(
      function (rs) {
        setWarn(rs.some(function (r) {
          return r && r.ok === false;
        }));
      },
      function () {
        setWarn(true);
      }
    );
    outstanding = Promise.all([outstanding, job]);
    job.then(function () {
      inflight = false;
      if (hasDirty()) schedule();
    });
  }

  // flush() in focusdesk.js calls this instead of localStorage.setItem(KEY, ...)
  window.__focusdeskWrite = function (data, wall) {
    latestData = data;
    mem[KEY] = "1";
    dirty.data = true;
    if (wall !== undefined) {
      wall = wall || null;
      if (wall !== latestWall) {
        latestWall = wall;
        if (wall) mem[WALLKEY] = wall;
        else delete mem[WALLKEY];
        dirty.wall = true;
      }
    }
    schedule();
  };

  // Page is going away (close, reload, Shut Down): bypass the debounce.
  // Capture phase + registered first, so this runs before focusdesk.js's own pagehide flush().
  window.addEventListener(
    "pagehide",
    function () {
      unloading = true;
      send(true);
    },
    true
  );
  // Main asks us to flush before the window closes, then waits for flushDone().
  fd.onFlushRequest(function () {
    unloading = true;
    try {
      if (typeof window.__focusdeskFlush === "function") window.__focusdeskFlush();
    } catch (e) {}
    send(true);
    outstanding.then(
      function () {
        unloading = false;
        fd.flushDone();
      },
      function () {
        unloading = false;
        fd.flushDone();
      }
    );
  });

  /* ---------- 3. downloads: window.claude.use("downloads") ---------- */
  function toPayload(data) {
    if (typeof data === "string") return Promise.resolve(data);
    if (typeof Blob !== "undefined" && data instanceof Blob)
      return data.arrayBuffer().then(function (b) {
        return new Uint8Array(b);
      });
    if (data instanceof ArrayBuffer) return Promise.resolve(new Uint8Array(data));
    if (ArrayBuffer.isView(data)) return Promise.resolve(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
    return Promise.resolve(String(data));
  }
  function desktopSave(opts) {
    var name = String((opts && opts.filename) || "file");
    var extra = {};
    // Migrate exports are archived in <data folder>/migrate/ AND offered via Save As.
    if (/^focusdesk96-migrate-/i.test(name)) extra.archive = "migrate";
    return toPayload(opts && opts.data)
      .then(function (payload) {
        return fd.saveFile(name, payload, extra);
      })
      .then(
        function (res) {
          if (res && res.canceled) {
            var c = new Error("Save cancelled");
            c.code = "declined"; // focusdesk.js treats this as a silent cancel
            throw c;
          }
          return res;
        },
        function (err) {
          var e = new Error((err && err.message) || "Couldn't save the file.");
          e.code = "error";
          throw e;
        }
      );
  }
  window.claude = window.claude || {};
  window.claude.use = function (name) {
    if (name === "downloads") return Promise.resolve({ save: desktopSave });
    return Promise.resolve(null); // e.g. "sample": the app falls back to its own AI providers
  };

  /* ---------- 4. native file pickers ---------- */
  function guessDir(accept, hint) {
    if (hint) return hint; // data-pick="migrate" is set on the Migrate import button
    if (/image/i.test(accept)) return "pictures";
    return "downloads"; // backups, .ics calendars, templates
  }
  function b64ToBytes(b64) {
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function toFile(f) {
    var body = f.encoding === "utf8" ? f.content : b64ToBytes(f.content);
    return new File([body], f.name, { type: f.type || "" });
  }
  function pick(input) {
    var accept = input.getAttribute("accept") || "";
    var hint = input.getAttribute("data-pick") || "";
    fd.openFile(accept, { multiple: !!input.multiple, defaultDir: guessDir(accept, hint) }).then(
      function (res) {
        if (!res || res.canceled || !res.files || !res.files.length) return;
        var dt = new DataTransfer();
        res.files.forEach(function (f) {
          dt.items.add(toFile(f));
        });
        input.files = dt.files;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      },
      function (err) {
        console.error("[focusdesk] open file failed:", err);
      }
    );
  }
  var origClick = HTMLInputElement.prototype.click;
  HTMLInputElement.prototype.click = function () {
    if (this.type === "file") {
      pick(this);
      return;
    }
    return origClick.apply(this, arguments);
  };
  document.addEventListener(
    "click",
    function (e) {
      var t = e.target;
      if (t && t.tagName === "INPUT" && t.type === "file") {
        e.preventDefault();
        pick(t);
      }
    },
    true
  );
})();
