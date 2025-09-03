#!/usr/bin/env node
/**
 * Minimal validator for Power BI *.pbitheme.json files
 *
 * What this checks:
 *  - JSON parseability
 *  - dataColors present and exact expected count per palette family
 *  - All colors it inspects are #RRGGBB format
 *  - background/foreground not identical
 */

const fs = require('fs');
const path = require('path');

// ---------------- config ----------------
const DEFAULT_DIR = 'dist/powerbi/flat';
const dir = process.argv[2] || DEFAULT_DIR;

// strict #RRGGBB matcher
const HEX6 = /^#[0-9a-f]{6}$/i;

const CHECK_SCHEMA = false;
const CHECK_RAG = false;

// ---------------- tiny helpers ----------------
/** true if val is '#rrggbb' */
function isHex(val) {
  return typeof val === 'string' && HEX6.test(val);
}

/** record a failure */
function fail(msg) {
  console.error('[pbi-theme][validate] ' + msg);
  process.exitCode = 1;
}

/** validate hex */
function expectHex(name, val) {
  if (!isHex(val)) fail(`${name} must be #RRGGBB, got: ${val}`);
}

/** read+parse JSON */
function load(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    fail(`invalid JSON: ${file} -> ${e.message}`);
    return null;
  }
}

/**
 * infer expected dataColors length from filename
 * - RAG03: we repeat 3 colors for N cycles → 60 by convention
 * - RAG08: exactly 8 slots
 * - Divergent01/02: 10 neg + (optional neutral) + 10 pos -> we standardize to 21
 * - default / categorical / sequential: 10
 */
function paletteExpectedCount(basename) {
  if (/RAG03/i.test(basename)) return 60;
  if (/RAG08/i.test(basename)) return 8;
  if (/Divergent0[12]/i.test(basename)) return 21;
  return 10;
}

// ---------------- scan output directory ----------------
let files = [];
try {
  files = fs.readdirSync(dir).filter((f) => f.endsWith('.pbitheme.json'));
} catch {
  fail(`cannot read dir: ${dir}`);
}

if (!files.length) fail(`no .pbitheme.json files in ${dir}`);

// ---------------- validate each theme ----------------
for (const f of files) {
  const p = path.join(dir, f);
  const j = load(p);
  if (!j) continue; // load() already reported the error

  if (CHECK_SCHEMA && !j.$schema) {
    fail(`${f}: missing $schema (recommended for validation/autocomplete)`);
  }

  // dataColors: required + exact count + every entry hex
  if (!Array.isArray(j.dataColors) || !j.dataColors.length) {
    fail(`${f}: dataColors missing/empty`);
  } else {
    const expected = paletteExpectedCount(f);
    if (j.dataColors.length !== expected) {
      fail(`${f}: dataColors expected ${expected}, got ${j.dataColors.length}`);
    }
    j.dataColors.forEach((c, i) => expectHex(`${f}: dataColors[${i}]`, c));
  }

  // core surface/text colors must be #RRGGBB
  expectHex(`${f}: background`, j.background);
  expectHex(`${f}: foreground`, j.foreground);
  expectHex(`${f}: tableAccent`, j.tableAccent);

  // sanity: background and foreground shouldn’t match (invisible text risk)
  if (j.background.toLowerCase() === j.foreground.toLowerCase()) {
    fail(`${f}: background and foreground are identical`);
  }

  // optional: RAG triplet if present
  if (CHECK_RAG) {
    if (j.good != null) expectHex(`${f}: good`, j.good);
    if (j.neutral != null) expectHex(`${f}: neutral`, j.neutral);
    if (j.bad != null) expectHex(`${f}: bad`, j.bad);
  }
}

// ---------------- log & exit ----------------
if (process.exitCode) {
  console.error('\x1b[1m\x1b[91m✖ [pbi-theme][validate] FAILED\x1b[0m');
  process.exit(process.exitCode);
}
console.log('\x1b[1m\x1b[92m✔ [pbi-theme][validate] OK\x1b[0m');
