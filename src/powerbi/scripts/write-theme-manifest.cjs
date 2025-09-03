#!/usr/bin/env node
/**
 * Build a manifest.json for all generated *.pbitheme.json files.
 *
 * - Scans dist/powerbi/flat (or given dir) for *.pbitheme.json
 * - Collects: filename, relative path, file size (bytes), SHA-256 checksum
 * - Wraps metadata in a manifest with name/version/timestamp
 * - Writes manifest JSON to dist/powerbi/manifest.json (or given output path)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ---------- CLI args / defaults ----------
const flatDir = process.argv[2] || 'dist/powerbi/flat';
const out = process.argv[3] || 'dist/powerbi/manifest.json';

// ---------- helpers ----------
/** return SHA-256 hex digest of a file */
function sha256(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

/**
 * Normalize VERSION string (env var)
 * - defaults to "dev" if unset
 */
function computeVersion(raw) {
  let v = String(raw || '').trim();
  if (!v) return 'dev';
  const semver = v.match(/v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)/);
  if (semver) v = semver[1];
  if (v.includes('/')) v = v.split('/')[0];
  v = v.replace(/-merge$/i, '');
  v = v
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return v || 'dev';
}

// ---------- collect file entries ----------
const list = fs
  .readdirSync(flatDir)
  .filter((f) => f.endsWith('.pbitheme.json'));

const items = list.map((name) => {
  const filePath = path.join(flatDir, name);
  const size = fs.statSync(filePath).size;
  return {
    name, // filename (e.g., Shidoka-Categorical01-Light-1.0.0.pbitheme.json)
    path: `flat/${name}`, // relative path under dist/powerbi
    bytes: size, // file size in bytes
    sha256: sha256(filePath), // integrity checksum
  };
});

// ---------- assemble manifest ----------
const version = computeVersion(process.env.VERSION);

const manifest = {
  name: 'Shidoka Power BI Themes', // friendly label for consuming devs
  version, // normalized version string
  generatedAt: new Date().toISOString(), // ISO timestamp
  count: items.length, // number of theme files
  items, // file list
};

// ---------- write manifest ----------
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(manifest, null, 2));
console.log('[pbi-theme] wrote manifest:', out);
