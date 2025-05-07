import { getComputedColorPalette } from '../colorPalettes';

export const type = 'violin';

export const options = (ctx) => {
  const horizontal = ctx.options.indexAxis === 'y';
  const {
    showLegend = true,
    showTooltip = true,
    legendPosition = 'bottom',
    gridX = horizontal,
    gridY = !horizontal,
    xAxisTitle,
    yAxisTitle,
    xAxisMin,
    xAxisMax,
    yAxisMin,
    yAxisMax,
    tooltipCallbacks,
    chartOptionsOverride = {},
  } = ctx.options;

  return {
    scales: {
      x: {
        grid: { display: gridX },
        title: xAxisTitle ? { display: true, text: xAxisTitle } : undefined,
        min: xAxisMin,
        max: xAxisMax,
      },
      y: {
        grid: { display: gridY },
        title: yAxisTitle ? { display: true, text: yAxisTitle } : undefined,
        min: yAxisMin,
        max: yAxisMax,
      },
    },
    plugins: {
      legend: { display: showLegend, position: legendPosition },
      tooltip: {
        enabled: showTooltip,
        callbacks: {
          title: (items) => {
            const axisLabel = horizontal
              ? items[0].chart.options.scales.y.title?.text
              : items[0].chart.options.scales.x.title?.text;
            return axisLabel + ': ' + items[0].label;
          },
          ...tooltipCallbacks,
        },
      },
    },
    ...chartOptionsOverride,
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
    meanStyle = 'circle',
    meanRadius = 3,
    meanBorderWidth = 1,
    pointCount = 100,
    violinWidth = 0.8,
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
    meanStyle,
    meanRadius,
    meanBorderWidth,
    meanBackgroundColor: color + backgroundAlpha,
    meanBorderColor: color,
    points: pointCount,
    width: violinWidth,
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
