"use strict";
/*
 * Writes a file so that a crash or power cut can't leave half a file behind: write a temp file next to it, then swap it in.
 * Windows can be awkward about that swap (antivirus, cloud sync and read-only flags all get in the way), so this is patient and has fallbacks:
 *   1. keep retrying the swap for a few seconds, clearing a read-only flag along the way
 *   2. if the swap still fails, copy the finished temp file over the old one
 *   3. a disk that refuses "flush to disk" (some do) no longer fails the save
 */
function create(opts) {
  const fsp = (opts && opts.fsp) || require("fs").promises;
  const sleep = (opts && opts.sleep) || ((ms) => new Promise((r) => setTimeout(r, ms)));
  const log = (opts && opts.log) || (() => {});
  const BUSY = ["EPERM", "EBUSY", "EACCES", "EMFILE", "ENFILE", "UNKNOWN", "EAGAIN"];

  async function renameRetry(from, to) {
    let last = null;
    for (let i = 0; i < 12; i++) {
      try {
        return await fsp.rename(from, to);
      } catch (e) {
        last = e;
        if (BUSY.indexOf(e.code) < 0) throw e;
        if (i === 3) await fsp.chmod(to, 0o666).catch(() => {}); // a read-only flag stops a file being replaced
        await sleep(40 * (i + 1));
      }
    }
    throw last;
  }

  async function atomicWrite(file, contents) {
    const tmp = file + "." + process.pid + "." + Date.now() + ".tmp";
    let fh = null;
    try {
      fh = await fsp.open(tmp, "w");
      await fh.writeFile(contents);
      try {
        await fh.sync();
      } catch (e) {
        log("disk flush refused for " + file + " (" + (e && e.code) + "); continuing");
      }
      await fh.close();
      fh = null;
      try {
        await renameRetry(tmp, file);
      } catch (e) {
        log("swap failed for " + file + " (" + (e && e.code) + "); copying over it instead");
        await fsp.copyFile(tmp, file);
        log("saved " + file + " by copying");
      }
      await fsp.unlink(tmp).catch(() => {});
    } catch (e) {
      if (fh) await fh.close().catch(() => {});
      await fsp.unlink(tmp).catch(() => {});
      throw e;
    }
  }
  return { renameRetry, atomicWrite };
}
module.exports = create;
