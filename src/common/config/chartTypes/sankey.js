import { getComputedColorPalette } from '../colorPalettes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const type = 'sankey';

export const options = () => {
  const BorderColor = getTokenThemeVal('--kd-color-background-page-default');
  return {
    plugins: { legend: { display: true } },
    borderColor: BorderColor,
  };
};

const getFrom = (d) => d?.from ?? d?.source;
const getTo = (d) => d?.to ?? d?.target;

export const datasetOptions = (ctx) => {
  const rawKey = ctx?.options?.colorPalette || 'categorical';
  const key = rawKey === 'default' ? 'categorical' : rawKey;

  let palette =
    getComputedColorPalette(key) ||
    getComputedColorPalette('categorical') ||
    [];
  // absolute last resort
  if (!Array.isArray(palette) || palette.length === 0) {
    palette = ['#6b7280', '#4b5563', '#374151', '#9ca3af']; // neutral fallback
  }

  const buildNodeColorMap = (dataset) => {
    if (dataset._nodeColorMap) return dataset._nodeColorMap;

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
    colorFrom: (ctx2) => colorForIndex(ctx2, 'from'),
    colorTo: (ctx2) => colorForIndex(ctx2, 'to'),
    hoverColorFrom: (ctx2) => colorForIndex(ctx2, 'from'),
    hoverColorTo: (ctx2) => colorForIndex(ctx2, 'to'),
    colorMode: 'gradient',
    alpha: 1,
  };
};
