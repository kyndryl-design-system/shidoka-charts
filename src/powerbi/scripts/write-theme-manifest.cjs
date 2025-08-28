#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const flatDir = process.argv[2] || 'dist/powerbi/flat';
const out = process.argv[3] || 'dist/powerbi/manifest.json';

function sha256(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

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

const list = fs
  .readdirSync(flatDir)
  .filter((f) => f.endsWith('.pbitheme.json'));
const items = list.map((name) => {
  const filePath = path.join(flatDir, name);
  const size = fs.statSync(filePath).size;
  return {
    name,
    path: `flat/${name}`,
    bytes: size,
    sha256: sha256(filePath),
  };
});

const version = computeVersion(process.env.VERSION);

const manifest = {
  name: 'Shidoka Power BI Themes',
  version,
  generatedAt: new Date().toISOString(),
  count: items.length,
  items,
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(manifest, null, 2));
console.log('[pbi-theme] wrote manifest:', out);
