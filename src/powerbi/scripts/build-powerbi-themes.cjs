#!/usr/bin/env node
/**
 * Shidoka --> Power BI themes
 * - Reads CSS custom props from shidoka-foundation
 * - Resolves light-dark()/var(--{{SHIDOKA_TOKEN}}) chains
 * - Emits per-palette Light/Dark *.pbitheme.json (+ a combined debug JSON)
 * - zips 'flattened' JSON files
 */

const fs = require('fs');
const path = require('path');

// ---------- Config ----------
const FOUNDATION_PKG = '@kyndryl-design-system/shidoka-foundation';
const OUTPUT_DIR = 'dist/powerbi';
const FLAT_SUBDIR = 'flat';
const FONT_TOKEN = 'kd-font-family-sans';
const SCHEMA_URL =
  'https://raw.githubusercontent.com/microsoft/powerbi-desktop-samples/main/Report%20Theme%20JSON%20Schema/4.0.0/schema.json';

const pkgRoot = (name) => path.dirname(require.resolve(`${name}/package.json`));
const readText = (p) => fs.readFileSync(p, 'utf8');
const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });
const writeJson = (p, obj) =>
  fs.writeFileSync(p, JSON.stringify(obj, null, '\t'));

// ---------- CSS var parsing ----------
/** extract --vars from :root { ... } or raw CSS text */
function parseCssVars(cssText) {
  const m = cssText.match(/:root\s*\{([\s\S]*?)\}/);
  const block = m ? m[1] : cssText;
  const out = {};
  const re = /--([a-z0-9\-]+)\s*:\s*([^;]+);/gi;
  let x;
  while ((x = re.exec(block))) out[x[1].trim()] = x[2].trim();
  return out;
}

/** light-dark(a,b) --> pick by mode */
const pickLightDark = (expr, mode) => {
  const m = expr.match(/^light-dark\((.+),\s*(.+)\)$/i);
  return m ? (mode === 'dark' ? m[2].trim() : m[1].trim()) : expr;
};

