#!/usr/bin/env node
"use strict";
/*
 * Fails if something that reading saved data depends on is defined AFTER the line that reads it.
 * (A `var` is empty until the line that sets it has run, so code that runs earlier would crash and
 * FocusDesk would wrongly say the saved data is damaged.)
 */
const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "focusdesk.js");
const lines = fs.readFileSync(file, "utf8").split("\n");
const boot = lines.findIndex((l) => l === "  var S = defaults();");
if (boot < 0) {
  console.error("check-load-order: couldn't find the line that reads saved data (var S = defaults();)");
  process.exit(1);
}
const fdef = Object.create(null);
for (let i = 0; i < lines.length; i++) {
  const m = /^  function (\w+)\(/.exec(lines[i]);
  if (m) {
    let j = i;
    while (j < lines.length && lines[j] !== "  }") j++;
    fdef[m[1]] = [i, j];
    i = j;
  }
}
const late = Object.create(null);
lines.forEach((l, i) => {
  const m = /^  var (\w+)\s*=/.exec(l);
  if (m && i > boot && !(m[1] in late)) late[m[1]] = i + 1;
});
const seen = new Set();
const todo = ["sanitize", "defaults"];
while (todo.length) {
  const n = todo.pop();
  if (seen.has(n) || !fdef[n]) continue;
  seen.add(n);
  const body = lines.slice(fdef[n][0], fdef[n][1] + 1).join("\n");
  for (const c of new Set(body.match(/\b[A-Za-z_]\w*(?=\()/g) || [])) if (fdef[c] && !seen.has(c)) todo.push(c);
}
const problems = [];
for (const n of seen) {
  const [a, b] = fdef[n];
  for (let k = a; k <= b; k++) {
    // ignore words that are only object keys, e.g. "desk: {" or "clipy: ["
    const text = lines[k].replace(/\b\w+\s*:/g, " ").replace(/"(?:[^"\\]|\\.)*"/g, '""');
    for (const w of text.match(/(?<![.\w$])[A-Za-z_]\w*/g) || []) if (w in late) problems.push(`${w} (set on line ${late[w]}) is used in ${n}() on line ${k + 1}, before it is set`);
  }
}
if (problems.length) {
  console.error("check-load-order: FAILED\n  " + [...new Set(problems)].join("\n  ") + "\nMove those definitions above `function defaults()`.");
  process.exit(1);
}
console.log("load-order check: ok (" + seen.size + " functions read while loading saved data)");
