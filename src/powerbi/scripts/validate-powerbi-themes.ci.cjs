#!/usr/bin/env node
/* Minimal validator for Power BI .pbitheme.json files */
const fs = require('fs');
const path = require('path');

const dir = process.argv[2] || 'dist/powerbi/flat';
const HEX6 = /^#[0-9a-f]{6}$/i;

function isHex(x) {
  return typeof x === 'string' && HEX6.test(x);
}
function fail(msg) {
  console.error('[pbi-theme][validate] ' + msg);
  process.exitCode = 1;
}

function expectHex(name, val) {
  if (!isHex(val)) fail(`${name} must be #RRGGBB, got: ${val}`);
}

function load(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    fail(`invalid JSON: ${file} -> ${e.message}`);
    return null;
  }
}

function paletteExpectedCount(basename) {
  if (/RAG03/i.test(basename)) return 60;
  if (/RAG08/i.test(basename)) return 8;
  if (/Divergent0[12]/i.test(basename)) return 21;
  return 10;
}

let files = [];
try {
  files = fs.readdirSync(dir).filter((f) => f.endsWith('.pbitheme.json'));
} catch (e) {
  fail(`cannot read dir: ${dir}`);
}

if (!files.length) fail(`no .pbitheme.json files in ${dir}`);

for (const f of files) {
  const p = path.join(dir, f);
  const j = load(p);
  if (!j) continue;

  if (!Array.isArray(j.dataColors) || !j.dataColors.length) {
    fail(`${f}: dataColors missing/empty`);
  } else {
    const expected = paletteExpectedCount(f);
    if (j.dataColors.length !== expected) {
      fail(`${f}: dataColors expected ${expected}, got ${j.dataColors.length}`);
    }
    j.dataColors.forEach((c, i) => expectHex(`${f}: dataColors[${i}]`, c));
  }

  expectHex(`${f}: background`, j.background);
  expectHex(`${f}: foreground`, j.foreground);
  expectHex(`${f}: tableAccent`, j.tableAccent);

  // sanity: background and foreground shouldn’t be identical
  if (j.background.toLowerCase() === j.foreground.toLowerCase()) {
    fail(`${f}: background and foreground are identical`);
  }
}

if (process.exitCode) {
  console.error('\x1b[1m\x1b[91m✖ [pbi-theme][validate] FAILED\x1b[0m');
  process.exit(process.exitCode);
}
console.log('\x1b[1m\x1b[92m✔ [pbi-theme][validate] OK\x1b[0m');
