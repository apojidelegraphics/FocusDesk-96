"use strict";
/*
 * Automatic backups for the desktop app, kept apart from main.js so they can be tested on their own.
 *
 *  - There is one dated file per day (YYYY-MM-DD.json) in the backup folder. Today's file is kept CURRENT: it is made the first
 *    time the app runs on a new day, then refreshed (at most every 20 minutes, and once more when the app closes) whenever your
 *    data changed, so each day's file holds how that day ended.
 *  - Every backup is CHECKED after it is written: it is read back, compared and parsed. A backup that can't be read is reported
 *    instead of being trusted.
 *  - A good backup is never silently replaced by a much smaller one (for example after "delete everything"): the bigger one is
 *    kept next to it as YYYY-MM-DD-before-shrink.json.
 *  - If the chosen folder can't be reached (an unplugged drive, a moved Dropbox folder) the backup goes to the default folder
 *    instead, and the app says so.
 *  - The newest N dated files are kept (N is the person's choice; 0 means keep them all).
 */
const path = require("path");
const crypto = require("crypto");

const DATED = /^\d{4}-\d{2}-\d{2}\.json$/;
const MIN_GAP_MS = 20 * 60 * 1000; // refresh today's file at most this often
const SHRINK_FLOOR = 20000; // only worth guarding once there is real data
const SHRINK_RATIO = 0.4; // a new copy under 40% of the old one is suspicious

const sha1 = (buf) => crypto.createHash("sha1").update(buf).digest("hex");

/*  o: {
 *    fsp,                      node's fs/promises (or a test double)
 *    atomicWrite(file, data),  writes a file without ever leaving half of it behind
 *    readData(),               -> Buffer of the data file, or null if there is none yet
 *    dir(), fallbackDir,       the chosen backup folder (a function, it can change) and the default one
 *    keep(),                   how many dated files to keep (0 = all)
 *    today(), now(),           "YYYY-MM-DD" and milliseconds
 *    log(msg)
 *  }
 */
function makeBackups(o) {
  const st = { at: 0, file: "", dir: "", bytes: 0, verified: false, error: "", note: "", count: 0, hash: "", day: "" };
  let busy = null;

  async function listDated(dir) {
    try {
      return (await o.fsp.readdir(dir)).filter((n) => DATED.test(n)).sort();
    } catch (e) {
      return [];
    }
  }
  async function writeChecked(dir, today, raw) {
    await o.fsp.mkdir(dir, { recursive: true });
    const file = path.join(dir, today + ".json");
    let old = null;
    try {
      old = await o.fsp.readFile(file);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
    if (old && old.length > SHRINK_FLOOR && raw.length < old.length * SHRINK_RATIO) await o.atomicWrite(path.join(dir, today + "-before-shrink.json"), old);
    await o.atomicWrite(file, raw);
    const back = await o.fsp.readFile(file); // the check: what is on disk must be exactly what we meant to write, and valid
    if (!back.equals(raw)) throw new Error("the backup on disk didn't match what was written");
    JSON.parse(back.toString("utf8").replace(/^\uFEFF/, ""));
    const keep = o.keep();
    let names = await listDated(dir);
    if (keep > 0) while (names.length > keep) await o.fsp.unlink(path.join(dir, names.shift())).catch(() => {});
    /* a "before shrink" safety copy goes when its day's backup goes */
    try {
      const days = new Set((await listDated(dir)).map((n) => n.slice(0, 10)));
      for (const n of await o.fsp.readdir(dir)) if (/^\d{4}-\d{2}-\d{2}-before-shrink\.json$/.test(n) && !days.has(n.slice(0, 10))) await o.fsp.unlink(path.join(dir, n)).catch(() => {});
    } catch (e) {}
    st.count = (await listDated(dir)).length;
    return file;
  }

  async function runInner(opts) {
    const raw = await o.readData();
    if (!raw || !raw.length) return;
    const today = o.today();
    const hash = sha1(raw);
    const sameDay = st.day === today;
    if (!opts.force && st.dir === o.dir()) {
      /* (only when the last backup went to the folder that is chosen now: a new folder gets a backup straight away,
         and a folder that couldn't be reached is tried again) */
      if (sameDay && hash === st.hash) return; // nothing changed since the last backup today
      if (sameDay && o.now() - st.at < MIN_GAP_MS) return; // changed, but not time to refresh yet
    }
    let file = "",
      dir = o.dir(),
      note = "";
    try {
      file = await writeChecked(dir, today, raw);
    } catch (e) {
      o.log("backup to " + dir + " failed: " + ((e && e.code) || "") + " " + String((e && e.message) || e).slice(0, 120));
      if (dir !== o.fallbackDir) {
        try {
          dir = o.fallbackDir;
          file = await writeChecked(dir, today, raw);
          note = "Couldn't reach your backup folder, so this backup went to the default folder.";
        } catch (e2) {
          o.log("backup to the default folder failed too: " + String((e2 && e2.message) || e2).slice(0, 120));
          st.error = "Couldn't write a backup (" + String((e2 && (e2.code || e2.message)) || "unknown problem").slice(0, 80) + ").";
          st.verified = false;
          return;
        }
      } else {
        st.error = "Couldn't write a backup (" + String((e && (e.code || e.message)) || "unknown problem").slice(0, 80) + ").";
        st.verified = false;
        return;
      }
    }
    st.at = o.now();
    st.file = path.basename(file);
    st.dir = dir;
    st.bytes = raw.length;
    st.verified = true;
    st.error = "";
    st.note = note;
    st.hash = hash;
    st.day = today;
  }

  /* one run at a time; a request that arrives meanwhile waits for the current one and then looks again */
  function run(opts) {
    opts = opts || {};
    const next = (busy || Promise.resolve()).catch(() => {}).then(() => runInner(opts));
    busy = next;
    return next.then(status);
  }
  function status() {
    return { at: st.at, file: st.file, dir: st.dir, bytes: st.bytes, verified: st.verified, error: st.error, note: st.note, count: st.count, day: st.day };
  }
  return { run, status, DATED };
}

module.exports = { makeBackups, MIN_GAP_MS };
