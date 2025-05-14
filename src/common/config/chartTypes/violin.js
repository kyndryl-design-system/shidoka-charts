import Chart from 'chart.js/auto';
import { getComputedColorPalette } from '../colorPalettes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';
import {
  BoxPlotController,
  BoxAndWiskers,
  ViolinController,
} from '@sgratzl/chartjs-chart-boxplot';

Chart.register(BoxPlotController, BoxAndWiskers, ViolinController);

export const type = 'violin';
export const defaultBorderWidth = 1;
const borderColor = getTokenThemeVal('--kd-color-border-level-primary');
const meanMedianOutlierBackgroundColor = getTokenThemeVal(
  '--kd-color-background-container-default'
);

export const options = (ctx) => {
  const horizontal = ctx.options?.indexAxis === 'y';

  return {
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
              ? `${axisLabel}: ${items[0].label}`
              : items[0].label;
          },
        },
      },
    },
    elements: {
      violin: {
        borderWidth: defaultBorderWidth,
      },
      boxplot: {
        borderWidth: defaultBorderWidth,
        backgroundColor: meanMedianOutlierBackgroundColor,
        lowerBackgroundColor: meanMedianOutlierBackgroundColor,
        upperBackgroundColor: meanMedianOutlierBackgroundColor,
        medianStyle: 'circle',
        medianRadius: 6,
        medianBorderWidth: defaultBorderWidth,
        medianBorderColor: borderColor,
        medianBackgroundColor: meanMedianOutlierBackgroundColor,
      },
    },
    ...ctx.options,
  };
};

export const datasetOptions = (ctx, index) => {
  const {
    colorPalette = 'categorical',
    backgroundAlpha = '95',
    pointCount = 100,
    violinWidth = 0.8,
    datasetOptionsOverride = {},
  } = ctx.options || {};

  const palette = getComputedColorPalette(colorPalette);
  const fill = palette[index % palette.length] + backgroundAlpha;
  const mainBorder = palette[index % palette.length];

  return {
    backgroundColor: fill,
    borderColor: mainBorder,
    borderWidth: defaultBorderWidth,
    meanStyle: 'circle',
    meanRadius: 4,
    meanBorderWidth: defaultBorderWidth,
    meanBorderColor: borderColor,
    meanBackgroundColor: meanMedianOutlierBackgroundColor,
    points: pointCount,
    width: violinWidth,
    lowerBackgroundColor: meanMedianOutlierBackgroundColor,
    upperBackgroundColor: meanMedianOutlierBackgroundColor,
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
