import { getComputedColorPalette } from '../colorPalettes';

export const type = 'boxplot';

export const options = (ctx) => {
  const horizontal = ctx.options.indexAxis === 'y';

  return {
    scales: {
      x: {
        grid: {
          display: horizontal,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: !horizontal,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const axisLabel = horizontal
              ? tooltipItems[0].chart.options.scales.y.title.text
              : tooltipItems[0].chart.options.scales.x.title.text;
            const label = tooltipItems[0].label;

            return axisLabel + ': ' + label;
          },
        },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  const Colors = getComputedColorPalette(
    ctx.options.colorPalette || 'categorical'
  );
  const ColorCycles = Math.floor(index / (Colors.length - 1));
  const Index =
    index > Colors.length - 1
      ? index - (Colors.length - 1) * ColorCycles
      : index;

  return {
    backgroundColor: Colors[Index] + '80',
    borderColor: Colors[Index],
    borderWidth: 1,
    outlierStyle: 'circle',
    outlierRadius: 3,
    outlierBorderWidth: 1,
    outlierBackgroundColor: Colors[Index] + '80',
    outlierBorderColor: Colors[Index],
    medianColor: Colors[Index],
    meanStyle: 'circle',
    meanRadius: 3,
    meanBorderWidth: 1,
    meanBackgroundColor: Colors[Index] + '80',
    meanBorderColor: Colors[Index],
    itemStyle: 'circle',
    itemRadius: 0,
    itemBorderWidth: 0,
    lowerBackgroundColor: Colors[Index] + '80',
    upperBackgroundColor: Colors[Index] + '80',
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
