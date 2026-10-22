#!/usr/bin/env node
"use strict";
/*
 * Checks that the update schedule page follows the published releases (ticks them off, shows betas, survives GitHub being
 * unreachable). It runs the real scripts/build-roadmap.js on made-up releases. Run in the website build. Fails (exit 1) if anything is wrong.
 */
const fs = require("fs");
const path = require("path");
const read = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8").replace(/\r\n/g, "\n");
const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
};

{
  const os = require("os");
  const cp = require("child_process");
  const mk = () => fs.mkdtempSync(path.join(os.tmpdir(), "fd-road-"));
  const sched = {
    updated: "2026-01-01",
    current: { desktop: "1.4.0", browser: "3.0.0" },
    cycle: { major: "1.4", minors: 5, shipped: 0, nextMajor: "1.5" },
    policy: { headline: "Test headline", points: ["One point."], notified: ["Note."] },
    upcoming: [
      { version: "1.4.1", kind: "minor", title: "First minor", when: "Date to be set", target: "2026-11-07", status: "planned", desktop: "1.4.1", browser: "3.0.1", items: ["Thing A"], note: "" },
      { version: "1.4.2", kind: "minor", title: "Second minor", when: "Date to be set", target: "2026-11-14", status: "planned", desktop: "1.4.2", browser: "3.0.2", items: ["Thing B"], note: "" },
      { version: "1.5", kind: "major", title: "Next major", when: "Date to be set", target: "2026-12-19", status: "planned", desktop: "1.5.0", browser: "3.1.0", items: ["Thing C"], note: "" },
    ],
    released: [{ version: "1.4.0 / 3.0.0", kind: "major", date: "October 2026", summary: "Hand written summary for 1.4.0." }],
  };
  const zip = (v) => [{ name: "FocusDesk-96-Browser-" + v + ".zip" }, { name: "FocusDesk-96-Setup-x.exe" }];
  const rel = (tag, name, extra) => Object.assign({ tag_name: tag, name: name, draft: false, prerelease: false, published_at: "2026-11-07T10:00:00Z", html_url: "https://github.com/x/y/releases/tag/" + tag, body: "", assets: [] }, extra || {});
  const run = (schedule, releases) => {
    const dir = mk();
    fs.writeFileSync(path.join(dir, "schedule.json"), JSON.stringify(schedule));
    fs.writeFileSync(path.join(dir, "rel.json"), typeof releases === "string" ? releases : JSON.stringify(releases));
    const r = cp.spawnSync(process.execPath, [path.join(__dirname, "build-roadmap.js"), "--root", dir, "--releases", path.join(dir, "rel.json"), "--out", path.join(dir, "out")], { encoding: "utf8" });
    const file = path.join(dir, "out", "roadmap.html");
    return { status: r.status, err: r.stderr, html: fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "" };
  };
  /* a published release is ticked off, a beta shows as a beta, drafts and odd tags are ignored */
  const a = run(sched, [
    rel("v1.4.1", "v1.4.1 [MINOR]", { assets: zip("3.0.1"), published_at: "2026-11-07T10:00:00Z", body: "# FocusDesk 96 - Desktop Edition 1.4.1\n\nSmall fixes and polish for everyone.\n\n## Download\n- a link" }),
    rel("v1.4.2", "v1.4.2 [MINOR] [BETA]", { prerelease: true, assets: zip("3.0.2") }),
    rel("v1.4.0", "v1.4.0 [MAJOR]", { assets: zip("3.0.0"), published_at: "2026-10-21T10:00:00Z" }),
    rel("v1.4.3", "v1.4.3 [MINOR]", { draft: true, assets: zip("3.0.3") }),
    rel("nightly", "nightly build"),
  ]);
  check(a.status === 0, "schedule page: the build must succeed with releases " + a.err);
  check(a.html.indexOf("Right now: desktop app 1.4.1, browser version 3.0.1") >= 0, "schedule page: the current version must follow the newest published release");
  check(a.html.indexOf("1 of 5 Minor updates shipped") >= 0, "schedule page: the cycle count must follow the published releases");
  check(a.html.indexOf("Version 1.4.1: First minor") < 0, "schedule page: a published release must be ticked off the Coming up list");
  check(/Version 1\.4\.2: Second minor[\s\S]{0,200}badge beta/.test(a.html), "schedule page: a published pre-release must show a BETA tag on its card");
  check(a.html.indexOf("Version 1.4.3") < 0 && a.html.indexOf("3.0.3") < 0, "schedule page: a draft release must never appear");
  check(/<b>1\.4\.1 \/ 3\.0\.1<\/b> <span class="badge kind minor">MINOR<\/span>/.test(a.html), "schedule page: a released version shows its tag as a separate chip beside the number");
  check(a.html.indexOf("Small fixes and polish for everyone.") >= 0, "schedule page: a new release's summary comes from its notes");
  check(a.html.indexOf("Hand written summary for 1.4.0.") >= 0, "schedule page: a hand-written summary wins over the notes");
  check(a.html.indexOf("1.4.2 [BETA]") < 0 && a.html.indexOf("1.4.1 [MINOR]") < 0, "schedule page: a tag must never be written into the version number");
  /* the last planned update ships and a new Major starts the next cycle: the page must not break when nothing is left */
  const b = run(sched, [rel("v1.4.0", "v1.4.0 [MAJOR]", { assets: zip("3.0.0") }), rel("v1.4.1", "v1.4.1 [MINOR]", { assets: zip("3.0.1") }), rel("v1.4.2", "v1.4.2 [MINOR]", { assets: zip("3.0.2") }), rel("v1.5.0", "v1.5.0 [MAJOR]", { assets: zip("3.1.0") })]);
  check(b.status === 0 && b.html.indexOf("Nothing is scheduled yet") >= 0, "schedule page: an empty Coming up list must not break the build");
  check(b.html.indexOf("This cycle (1.5): 0 of 5 Minor updates shipped") >= 0, "schedule page: a new Major must start a new cycle count");
  /* a hotfix doesn't count toward the five */
  const c = run(sched, [rel("v1.4.0", "v1.4.0 [MAJOR]", { assets: zip("3.0.0") }), rel("v1.4.1", "v1.4.1 [MINOR]", { assets: zip("3.0.1") }), rel("v1.4.2", "v1.4.2 [HOTFIX]", { assets: zip("3.0.2") })]);
  check(c.html.indexOf("1 of 5 Minor updates shipped") >= 0, "schedule page: a hotfix must not count toward the five Minor updates");
  /* GitHub being unreachable or answering with an error must leave the page working from schedule.json alone */
  const d = run(sched, '{"message":"API rate limit exceeded"}');
  const e = run(sched, "not json at all");
  check(d.status === 0 && d.html.indexOf("Version 1.4.1: First minor") >= 0 && d.html.indexOf("desktop app 1.4.0") >= 0, "schedule page: an error answer from GitHub must fall back to schedule.json");
  check(e.status === 0 && e.html.indexOf("Version 1.4.1: First minor") >= 0, "schedule page: unreadable release data must fall back to schedule.json");
  /* the website workflow must really use it */
  const pages = read(".github/workflows/pages.yml");
  check(pages.indexOf("scripts/build-roadmap.js --releases releases.json --out site") >= 0, "schedule page: pages.yml must build the page from the published releases");
  check(fs.existsSync(path.join(__dirname, "..", ".github", "workflows", "schedule-sync.yml")), "schedule page: the workflow that rebuilds the site when a release is published is missing");
}


if (fails.length) {
  console.error("selftest-schedule: FAILED\n  " + fails.join("\n  "));
  process.exit(1);
}
console.log("selftest-schedule: ok (releases tick off the schedule, betas, hotfixes, empty list, GitHub unreachable)");
