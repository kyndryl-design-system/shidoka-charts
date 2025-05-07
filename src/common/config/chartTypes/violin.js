import { getComputedColorPalette } from '../colorPalettes';

export const type = 'violin';

export const options = (ctx) => {
  const Horizontal = ctx.options.indexAxis === 'y';

  return {
    scales: {
      x: {
        grid: {
          display: Horizontal,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: !Horizontal,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const AxisLabel = Horizontal
              ? tooltipItems[0].chart.options.scales.y.title.text
              : tooltipItems[0].chart.options.scales.x.title.text;
            const Label = tooltipItems[0].label;

            return AxisLabel + ': ' + Label;
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
    points: 100,
    width: 0.8,
  };
};
