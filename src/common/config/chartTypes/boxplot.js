import { Chart, registerables } from 'chart.js';
import {
  BoxPlotController,
  BoxAndWiskers,
} from '@sgratzl/chartjs-chart-boxplot';
import { getComputedColorPalette } from '../colorPalettes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';
import { background } from '@storybook/theming';

Chart.register(...registerables, BoxPlotController, BoxAndWiskers);

export const type = 'boxplot';
const defaultBorderWidth = 1;

export const options = (ctx) => {
  const horizontal = ctx.options.indexAxis === 'y';
  const defaultOptions = {
    scales: {
      x: { grid: { display: horizontal } },
      y: { grid: { display: !horizontal } },
    },
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: {
        enabled: true,
        callbacks: {
          title: (items) => {
            const axisLabel = horizontal
              ? items[0].chart.options.scales.y.title?.text
              : items[0].chart.options.scales.x.title?.text;
            return axisLabel
              ? axisLabel + ': ' + items[0].label
              : items[0].label;
          },
        },
      },
    },
  };
  return { ...defaultOptions, ...(ctx.options || {}) };
};

export const datasetOptions = (ctx, index) => {
  const {
    colorPalette = 'categorical',
    backgroundAlpha = '70',
    upperBackgroundAlpha = '90',
    outlierStyle = 'circle',
    outlierRadius = 3,
    datasetOptionsOverride = {},
  } = ctx.options;

  const palette = getComputedColorPalette(colorPalette);
  const idx = index % palette.length;
  const color = palette[idx];
  const borderColor = color;
  const dataPointBackground = getTokenThemeVal(
    '--kd-color-data-viz-neutral-background-color'
  );

  return {
    backgroundColor: color + backgroundAlpha,
    borderColor: borderColor,
    borderWidth: defaultBorderWidth,
    outlierStyle,
    outlierRadius,
    outlierBorderWidth: 1.5,
    outlierBackgroundColor: 'transparent',
    outlierBorderColor: borderColor,
    meanStyle: 'circle',
    meanRadius: 3,
    meanBorderWidth: defaultBorderWidth,
    meanBackgroundColor: dataPointBackground,
    meanBorderColor: borderColor,
    lowerBackgroundColor: color + backgroundAlpha,
    upperBackgroundColor: color + upperBackgroundAlpha,
    ...datasetOptionsOverride,
  };
};

export const generateRandomData = (count, min, max, outliers = 0) => {
  const values = Array.from({ length: count }, () =>
    Math.floor(Math.random() * (max - min) + min)
  ).sort((a, b) => a - b);

  if (outliers > 0) {
    for (let i = 0; i < outliers; i++) {
      if (Math.random() > 0.5) {
        values.push(max + Math.floor(Math.random() * max * 0.5));
      } else {
        values.unshift(
          Math.max(0, min - Math.floor(Math.random() * min * 0.5))
        );
      }
    }
  }

  return values;
};
