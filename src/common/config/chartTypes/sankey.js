import { getComputedColorPalette } from '../colorPalettes';
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

export const datasetOptions = (ctx) => {
  const paletteKey =
    ctx && ctx.options && ctx.options.colorPalette
      ? ctx.options.colorPalette
      : 'categorical';
  let palette;
  try {
    palette = getComputedColorPalette(paletteKey);
  } catch (e) {
    palette = getComputedColorPalette('categorical');
  }

  const getNodeColor = (dataset, key) => {
    if (!dataset._nodeColorMap) {
      const nodes = [];
      (dataset.data || []).forEach((d) => {
        if (d && d.from !== undefined && !nodes.includes(d.from))
          nodes.push(d.from);
        if (d && d.to !== undefined && !nodes.includes(d.to)) nodes.push(d.to);
      });
      const map = {};
      nodes.forEach((n, i) => {
        map[n] = palette[i % palette.length];
      });
      dataset._nodeColorMap = map;
    }
    return dataset._nodeColorMap[key] || palette[0];
  };

  return {
    colorFrom: function (context) {
      const ds = context.dataset;
      const dataIndex = context.dataIndex ?? 0;
      const key = ds.data?.[dataIndex]?.from;
      return getNodeColor(ds, key);
    },
    colorTo: function (context) {
      const ds = context.dataset;
      const dataIndex = context.dataIndex ?? 0;
      const key = ds.data?.[dataIndex]?.to;
      return getNodeColor(ds, key);
    },
    hoverColorFrom: function (context) {
      const ds = context.dataset;
      const dataIndex = context.dataIndex ?? 0;
      const key = ds.data?.[dataIndex]?.from;
      return getNodeColor(ds, key);
    },
    hoverColorTo: function (context) {
      const ds = context.dataset;
      const dataIndex = context.dataIndex ?? 0;
      const key = ds.data?.[dataIndex]?.to;
      return getNodeColor(ds, key);
    },
    colorMode: 'gradient',
    alpha: 1,
  };
};
