#!/usr/bin/env node
"use strict";
/*
 * Quick checks of the safety-critical pieces, run in every build. They pull the REAL code out of focusdesk.js and main.js
 * and try it out, so a later change can't quietly undo a security fix. Fails (exit 1) if anything is wrong.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const read = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8").replace(/\r\n/g, "\n"); // Windows checkouts use CRLF
const app = read("focusdesk.js");
const main = read("main.js");
const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
};
function cut(src, start, endMarker, what) {
  const a = src.indexOf(start);
  if (a < 0) {
    fails.push("couldn't find " + what + " (was it renamed?)");
    return "";
  }
  const b = src.indexOf(endMarker, a);
  return b < 0 ? "" : src.slice(a, b);
}

/* 1. the graphing calculator only builds functions from safe expressions */
{
  const text = cut(app, "    function parseExpr(str, paramVals) {", "\n    }\n", "the graphing parser") + "\n    }\n";
  let ran = 0;
  const box = { Math, Object, String, Number, window: { focusdesk: { openDataFolder() { ran++; } } }, alert() { ran++; }, fetch() { ran++; } };
  vm.createContext(box);
  vm.runInContext(text + ";this.parseExpr=parseExpr;", box);
  const run = (e, p) => {
    const f = box.parseExpr(e, p || {});
    if (!f) return null;
    try {
      return f(2);
    } catch (x) {
      return NaN;
    }
  };
  [["x^2+3*x-1", 9], ["sin(x)", Math.sin(2)], ["2*pi*x", 4 * Math.PI], ["sqrt(x)", Math.SQRT2], ["1.5*x", 3], [".5*x", 1], ["1e2*x", 200], ["x**3", 8]].forEach(([e, want]) => {
    const r = run(e);
    check(typeof r === "number" && Math.abs(r - want) < 1e-9, "graphing: " + e + " should work");
  });
  check(typeof run("a*x+b", { a: 3, b: 1 }) === "number", "graphing: sliders should work");
  ["window.focusdesk.openDataFolder()", "x.constructor", "x.constructor.constructor(x)", "Math.constructor", "alert(1)", "fetch(1)", "String.fromCharCode(97)", "Function(x)()", "x.toString()", "(x).constructor"].forEach((e) => {
    const r = run(e, { window: 1, focusdesk: 1, alert: 1, fetch: 1, String: 1, Function: 1, constructor: 1, toString: 1, fromCharCode: 1, openDataFolder: 1 });
    check(r === null || (typeof r === "number" && isNaN(r)), "graphing: attack expression must be refused: " + e);
  });
  check(ran === 0, "graphing: an attack expression actually ran code");
}

/* 2. quotes can't break out of an HTML attribute in notes */
{
  const esc = cut(app, "  function citeEsc(t) {", "\n  /* ================= 2.7: IMAGES", "citeEsc") ;
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(esc + ";this.qEsc=qEsc;this.citeEsc=citeEsc;", ctx);
  const q = ctx.qEsc && ctx.qEsc('x" onclick="alert(1)\' y');
  check(typeof q === "string" && q.indexOf('"') < 0 && q.indexOf("'") < 0, "notes: quotes must be escaped inside attributes");
  check(/qEsc\(name\)/.test(app) && /qEsc\(url\)/.test(app), "notes: wiki links and web links must escape quotes (qEsc)");
}

/* 3. web lookups can't be aimed at the person's own network */
{
  const text = cut(main, "function isPrivateHost(host) {", "\nfunction validBounds", "isPrivateHost");
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(text + ";this.isPrivateHost=isPrivateHost;", ctx);
  const H = (h) => ctx.isPrivateHost(new URL("https://" + h + "/").hostname);
  ["localhost", "127.0.0.1", "10.1.2.3", "172.20.0.1", "192.168.0.5", "169.254.169.254", "[::1]", "[fd00::1]", "[::ffff:127.0.0.1]", "printer.local"].forEach((h) => check(H(h), "addresses: " + h + " must be blocked"));
  ["example.com", "doi.org", "8.8.8.8", "172.32.0.1", "api.crossref.org"].forEach((h) => check(!H(h), "addresses: " + h + " must be allowed"));
}

/* 4. "1 card(s)" reads properly */
{
  const text = cut(app, "  function fixPlurals(t) {", "\n  function add(", "fixPlurals");
  const f = new Function(text + ";return fixPlurals;")();
  [["1 card(s)", "1 card"], ["0 reminder(s) today", "0 reminders today"], ["3 card(s)", "3 cards"], ["2 box(es)", "2 boxes"], ["1 box(es)", "1 box"], ["nothing to change", "nothing to change"]].forEach(([i, w]) => check(f(i) === w, "plurals: " + i + " should become " + w));
}

/* 5. other tabs and windows can't replace your data with junk */
check(/function applyExternal\(data\) \{\n\s*\/\*[^\n]*\*\/\n\s*if \(!isObj\(data\) \|\| Array\.isArray\(data\)/.test(app), "sync: applyExternal must check that incoming data looks like FocusDesk data");

if (fails.length) {
  console.error("selftest: FAILED\n  " + fails.join("\n  "));
  process.exit(1);
}
console.log("selftest: ok (graphing safety, note link safety, address blocking, plurals, sync guard)");
