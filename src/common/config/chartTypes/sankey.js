import { getComputedColorPalette } from '../colorPalettes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const type = 'sankey';

const getSankeyLabelColor = () =>
  getTokenThemeVal('--kd-color-text-level-primary');
export const options = (ctx) => {
  const BorderColor = getTokenThemeVal('--kd-color-background-page-default');
  const LabelColor = getSankeyLabelColor();
  const Colors = getComputedColorPalette(
    ctx?.options?.colorPalette || 'categorical'
  );
  const SankeyBackground = getTokenThemeVal(
    '--kd-color-data-viz-level-secondary'
  );

  const userOptions = ctx?.options || {};

  return {
    outlineBorderWidth: 0.5,
    outlineBorderColor: BorderColor,
    outlineBackgroundColor: SankeyBackground,
    backgroundColor: Colors[0],
    ...userOptions,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        font: {
          size: 12,
          weight: 'bold',
        },
        color: LabelColor,
      },
      ...(userOptions.plugins || {}),
    },
    sankey: {
      dataTableHeaderLabels: {
        source: 'Source',
        target: 'Target',
        value: 'Weight',
      },
      ...(userOptions.sankey || {}),
    },
    borderColor: BorderColor,
  };
};

const getFrom = (d) => d?.from ?? d?.source;
const getTo = (d) => d?.to ?? d?.target;

export const datasetOptions = (ctx) => {
  const rawKey = ctx?.options?.colorPalette || 'categorical';
  const key = rawKey === 'default' ? 'categorical' : rawKey;
  const LabelColor = getSankeyLabelColor();

  let palette =
    getComputedColorPalette(key) ||
    getComputedColorPalette('categorical') ||
    [];

  const buildNodeColorMap = (dataset) => {
    const cachedKey = dataset._nodeColorMapPaletteKey;
    if (dataset._nodeColorMap && cachedKey === key)
      return dataset._nodeColorMap;

    const nodes = [];
    (dataset.data || []).forEach((d) => {
      if (!d) return;
      const f = getFrom(d);
      const t = getTo(d);
      if (f !== undefined && !nodes.includes(f)) nodes.push(f);
      if (t !== undefined && !nodes.includes(t)) nodes.push(t);
    });

    const map = {};
    nodes.forEach((n, i) => {
      map[n] = palette[i % palette.length];
    });

    dataset._nodeColorMap = map;
    dataset._nodeColorMapPaletteKey = key;

    dataset._colorPalette = palette;
    return map;
  };

  const getNodeColor = (dataset, key) => {
    if (!dataset) return palette[0];
    const map = buildNodeColorMap(dataset);
    return key !== undefined && map[key] ? map[key] : palette[0];
  };

  const colorForIndex = (context, which /* 'from' | 'to' */) => {
    const ds = context?.dataset;
    const idx = typeof context?.dataIndex === 'number' ? context.dataIndex : 0;
    const link = ds?.data?.[idx];
    if (!link) return palette[0];
    const k = which === 'from' ? getFrom(link) : getTo(link);
    return getNodeColor(ds, k);
  };

  return {
    color: LabelColor, // node label color
    colorFrom: (ctx2) => colorForIndex(ctx2, 'from'),
    colorTo: (ctx2) => colorForIndex(ctx2, 'to'),
    hoverColorFrom: (ctx2) => colorForIndex(ctx2, 'from'),
    hoverColorTo: (ctx2) => colorForIndex(ctx2, 'to'),
    colorMode: 'gradient',
  };
};

export const normalizeData = (a) => {
  const datasetsSource =
    (a.datasets && a.datasets.length && a.datasets) || a.data?.datasets;

  const datasets = (datasetsSource || []).map((ds) => ({ ...ds }));

  if (Array.isArray(a.labels) && a.labels.length) {
    return { datasets, labels: a.labels };
  }

  const nodeLabels = (() => {
    if (!datasets?.[0]?.data?.length) return [];
    const ds = datasets[0];
    const nodes = [];
    ds.data.forEach((link) => {
      if (!link) return;
      const from = link.from ?? link.source;
      const to = link.to ?? link.target;
      if (from !== undefined && !nodes.includes(from)) nodes.push(from);
      if (to !== undefined && !nodes.includes(to)) nodes.push(to);
    });
    return nodes.map((n) => (ds.labels?.[n] ? ds.labels[n] : String(n)));
  })();

  return { datasets, labels: nodeLabels };
};
