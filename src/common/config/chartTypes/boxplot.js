import { getComputedColorPalette } from '../colorPalettes';

export const type = 'boxplot';

export const options = (ctx) => {
  const horizontal = ctx.options.indexAxis === 'y';

  const defaultOptions = {
    scales: {
      x: {
        grid: { display: horizontal },
      },
      y: {
        grid: { display: !horizontal },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
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

  return {
    ...defaultOptions,
    ...(ctx.options || {}),
  };
};

export const datasetOptions = (ctx, index) => {
  const {
    colorPalette = 'categorical',
    backgroundAlpha = '80',
    borderWidth = 1,
    outlierStyle = 'circle',
    outlierRadius = 3,
    outlierBorderWidth = 1,
    itemStyle = 'circle',
    itemRadius = 0,
    itemBorderWidth = 0,
    lowerBackgroundAlpha = '80',
    upperBackgroundAlpha = '80',
    datasetOptionsOverride = {},
  } = ctx.options;

  const palette = getComputedColorPalette(colorPalette);
  const cycles = Math.floor(index / (palette.length - 1));
  const idx =
    index > palette.length - 1 ? index - (palette.length - 1) * cycles : index;
  const color = palette[idx];

  return {
    backgroundColor: color + backgroundAlpha,
    borderColor: color,
    borderWidth,
    outlierStyle,
    outlierRadius,
    outlierBorderWidth,
    outlierBackgroundColor: color + backgroundAlpha,
    outlierBorderColor: color,
    medianColor: color,
    meanStyle: 'circle',
    meanRadius: 3,
    meanBorderWidth: borderWidth,
    meanBackgroundColor: color + backgroundAlpha,
    meanBorderColor: color,
    itemStyle,
    itemRadius,
    itemBorderWidth,
    lowerBackgroundColor: color + lowerBackgroundAlpha,
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