/** Resolve nested light-dark() and var(--{{SHIDOKA_TOKEN}}) */
function resolveExpr(expr, mode, vars, seen = new Set(), depth = 0) {
  if (!expr || depth > 40) return expr || '';
  let cur = String(expr).trim();

  // unwrap light-dark()
  if (/^light-dark\(/i.test(cur))
    return resolveExpr(pickLightDark(cur, mode), mode, vars, seen, depth + 1);

  // single var only
  const only = cur.match(/^var\(\s*--([a-z0-9\-]+)\s*\)\s*$/i);
  if (only) {
    const key = only[1];
    if (seen.has(key)) return cur;
    seen.add(key);
    return resolveExpr(vars[key], mode, vars, seen, depth + 1);
  }

  // inline var(...) replacements
  cur = cur.replace(
    /var\(\s*--([a-z0-9\-]+)\s*\)/gi,
    (_, k) => resolveExpr(vars[k], mode, vars, seen, depth + 1) ?? ''
  );

  // second pass: if it turned into light-dark(), resolve again
  return /^light-dark\(/i.test(cur)
    ? resolveExpr(cur, mode, vars, seen, depth + 1)
    : cur;
}

// ---------- Color normalization ----------
const clampByte = (n) => Math.max(0, Math.min(255, n | 0));
const toHex2 = (n) => {
  const s = clampByte(n).toString(16);
  return s.length === 1 ? '0' + s : s;
};

/** Normalize to #rrggbb (drop alpha; accept #rgb/#rgba/rgb()/rgba()) */
function normalizeColor(input) {
  if (!input) return null;
  let v = String(input).trim().toLowerCase();

  const hex = v.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hex) {
    const h = hex[1].toLowerCase();
    if (h.length === 3) return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
    if (h.length === 4) return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`; // drop alpha
    if (h.length === 6) return `#${h}`;
    if (h.length === 8) return `#${h.slice(0, 6)}`; // drop alpha
  }

  let m =
    v.match(
      /^rgba?\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i
    ) ||
    v.match(
      /^rgba?\(\s*([0-9]{1,3})\s+([0-9]{1,3})\s+([0-9]{1,3})(?:\s*\/\s*([0-9.]+))?\s*\)$/i
    );
  if (m) {
    const r = toHex2(+m[1]);
    const g = toHex2(+m[2]);
    const b = toHex2(+m[3]);
    return `#${r}${g}${b}`;
  }
  return v;
}

// ---------- Version/tag ----------
function computeVersion(raw) {
  let v = String(raw || '').trim();
  if (!v) return 'dev';
  const semver = v.match(/v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)/);
  if (semver) v = semver[1];
  if (v.includes('/')) v = v.split('/')[0];
  v = v
    .replace(/-merge$/i, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return (v || 'dev').slice(0, 64);
}

// ---------- Token access ----------
const resolveVar = (name, mode, all) => {
  const raw = all[name];
  const v = raw ? resolveExpr(raw, mode, all) : null;
  return typeof v === 'string' ? v.toLowerCase() : v;
};
const resolveColorVar = (name, mode, all, fallback) =>
  normalizeColor(resolveVar(name, mode, all)) || fallback || null;

function getList(all, mode, prefix, keys) {
  const out = [];
  for (const k of keys) {
    const v = resolveVar(`${prefix}${k}`, mode, all);
    if (v) out.push(v);
  }
  return out;
}

// ---------- Palette builders ----------
const categorical01 = (all, mode) =>
  getList(
    all,
    mode,
    'kd-color-data-viz-categorical-01-',
    Array.from({ length: 10 }, (_, i) => String(i + 1).padStart(2, '0'))
  );

const sequential = (all, mode, whichToken) =>
  getList(all, mode, `kd-color-data-viz-sequential-${whichToken}-`, [
    '10',
    '20',
    '30',
    '40',
    '50',
    '60',
    '70',
    '80',
    '90',
    '100',
  ]);

function divergentMerged(all, mode, whichToken) {
  const base = `kd-color-data-viz-divergent-${whichToken}-`;
  const neg = getList(all, mode, base + 'negative-', [
    '100',
    '90',
    '80',
    '70',
    '60',
    '50',
    '40',
    '30',
    '20',
    '10',
  ]);
  const neutral = resolveVar(base + 'neutral', mode, all);
  const pos = getList(all, mode, base + 'positive-', [
    '10',
    '20',
    '30',
    '40',
    '50',
    '60',
    '70',
    '80',
    '90',
    '100',
  ]);
  return [...neg, ...(neutral ? [neutral] : []), ...pos];
}

const rag3 = (all, mode) =>
  [
    'kd-color-data-viz-rag-3-success',
    'kd-color-data-viz-rag-3-warning',
    'kd-color-data-viz-rag-3-error',
  ]
    .map((n) => resolveVar(n, mode, all))
    .filter(Boolean);

function rag3Cycled(all, mode, cycles = 20) {
  const [succ, warn, err] = rag3(all, mode);
  const triplet = [err, warn, succ].map(normalizeColor).filter(Boolean); // error-->warning-->success
  const out = [];
  for (let i = 0; i < cycles; i++) out.push(...triplet);
  return out;
}

const rag8 = (all, mode) =>
  [
    'kd-color-data-viz-rag-8-success',
    'kd-color-data-viz-rag-8-success-light',
    'kd-color-data-viz-rag-8-warning',
    'kd-color-data-viz-rag-8-warning-light',
    'kd-color-data-viz-rag-8-error',
    'kd-color-data-viz-rag-8-error-light',
    'kd-color-data-viz-rag-8-informational',
    'kd-color-data-viz-rag-8-informational-light',
  ]
    .map((n) => resolveVar(n, mode, all))
    .filter(Boolean);

// ---------- Visual style builders ----------
/** global axis defaults (e.g., line/area/bar/column/combo) */
function axesBlock(fg, axis, grid) {
  return {
    cartesian: {
      '*': {
        xAxis: [
          {
            show: true,
            labelColor: { solid: { color: fg } },
            lineColor: { solid: { color: axis } },
            gridlineColor: { solid: { color: grid } },
            titleColor: { solid: { color: fg } },
          },
        ],
        yAxis: [
          {
            show: true,
            labelColor: { solid: { color: fg } },
            lineColor: { solid: { color: axis } },
            gridlineColor: { solid: { color: grid } },
            titleColor: { solid: { color: fg } },
          },
        ],
      },
    },
  };
}

/** Optional per-visual defaults (behind PBI_ENABLE_PER_VISUAL) */
function buildPerVisualStyles(fg, axis, grid, firstDataColor) {
  const base = {
    title: [{ show: true, fontColor: { solid: { color: fg } } }],
    legend: [
      {
        show: false,
        position: 'Bottom',
        titleColor: { solid: { color: fg } },
        labelColor: { solid: { color: fg } },
      },
    ],
    labels: [{ show: false, color: { solid: { color: fg } } }],
  };
  const withDataPoint = firstDataColor
    ? { dataPoint: [{ defaultColor: { solid: { color: firstDataColor } } }] }
    : {};

  return {
    barChart: { '*': { ...base, ...withDataPoint } },
    stackedBarChart: {
      '*': {
        ...base,
        legend: [
          {
            show: true,
            position: 'Bottom',
            titleColor: { solid: { color: fg } },
            labelColor: { solid: { color: fg } },
          },
        ],
      },
    },
    columnChart: { '*': { ...base, ...withDataPoint } },
    stackedColumnChart: {
      '*': {
        ...base,
        legend: [
          {
            show: true,
            position: 'Bottom',
            titleColor: { solid: { color: fg } },
            labelColor: { solid: { color: fg } },
          },
        ],
      },
    },
    lineChart: {
      '*': {
        ...base,
        legend: [
          {
            show: true,
            position: 'Bottom',
            titleColor: { solid: { color: fg } },
            labelColor: { solid: { color: fg } },
          },
        ],
      },
    },
    areaChart: {
      '*': {
        ...base,
        legend: [
          {
            show: true,
            position: 'Bottom',
            titleColor: { solid: { color: fg } },
            labelColor: { solid: { color: fg } },
          },
        ],
      },
    },
    comboChart: {
      '*': {
        ...base,
        legend: [
          {
            show: true,
            position: 'Bottom',
            titleColor: { solid: { color: fg } },
            labelColor: { solid: { color: fg } },
          },
        ],
      },
    },
    scatterChart: { '*': { ...base } },
    bubbleChart: {
      '*': {
        ...base,
        legend: [
          {
            show: true,
            position: 'Bottom',
            titleColor: { solid: { color: fg } },
            labelColor: { solid: { color: fg } },
          },
        ],
      },
    },
    pieChart: {
      '*': {
        ...base,
        legend: [
          {
            show: true,
            position: 'Bottom',
            titleColor: { solid: { color: fg } },
            labelColor: { solid: { color: fg } },
          },
        ],
        labels: [{ show: true, color: { solid: { color: fg } } }],
        ...withDataPoint,
      },
    },
    donutChart: {
      '*': {
        ...base,
        legend: [
          {
            show: true,
            position: 'Bottom',
            titleColor: { solid: { color: fg } },
            labelColor: { solid: { color: fg } },
          },
        ],
        labels: [{ show: true, color: { solid: { color: fg } } }],
        ...withDataPoint,
      },
    },
    funnelChart: { '*': { ...base } },
    waterfallChart: { '*': { ...base } },
    treeMap: {
      '*': {
        ...base,
        labels: [{ show: true, color: { solid: { color: fg } } }],
      },
    },
    tableEx: {
      '*': { values: [{ fontColorPrimary: { solid: { color: fg } } }] },
    },
    matrix: {
      '*': {
        columnHeaders: [{ fontColor: { solid: { color: fg } } }],
        values: [{ fontColorPrimary: { solid: { color: fg } } }],
      },
    },
    card: {
      '*': { labels: [{ show: true, color: { solid: { color: fg } } }] },
    },
    gauge: {
      '*': { labels: [{ show: true, color: { solid: { color: fg } } }] },
    },
  };
}

// ---------- Theme assembly ----------
function makeTheme(name, mode, dataColors, all, fontFamilyToken) {
  const INCLUDE_STRUCT =
    process.env.PBI_INCLUDE_STRUCTURAL_LEVELS === '1' ||
    process.env.PBI_INCLUDE_STRUCTURAL_LEVELS === 'true';
  const ENABLE_PV =
    process.env.PBI_ENABLE_PER_VISUAL === '1' ||
    process.env.PBI_ENABLE_PER_VISUAL === 'true';

  // base colors from tokens (with fallbacks)
  const bg = resolveColorVar(
    'kd-color-background-page-default',
    mode,
    all,
    mode === 'dark' ? '#1d2125' : '#ffffff'
  );
  const fg = resolveColorVar(
    'kd-color-text-level-primary',
    mode,
    all,
    mode === 'dark' ? '#f9f9f9' : '#1f1f1f'
  );
  const grid = resolveColorVar(
    'kd-color-border-variants-light',
    mode,
    all,
    mode === 'dark' ? '#2a2a2a' : '#d4d4d8'
  );
  const secondaryBackground =
    resolveColorVar('kd-color-background-surface', mode, all) || bg;

  // first series default (optionally used by per-visual styles)
  const firstData =
    Array.isArray(dataColors) && dataColors.length ? dataColors[0] : null;

  // PBI font selection (map non-PBI fonts -> closest safe)
  const PBI_ALLOWED = new Set([
    'Segoe UI',
    'Arial',
    'Calibri',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Times New Roman',
    'Georgia',
    'Gadugi',
    'Comic Sans MS',
    'Courier New',
  ]);
  const ALIASES = {
    inter: 'Segoe UI',
    helvetica: 'Arial',
    'helvetica neue': 'Arial',
    'system ui': 'Segoe UI',
    'ui-sans-serif': 'Segoe UI',
    'twk everett': 'Segoe UI',
    roboto: 'Segoe UI',
    'sf pro text': 'Segoe UI',
    'sf pro display': 'Segoe UI',
  };
  function pickPbiFontFromToken(tokenExpr) {
    const raw = tokenExpr
      ? String(resolveExpr(tokenExpr, mode, all) || '')
      : '';
    const families = raw
      .split(',')
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
      .map((s) =>
        s.replace(
          /\s+(Thin|Extra\s*Light|Light|Regular|Book|Text|Medium|Semi\s*Bold|Semibold|Demi\s*Bold|Bold|Extra\s*Bold|Black)$/i,
          ''
        )
      )
      .filter(Boolean);
    for (const f of families) if (PBI_ALLOWED.has(f)) return f;
    for (const f of families) {
      const k = f.toLowerCase();
      if (ALIASES[k]) return ALIASES[k];
    }
    return 'Segoe UI';
  }
  const pbiFont = pickPbiFontFromToken(
    fontFamilyToken ? all[fontFamilyToken] : null
  );

  // text sizes/colors (pull from tokens if present; default to PBI-friendly sizes)
  const toNum = (v, fallback) => {
    const n = Number(resolveVar(v, mode, all));
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };
  const textClasses = {
    callout: {
      fontSize: toNum('kd-font-size-callout', 45),
      fontFace: pbiFont,
      color: fg,
    },
    title: {
      fontSize: toNum('kd-font-size-title', 18),
      fontFace: pbiFont,
      color: fg,
    },
    header: {
      fontSize: toNum('kd-font-size-header', 12),
      fontFace: pbiFont,
      color: fg,
    },
    label: {
      fontSize: toNum('kd-font-size-label', 10),
      fontFace: pbiFont,
      color: fg,
    },
  };

  // RAG03
  const [succ, warn, err] = rag3(all, mode).map(normalizeColor).filter(Boolean);
  const good = succ || null;
  const neutral = warn || null;
  const bad = err || null;

  // global defaults applied to all visuals
  const baseVisual = {
    title: [{ show: true, fontColor: { solid: { color: fg } } }],
    legend: [
      {
        show: false,
        position: 'Bottom',
        titleColor: { solid: { color: fg } },
        labelColor: { solid: { color: fg } },
      },
    ],
    labels: [{ show: false, color: { solid: { color: fg } } }],
  };
  const visualStyles = {
    '*': {
      '*': {
        ...baseVisual,
        background: [{ color: { solid: { color: bg } }, transparency: 0 }],
        plotArea: [{ color: { solid: { color: bg } }, transparency: 0 }],
      },
    },
    ...axesBlock(fg, grid, grid),
    page: {
      '*': {
        background: [{ color: { solid: { color: bg } }, transparency: 0 }],
        wallpaper: [{ color: { solid: { color: bg } }, transparency: 0 }],
      },
    },
    filterPane: {
      '*': {
        background: [{ color: { solid: { color: bg } }, transparency: 0 }],
        title: [{ color: { solid: { color: fg } } }],
        text: [{ color: { solid: { color: fg } } }],
      },
    },
    filterCard: {
      '*': {
        background: [{ color: { solid: { color: bg } }, transparency: 0 }],
        border: [{ color: { solid: { color: bg } } }],
        text: [{ color: { solid: { color: fg } } }],
      },
    },
    ...(ENABLE_PV ? buildPerVisualStyles(fg, grid, grid, firstData) : {}),
  };

  return {
    $schema: SCHEMA_URL,
    name,
    dataColors,
    background: bg,
    secondaryBackground,
    foreground: fg,
    tableAccent: fg,
    ...(INCLUDE_STRUCT && {
      firstLevelElements: fg,
      secondLevelElements:
        resolveColorVar('kd-color-text-level-secondary', mode, all) || fg,
      thirdLevelElements:
        resolveColorVar('kd-color-text-level-tertiary', mode, all) ||
        firstData ||
        fg,
      fourthLevelElements:
        resolveColorVar('kd-color-text-level-quaternary', mode, all) || grid,
    }),
    good,
    neutral,
    bad,
    textClasses,
    visualStyles,
  };
}

// ---------- Main ----------
(async function main() {
  // 1) Read tokens
  const foundation = pkgRoot(FOUNDATION_PKG);
  const paletteVars = parseCssVars(
    readText(path.join(foundation, 'scss/variables/colorPalette.scss'))
  );
  const semanticVars = parseCssVars(
    readText(path.join(foundation, 'scss/variables/colorSemantic.scss'))
  );

  let typographyVars = {};
  try {
    typographyVars = parseCssVars(
      readText(path.join(foundation, 'scss/variables/typography.scss'))
    );
  } catch (_) {
    typographyVars = {};
  }

  const all = { ...paletteVars, ...semanticVars, ...typographyVars };

  // 2) Prepare output directories
  const outDir = path.resolve(process.cwd(), OUTPUT_DIR);
  const flatDir = path.join(outDir, FLAT_SUBDIR);
  ensureDir(outDir);
  ensureDir(flatDir);

  // 3) Build themes for each colorPalette
  const generatedAt = new Date().toISOString();
  const version = computeVersion(process.env.VERSION);
  const PALETTES = [
    { key: 'Categorical01', builder: (m) => categorical01(all, m) },
    { key: 'Sequential01', builder: (m) => sequential(all, m, '01') },
    { key: 'Sequential02', builder: (m) => sequential(all, m, '02') },
    { key: 'Sequential03', builder: (m) => sequential(all, m, '03') },
    { key: 'Sequential04', builder: (m) => sequential(all, m, '04') },
    { key: 'Sequential05', builder: (m) => sequential(all, m, '05') },
    { key: 'Divergent01', builder: (m) => divergentMerged(all, m, '01') },
    { key: 'Divergent02', builder: (m) => divergentMerged(all, m, '02') },
    { key: 'RAG03', builder: (m) => rag3Cycled(all, m, 20) },
    { key: 'RAG08', builder: (m) => rag8(all, m) },
  ];

  for (const p of PALETTES) {
    const lightColors = p
      .builder('light')
      .filter(Boolean)
      .map(normalizeColor)
      .filter(Boolean);
    const darkColors = p
      .builder('dark')
      .filter(Boolean)
      .map(normalizeColor)
      .filter(Boolean);

    const file = {
      version,
      generatedAt,
      source: 'shidoka-foundation',
      palette: p.key,
      themes: {
        light: makeTheme(
          `Shidoka ${p.key} — Light`,
          'light',
          lightColors,
          all,
          FONT_TOKEN
        ),
        dark: makeTheme(
          `Shidoka ${p.key} — Dark`,
          'dark',
          darkColors,
          all,
          FONT_TOKEN
        ),
      },
    };

    // Combined (debug/reference)
    const outPath = path.join(outDir, `Shidoka-${p.key}.json`);
    writeJson(outPath, file);
    console.log('[pbi-theme] wrote', outPath);

    // Flat importable themes
    const flatLight = path.join(
      flatDir,
      `Shidoka-${p.key}-Light-${version}.pbitheme.json`
    );
    const flatDark = path.join(
      flatDir,
      `Shidoka-${p.key}-Dark-${version}.pbitheme.json`
    );
    writeJson(flatLight, file.themes.light);
    writeJson(flatDark, file.themes.dark);
    console.log('[pbi-theme] wrote', flatLight);
    console.log('[pbi-theme] wrote', flatDark);
  }

  // 4) ZIP of flat themes
  try {
    const archiver = require('archiver');
    const zipName = `Shidoka-Themes-${version}.zip`;
    const zipPath = path.join(outDir, zipName);

    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      output.on('close', resolve);
      archive.on('error', reject);
      archive.pipe(output);
      archive.directory(flatDir + '/', 'themes');
      archive.finalize();
    });

    console.log('[pbi-theme] wrote', zipPath);

    // Stable name for links
    const stableZip = path.join(outDir, 'Shidoka-Themes.zip');
    fs.copyFileSync(zipPath, stableZip);
    console.log('[pbi-theme] wrote', stableZip);
  } catch {
    console.log('[pbi-theme] archiver not installed; skipping zip.');
  }
})();
