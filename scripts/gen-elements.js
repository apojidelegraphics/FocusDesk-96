#!/usr/bin/env node
"use strict";
/*
 * Prints the PTD table (extra element properties) that is embedded in focusdesk.js.
 * Source: the `periodic-table` npm package (ISC License, Copyright (c) 2015 Chris Andrejewski).
 * Usage:  npm install periodic-table --no-save && node scripts/gen-elements.js
 * Each row: [electron configuration, electronegativity, atomic radius (pm), first ionization energy (kJ/mol),
 *            electron affinity (kJ/mol), common oxidation states, standard state, melting point (K),
 *            boiling point (K), density (g/cm3), year discovered]
 */
const data = require("periodic-table/data.json");
const rows = Object.keys(data)
  .map((k) => data[k])
  .sort((a, b) => a.atomicNumber - b.atomicNumber);
const num = (v) => (v === "" || v == null || isNaN(Number(v)) ? null : Number(v));
const str = (v) => (v === "" || v == null ? null : String(v).trim());
const out = rows.map((e) => [
  str(e.electronicConfiguration),
  num(e.electronegativity),
  num(e.atomicRadius),
  num(e.ionizationEnergy),
  num(e.electronAffinity),
  str(e.oxidationStates),
  str(e.standardState),
  num(e.meltingPoint),
  num(e.boilingPoint),
  num(e.density),
  str(e.yearDiscovered),
]);
console.log("  var PTD = [");
out.forEach((r) => console.log("    " + JSON.stringify(r) + ","));
console.log("  ];");
