import { getComputedColorPalette, getColorPalette } from '../colorPalettes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const type = 'sankey';

export const options = () => {
  const BorderColor = getTokenThemeVal('--kd-color-background-page-default');

  return {
    plugins: {
      legend: {
        display: true,
      },
    },
    borderColor: BorderColor,
  };
};

export const datasetOptions = (ctx, index) => {
  const unsafeKey = ctx && ctx.options && ctx.options.colorPalette;
  const paletteKey =
    unsafeKey && getColorPalette(unsafeKey) ? unsafeKey : 'categorical';

  const palette = getComputedColorPalette(paletteKey);

  const buildNodeColorMap = (dataset) => {
    if (dataset._nodeColorMap) return dataset._nodeColorMap;

    const nodes = [];
    (dataset.data || []).forEach((d) => {
      if (!d) return;
      if (d.from !== undefined && !nodes.includes(d.from)) nodes.push(d.from);
      if (d.to !== undefined && !nodes.includes(d.to)) nodes.push(d.to);
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

  return {
    colorFrom: function (context) {
      const ds = context.dataset;
      const dataIndex =
        typeof context.dataIndex === 'number' ? context.dataIndex : 0;
      const key = ds?.data?.[dataIndex]?.from;
      return getNodeColor(ds, key);
    },
    colorTo: function (context) {
      const ds = context.dataset;
      const dataIndex =
        typeof context.dataIndex === 'number' ? context.dataIndex : 0;
      const key = ds?.data?.[dataIndex]?.to;
      return getNodeColor(ds, key);
    },
    hoverColorFrom: function (context) {
      const ds = context.dataset;
      const dataIndex =
        typeof context.dataIndex === 'number' ? context.dataIndex : 0;
      const key = ds?.data?.[dataIndex]?.from;
      return getNodeColor(ds, key);
    },
    hoverColorTo: function (context) {
      const ds = context.dataset;
      const dataIndex =
        typeof context.dataIndex === 'number' ? context.dataIndex : 0;
      const key = ds?.data?.[dataIndex]?.to;
      return getNodeColor(ds, key);
    },
    colorMode: 'gradient',
    alpha: 1,
  };
};
