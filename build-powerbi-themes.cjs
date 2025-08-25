#!/usr/bin/env node
/*
 * Maps through available palettes (10) and generates separate Light/Dark Power BI themes files
 * from shidoka-foundation CSS custom properties, then zips them together.
 * If font files are found (e.g., powerbi/assets/fonts/*.ttf), they’re added to the ZIP under /fonts.
 */

const fs = require('fs');
const path = require('path');

// ---------------- paths ----------------
function pkgRoot(name) {
  const p = require.resolve(`${name}/package.json`);
  return path.dirname(p);
}
function readText(p) {
  return fs.readFileSync(p, 'utf8');
}
function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}
function firstExistingDir(paths) {
  for (const p of paths) {
    try {
      if (p && fs.existsSync(p) && fs.statSync(p).isDirectory()) return p;
    } catch {}
  }
  return null;
}

// ---------------- CSS parsing ----------------
function parseCssVars(cssText) {
  const m = cssText.match(/:root\s*\{([\s\S]*?)\}/);
  const block = m ? m[1] : cssText;
  const vars = {};
  const re = /--([a-z0-9\-]+)\s*:\s*([^;]+);/gi;
  let x;
  while ((x = re.exec(block))) vars[x[1].trim()] = x[2].trim();
  return vars;
}
function pickLightDark(expr, mode) {
  const m = expr.match(/^light-dark\((.+),\s*(.+)\)$/i);
  if (!m) return expr;
  return mode === 'dark' ? m[2].trim() : m[1].trim();
}
function resolveExpr(expr, mode, vars, seen = new Set(), depth = 0) {
  if (!expr || depth > 40) return expr || '';
  let cur = expr.trim();

  if (/^light-dark\(/i.test(cur)) {
    cur = pickLightDark(cur, mode);
    return resolveExpr(cur, mode, vars, seen, depth + 1);
  }

  const varOnly = cur.match(/^var\(\s*--([a-z0-9\-]+)\s*\)\s*$/i);
  if (varOnly) {
    const key = varOnly[1];
    if (seen.has(key)) return cur;
    seen.add(key);
    const raw = vars[key];
    return resolveExpr(raw, mode, vars, seen, depth + 1);
  }

  cur = cur.replace(/var\(\s*--([a-z0-9\-]+)\s*\)/gi, (_, k) => {
    const raw = vars[k];
    return resolveExpr(raw, mode, vars, seen, depth + 1) ?? '';
  });

  if (/^light-dark\(/i.test(cur)) {
    return resolveExpr(cur, mode, vars, seen, depth + 1);
  }
  return cur;
}

// ---------------- color normalization ----------------
function clampByte(n) {
  return Math.max(0, Math.min(255, n | 0));
}
function toHex2(n) {
  const s = clampByte(n).toString(16);
  return s.length === 1 ? '0' + s : s;
}
function normalizeColor(input) {
  if (!input) return null;
  let v = String(input).trim().toLowerCase();

  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hex) {
    const h = hex[1].toLowerCase();
    if (h.length === 3) {
      const r = h[0] + h[0];
      const g = h[1] + h[1];
      const b = h[2] + h[2];
      return `#${r}${g}${b}`;
    }
    if (h.length === 4) {
      const r = h[0] + h[0];
      const g = h[1] + h[1];
      const b = h[2] + h[2];
      return `#${r}${g}${b}`;
    }
    if (h.length === 6) {
      return `#${h}`;
    }
    if (h.length === 8) {
      return `#${h.slice(0, 6)}`;
    }
  }

  const rgbComma = v.match(
    /^rgba?\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i
  );
  if (rgbComma) {
    const r = clampByte(+rgbComma[1]);
    const g = clampByte(+rgbComma[2]);
    const b = clampByte(+rgbComma[3]);
    return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
  }

  const rgbSpace = v.match(
    /^rgba?\(\s*([0-9]{1,3})\s+([0-9]{1,3})\s+([0-9]{1,3})(?:\s*\/\s*([0-9.]+))?\s*\)$/i
  );
  if (rgbSpace) {
    const r = clampByte(+rgbSpace[1]);
    const g = clampByte(+rgbSpace[2]);
    const b = clampByte(+rgbSpace[3]);
    return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
  }

  return v;
}

// ---------------- extract the palette ----------------
function resolveVar(name, mode, all) {
  const raw = all[name];
  if (!raw) return null;
  const v = resolveExpr(raw, mode, all);
  return typeof v === 'string' ? v.toLowerCase() : v;
}
function resolveColorVar(name, mode, all, fallback) {
  const v = resolveVar(name, mode, all);
  return normalizeColor(v) || fallback || null;
}
function getList(all, mode, prefix, keys) {
  const out = [];
  for (const k of keys) {
    const name = `${prefix}${k}`;
    const v = resolveVar(name, mode, all);
    if (v) out.push(v);
  }
  return out;
}

function categorical01(all, mode) {
  const prefix = 'kd-color-data-viz-categorical-01-';
  const keys = Array.from({ length: 10 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );
  return getList(all, mode, prefix, keys);
}

function sequential(all, mode, which) {
  const prefix = `kd-color-data-viz-sequential-${which}-`;
  const keys = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(String);
  return getList(all, mode, prefix, keys);
}

function divergentMerged(all, mode, which) {
  const base = `kd-color-data-viz-divergent-${which}-`;
  const neg = getList(
    all,
    mode,
    base + 'negative-',
    [100, 90, 80, 70, 60, 50, 40, 30, 20, 10].map(String)
  );
  const neutral = resolveVar(base + 'neutral', mode, all);
  const pos = getList(
    all,
    mode,
    base + 'positive-',
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(String)
  );
  return [...neg, ...(neutral ? [neutral] : []), ...pos];
}

function rag3(all, mode) {
  const names = [
    'kd-color-data-viz-rag-3-success',
    'kd-color-data-viz-rag-3-warning',
    'kd-color-data-viz-rag-3-error',
  ];
  const out = [];
  for (const n of names) {
    const v = resolveVar(n, mode, all);
    if (v) out.push(v);
  }
  return out;
}

function rag8(all, mode) {
  const names = [
    'kd-color-data-viz-rag-8-success',
    'kd-color-data-viz-rag-8-success-light',
    'kd-color-data-viz-rag-8-warning',
    'kd-color-data-viz-rag-8-warning-light',
    'kd-color-data-viz-rag-8-error',
    'kd-color-data-viz-rag-8-error-light',
    'kd-color-data-viz-rag-8-informational',
    'kd-color-data-viz-rag-8-informational-light',
  ];
  const out = [];
  for (const n of names) {
    const v = resolveVar(n, mode, all);
    if (v) out.push(v);
  }
  return out;
}

// ---------------- parse styles ----------------
function buildAxisBlock(labelColor, axisColor, gridColor) {
  return {
    show: true,
    labelColor: { solid: { color: labelColor } },
    axisColor: { solid: { color: axisColor } },
    gridlineColor: { solid: { color: gridColor } },
  };
}
function buildLegendBlock(color, position, show) {
  return {
    show: !!show,
    position: position || 'Bottom',
    titleColor: { solid: { color } },
    labelColor: { solid: { color } },
  };
}
function buildLabelsBlock(color, show) {
  return {
    show: !!show,
    color: { solid: { color } },
  };
}
function buildPerVisualStyles(fg, axis, grid, firstDataColor) {
  const base = {
    title: [{ show: true, fontColor: { solid: { color: fg } } }],
    legend: [buildLegendBlock(fg, 'Bottom', false)],
    labels: [buildLabelsBlock(fg, false)],
  };
  const axes = {
    categoryAxis: [buildAxisBlock(fg, axis, grid)],
    valueAxis: [buildAxisBlock(fg, axis, grid)],
  };

  const withDataPoint = firstDataColor
    ? { dataPoint: [{ defaultColor: { solid: { color: firstDataColor } } }] }
    : {};

  return {
    barChart: { '*': { ...base, ...axes, ...withDataPoint } },
    stackedBarChart: {
      '*': { ...base, ...axes, legend: [buildLegendBlock(fg, 'Bottom', true)] },
    },
    columnChart: { '*': { ...base, ...axes, ...withDataPoint } },
    stackedColumnChart: {
      '*': { ...base, ...axes, legend: [buildLegendBlock(fg, 'Bottom', true)] },
    },
    lineChart: {
      '*': { ...base, ...axes, legend: [buildLegendBlock(fg, 'Bottom', true)] },
    },
    areaChart: {
      '*': { ...base, ...axes, legend: [buildLegendBlock(fg, 'Bottom', true)] },
    },
    comboChart: {
      '*': { ...base, ...axes, legend: [buildLegendBlock(fg, 'Bottom', true)] },
    },
    scatterChart: {
      '*': {
        ...base,
        ...axes,
        legend: [buildLegendBlock(fg, 'Bottom', false)],
      },
    },
    bubbleChart: {
      '*': { ...base, ...axes, legend: [buildLegendBlock(fg, 'Bottom', true)] },
    },
    pieChart: {
      '*': {
        ...base,
        legend: [buildLegendBlock(fg, 'Bottom', true)],
        labels: [buildLabelsBlock(fg, false)],
      },
    },
    donutChart: {
      '*': {
        ...base,
        legend: [buildLegendBlock(fg, 'Bottom', true)],
        labels: [buildLabelsBlock(fg, false)],
      },
    },
    funnelChart: {
      '*': {
        ...base,
        legend: [buildLegendBlock(fg, 'Bottom', true)],
        labels: [buildLabelsBlock(fg, false)],
      },
    },
    waterfallChart: {
      '*': {
        ...base,
        legend: [buildLegendBlock(fg, 'Bottom', false)],
        labels: [buildLabelsBlock(fg, false)],
      },
    },
    treeMap: {
      '*': {
        ...base,
        legend: [buildLegendBlock(fg, 'Bottom', false)],
        labels: [buildLabelsBlock(fg, true)],
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
    card: { '*': { labels: [buildLabelsBlock(fg, true)] } },
    gauge: { '*': { labels: [buildLabelsBlock(fg, true)] } },
  };
}

// ---------------- themes ----------------
function makeTheme(name, mode, dataColors, all, fontFamilyToken) {
  const INCLUDE_STRUCTURAL_LEVELS =
    process.env.PBI_INCLUDE_STRUCTURAL_LEVELS === '1' ||
    process.env.PBI_INCLUDE_STRUCTURAL_LEVELS === 'true';

  const bg = resolveColorVar(
    'kd-color-background-page-default',
    mode,
    all,
    mode === 'dark' ? '#0f0f0f' : '#ffffff'
  );
  const fg = resolveColorVar(
    'kd-color-text-level-primary',
    mode,
    all,
    mode === 'dark' ? '#e6e6e6' : '#1f1f1f'
  );
  const grid = resolveColorVar(
    'kd-color-border-variants-light',
    mode,
    all,
    mode === 'dark' ? '#2a2a2a' : '#d4d4d8'
  );
  const axisLine = grid;
  const fontFamily = fontFamilyToken
    ? resolveExpr(all[fontFamilyToken], mode, all)
    : null;

  function makeFontFace(primaryFamily, semibold, preferRoboto) {
    let families = primaryFamily
      ? String(primaryFamily)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const hasSegoe = (f) => f.replace(/^['"]|['"]$/g, '') === 'Segoe UI';

    const twk = 'TWK Everett';
    if (!families.some((f) => f.toLowerCase().includes('twk') || f === twk)) {
      families.push(twk);
    }

    if (!families.includes('Roboto')) families.push('Roboto');

    if (!families.some((f) => hasSegoe(f))) families.push("'Segoe UI'");

    const unique = [];
    for (const f of families) {
      const norm = hasSegoe(f) ? "'Segoe UI'" : f;
      if (!unique.includes(norm)) unique.push(norm);
    }

    let ordered = [];
    if (preferRoboto) {
      ordered.push('Roboto');
      if (!unique.includes(twk)) ordered.push(twk);
      for (const f of unique) {
        if (f !== 'Roboto' && f !== twk && f !== "'Segoe UI'") ordered.push(f);
      }
      if (unique.includes("'Segoe UI'")) ordered.push("'Segoe UI'");
      else ordered.push("'Segoe UI'");
    } else {
      ordered.push(twk);
      if (!ordered.includes('Roboto')) ordered.push('Roboto');
      for (const f of unique) {
        if (f !== twk && f !== 'Roboto' && f !== "'Segoe UI'") ordered.push(f);
      }
      if (unique.includes("'Segoe UI'")) ordered.push("'Segoe UI'");
      else ordered.push("'Segoe UI'");
    }

    if (semibold) ordered[0] = `${ordered[0]} Semibold`;

    return ordered.join(',');
  }

  const firstData =
    Array.isArray(dataColors) && dataColors.length ? dataColors[0] : null;

  const rag = rag3(all, mode)
    .map((c) => normalizeColor(c))
    .filter(Boolean);
  const good = rag[0] || null;
  const neutral = rag[1] || null;
  const bad = rag[2] || null;

  const secondaryBackground =
    resolveColorVar('kd-color-background-surface', mode, all) || bg;
  const firstLevelElements = fg;
  const secondLevelElements =
    resolveColorVar('kd-color-text-level-secondary', mode, all) || fg;
  const thirdLevelElements =
    resolveColorVar('kd-color-text-level-tertiary', mode, all) ||
    firstData ||
    fg;
  const fourthLevelElements =
    resolveColorVar('kd-color-text-level-quaternary', mode, all) || grid;

  const textClasses = {
    callout: {
      fontSize: Number(resolveVar('kd-font-size-callout', mode, all)) || 45,
      fontFace: "Roboto,'Segoe UI'",
      color: firstLevelElements,
    },
    title: {
      fontSize: Number(resolveVar('kd-font-size-title', mode, all)) || 18,
      fontFace: "Roboto,'Segoe UI'",
      color: firstLevelElements,
    },
    header: {
      fontSize: Number(resolveVar('kd-font-size-header', mode, all)) || 12,
      fontFace: makeFontFace(fontFamily, true),
      color: firstLevelElements,
    },
    label: {
      fontSize: Number(resolveVar('kd-font-size-label', mode, all)) || 10,
      fontFace: "Roboto,'Segoe UI'",
      color: firstLevelElements,
    },
  };

  const globalBlock = {
    general: [
      {
        background: { solid: { color: bg } },
        foreground: { solid: { color: fg } },
        tableAccent: { solid: { color: fg } },
      },
    ],
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

  // will remain undefined until .env is set up -- will allow for per-visual theming in the future
  const ENABLE_PER_VISUAL =
    process.env.PBI_ENABLE_PER_VISUAL === '1' ||
    process.env.PBI_ENABLE_PER_VISUAL === 'true';
  const perVisual = ENABLE_PER_VISUAL
    ? buildPerVisualStyles(fg, axisLine, grid, firstData)
    : {};

  return {
    name,
    dataColors,
    background: bg,
    secondaryBackground,
    foreground: fg,
    tableAccent: fg,
    ...(INCLUDE_STRUCTURAL_LEVELS && {
      firstLevelElements,
      secondLevelElements,
      thirdLevelElements,
      fourthLevelElements,
    }),
    good,
    neutral,
    bad,
    textClasses,
    visualStyles: {
      '*': { '*': globalBlock },
      ...perVisual,
    },
  };
}

(async function main() {
  const foundation = pkgRoot('@kyndryl-design-system/shidoka-foundation');
  const palettePath = path.join(foundation, 'scss/variables/colorPalette.scss');
  const semanticPath = path.join(
    foundation,
    'scss/variables/colorSemantic.scss'
  );
  const typographyPath = path.join(
    foundation,
    'scss/variables/typography.scss'
  );

  const paletteVars = parseCssVars(readText(palettePath));
  const semanticVars = parseCssVars(readText(semanticPath));
  let typographyVars = {};
  try {
    typographyVars = parseCssVars(readText(typographyPath));
  } catch (_) {
    typographyVars = {};
  }
  const all = { ...paletteVars, ...semanticVars, ...typographyVars };

  const outDir = path.resolve(process.cwd(), 'dist/powerbi');
  ensureDir(outDir);

  const generatedAt = new Date().toISOString();

  const palettes = [
    { key: 'Categorical01', builder: (mode) => categorical01(all, mode) },
    { key: 'Sequential01', builder: (mode) => sequential(all, mode, '01') },
    { key: 'Sequential02', builder: (mode) => sequential(all, mode, '02') },
    { key: 'Sequential03', builder: (mode) => sequential(all, mode, '03') },
    { key: 'Sequential04', builder: (mode) => sequential(all, mode, '04') },
    { key: 'Sequential05', builder: (mode) => sequential(all, mode, '05') },
    { key: 'Divergent01', builder: (mode) => divergentMerged(all, mode, '01') },
    { key: 'Divergent02', builder: (mode) => divergentMerged(all, mode, '02') },
    { key: 'RAG03', builder: (mode) => rag3(all, mode) },
    { key: 'RAG08', builder: (mode) => rag8(all, mode) },
  ];

  const flatDir = path.join(outDir, 'flat');
  ensureDir(flatDir);

  const fontFamilyToken = 'kd-font-family-sans';

  for (const p of palettes) {
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
      generatedAt,
      source: 'shidoka-foundation',
      palette: p.key,
      themes: {
        light: makeTheme(
          `Shidoka ${p.key} — Light`,
          'light',
          lightColors,
          all,
          fontFamilyToken
        ),
        dark: makeTheme(
          `Shidoka ${p.key} — Dark`,
          'dark',
          darkColors,
          all,
          fontFamilyToken
        ),
      },
    };

    const outPath = path.join(outDir, `Shidoka-${p.key}.json`);
    fs.writeFileSync(outPath, JSON.stringify(file, null, '\t'));
    console.log('[pbi-theme] wrote', outPath);

    const flatLight = path.join(
      flatDir,
      `Shidoka-${p.key}-Light.pbitheme.json`
    );
    const flatDark = path.join(flatDir, `Shidoka-${p.key}-Dark.pbitheme.json`);
    fs.writeFileSync(flatLight, JSON.stringify(file.themes.light, null, '\t'));
    fs.writeFileSync(flatDark, JSON.stringify(file.themes.dark, null, '\t'));
    console.log('[pbi-theme] wrote', flatLight);
    console.log('[pbi-theme] wrote', flatDark);
  }

  // --------- Create ZIP with themes (+ optional fonts) ----------
  try {
    const archiver = require('archiver');
    const zipPath = path.join(outDir, 'Shidoka-Themes.zip');

    const projectRoot = process.cwd();
    const fontsDir = firstExistingDir([
      path.join(projectRoot, 'powerbi', 'assets', 'fonts'),
      path.join(projectRoot, 'src', 'powerbi', 'assets', 'fonts'),
      path.join(projectRoot, 'assets', 'fonts'),
    ]);

    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', resolve);
      archive.on('error', reject);

      archive.pipe(output);

      archive.directory(flatDir + '/', 'themes');

      if (fontsDir) {
        archive.directory(fontsDir + '/', 'fonts');
        console.log('[pbi-theme] bundled fonts from', fontsDir);
      } else {
        console.log('[pbi-theme] no fonts directory found; skipping fonts.');
      }

      archive.finalize();
    });

    console.log('[pbi-theme] wrote', zipPath);
  } catch (e) {
    console.log('[pbi-theme] archiver not installed; skipping zip.');
  }

  console.log('[pbi-theme] done.');
})();
