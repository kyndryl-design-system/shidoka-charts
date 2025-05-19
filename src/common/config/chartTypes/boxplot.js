import { Chart, registerables } from 'chart.js';
import {
  BoxPlotController,
  BoxAndWiskers,
} from '@sgratzl/chartjs-chart-boxplot';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';
import { getComputedColorPalette } from '../colorPalettes';

Chart.register(...registerables, BoxPlotController, BoxAndWiskers);

export const type = 'boxplot';
const defaultBorderWidth = 1;

export const options = (ctx) => ({
  scales: {
    x: { grid: { display: ctx.options.indexAxis === 'y' } },
    y: { grid: { display: ctx.options.indexAxis !== 'y' } },
  },
  plugins: {
    legend: { display: true, position: 'bottom' },
    tooltip: {
      enabled: true,
      callbacks: {
        title: (items) => {
          const axis = ctx.options.indexAxis === 'y' ? 'y' : 'x';
          const title = items[0].chart.options.scales[axis].title?.text;
          return title ? `${title}: ${items[0].label}` : items[0].label;
        },
      },
    },
  },
  ...ctx.options,
});

export const datasetOptions = (ctx, index) => {
  const {
    colorPalette = 'categorical',
    outlierStyle = 'circle',
    outlierRadius = 3,
    datasetOptionsOverride = {},
  } = ctx.options;

  const palette = getComputedColorPalette(colorPalette);
  const hex = palette[index % palette.length];
  const idxString = String(index + 1).padStart(2, '0');

  const match = colorPalette.match(/^([a-z]+?)(\d{1,2})$/i);
  const base = match ? match[1] : colorPalette;
  const num = match ? match[2].padStart(2, '0') : idxString;

  const prefix =
    colorPalette === 'categorical'
      ? `sequential-${idxString}`
      : `${base}-${num}`;

  const borderToken = `--kd-color-data-viz-${prefix}-70`;
  const lowerToken = `--kd-color-data-viz-${prefix}-40`;
  const upperToken = `--kd-color-data-viz-${prefix}-20`;

  const borderColor = getTokenThemeVal(borderToken) || hex;
  const lowerBackgroundColor = getTokenThemeVal(lowerToken) || `${hex}40`;
  const upperBackgroundColor = getTokenThemeVal(upperToken) || `${hex}20`;
  const neutralBg = getTokenThemeVal(
    '--kd-color-data-viz-neutral-background-color'
  );

  return {
    borderColor,
    borderWidth: defaultBorderWidth,
    backgroundColor: upperBackgroundColor,
    lowerBackgroundColor,
    outlierStyle,
    outlierRadius,
    outlierBorderWidth: 1.5,
    outlierBackgroundColor: 'transparent',
    outlierBorderColor: borderColor,
    meanStyle: 'circle',
    meanRadius: 3,
    meanBorderWidth: defaultBorderWidth,
    meanBackgroundColor: neutralBg,
    meanBorderColor: borderColor,
    ...datasetOptionsOverride,
  };
};

export const generateRandomData = (count, min, max, outliers = 0) => {
  const values = Array.from({ length: count }, () =>
    Math.floor(Math.random() * (max - min) + min)
  ).sort((a, b) => a - b);

  for (let i = 0; i < outliers; i++) {
    if (Math.random() > 0.5) {
      values.push(max + Math.floor(Math.random() * max * 0.5));
    } else {
      values.unshift(Math.max(0, min - Math.floor(Math.random() * min * 0.5)));
    }
  }

  return values;
};
