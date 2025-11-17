import { getComputedColorPalette } from '../colorPalettes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';
import { createSankeyTooltipHandler } from '../../plugins/sankeyTooltip';

export const type = 'sankey';

const getSankeyLabelColor = () =>
  getTokenThemeVal('--kd-color-text-level-primary');

const getFrom = (d) => d?.from ?? d?.source;
const getTo = (d) => d?.to ?? d?.target;

const sankeyExternalTooltip = createSankeyTooltipHandler();

export const options = (ctx) => {
  const userOptions = ctx?.options || {};
  const BorderColor = getTokenThemeVal('--kd-color-background-page-default');
  const LabelColor = getSankeyLabelColor();
  const rawPaletteKey = userOptions.colorPalette || 'categorical';
  const Colors = getComputedColorPalette(rawPaletteKey);
  const SankeyBackground = getTokenThemeVal(
    '--kd-color-data-viz-level-secondary'
  );

  const baseOptions = {
    outlineBorderWidth: 0.5,
    outlineBorderColor: BorderColor,
    outlineBackgroundColor: SankeyBackground,
    backgroundColor: Colors[0],
    ...userOptions,
  };

  const defaultAnimation = {
    duration: 450,
    easing: 'easeOutCubic',
    loop: false,
  };

  baseOptions.animation =
    userOptions.animation === false
      ? false
      : {
          ...defaultAnimation,
          ...(typeof userOptions.animation === 'object'
            ? userOptions.animation
            : {}),
        };

  baseOptions.responsiveAnimationDuration =
    typeof userOptions.responsiveAnimationDuration === 'number'
      ? userOptions.responsiveAnimationDuration
      : 0;

  baseOptions.animations = {
    colors: { duration: 0 },
    active: { duration: 0 },
    x: {
      duration: 450,
      easing: 'easeOutCubic',
    },
    y: {
      duration: 450,
      easing: 'easeOutCubic',
    },
    ...(userOptions.animations || {}),
  };

  const basePlugins = {
    legend: { display: false },
    datalabels: {
      font: {
        size: 12,
        weight: 'bold',
      },
      color: LabelColor,
    },
    tooltip: {
      enabled: false,
      external: sankeyExternalTooltip,
    },
    ...(userOptions.plugins || {}),
  };

  const baseSankey = {
    dataTableHeaderLabels: {
      source: 'Source',
      target: 'Target',
      value: 'Weight',
    },
    ...(userOptions.sankey || {}),
  };

  return {
    ...baseOptions,
    plugins: basePlugins,
    sankey: baseSankey,
    borderColor: BorderColor,
  };
};

export const datasetOptions = (ctx) => {
  const rawKey = ctx?.options?.colorPalette || 'categorical';
  const key = rawKey === 'default' ? 'categorical' : rawKey;
  const LabelColor = getSankeyLabelColor();

  let palette =
    getComputedColorPalette(key) ||
    getComputedColorPalette('categorical') ||
    [];

  const FALLBACK_COLOR = palette[0] || '#888';

  const buildNodeColorMap = (dataset) => {
    if (!dataset) return {};

    const cachedKey = dataset._nodeColorMapPaletteKey;
    if (dataset._nodeColorMap && cachedKey === key) {
      return dataset._nodeColorMap;
    }

    const nodes = new Set();
    (dataset.data || []).forEach((d) => {
      if (!d) return;
      const f = getFrom(d);
      const t = getTo(d);
      if (f !== undefined) nodes.add(f);
      if (t !== undefined) nodes.add(t);
    });

    const map = {};
    const nodeArray = Array.from(nodes);

    if (!palette.length) {
      palette = [FALLBACK_COLOR];
    }

    nodeArray.forEach((n, i) => {
      map[n] = palette[i % palette.length];
    });

    dataset._nodeColorMap = map;
    dataset._nodeColorMapPaletteKey = key;
    dataset._colorPalette = palette;

    return map;
  };

  const getNodeColor = (dataset, nodeKey) => {
    if (!dataset || !palette.length) return FALLBACK_COLOR;
    const map = buildNodeColorMap(dataset);
    return nodeKey !== undefined && map[nodeKey]
      ? map[nodeKey]
      : FALLBACK_COLOR;
  };

  const colorForIndex = (context, which) => {
    const ds = context?.dataset;
    const idx = typeof context?.dataIndex === 'number' ? context.dataIndex : 0;
    const link = ds?.data?.[idx];
    if (!link) return FALLBACK_COLOR;
    const k = which === 'from' ? getFrom(link) : getTo(link);
    return getNodeColor(ds, k);
  };

  // Key change: drop 'gradient' in favor of a solid mode by default
  const colorMode = ctx?.options?.colorMode || 'from';

  return {
    color: LabelColor,
    colorFrom: (ctx2) => colorForIndex(ctx2, 'from'),
    colorTo: (ctx2) => colorForIndex(ctx2, 'to'),
    hoverColorFrom: (ctx2) => colorForIndex(ctx2, 'from'),
    hoverColorTo: (ctx2) => colorForIndex(ctx2, 'to'),
    colorMode,
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
    const ds = datasets?.[0];
    if (!ds?.data?.length) return [];

    const nodes = new Set();
    ds.data.forEach((link) => {
      if (!link) return;
      const from = getFrom(link);
      const to = getTo(link);
      if (from !== undefined) nodes.add(from);
      if (to !== undefined) nodes.add(to);
    });

    return Array.from(nodes).map((n) =>
      ds.labels?.[n] ? ds.labels[n] : String(n)
    );
  })();

  return { datasets, labels: nodeLabels };
};
