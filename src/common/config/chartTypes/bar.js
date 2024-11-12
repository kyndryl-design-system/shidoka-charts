import { getComputedColorPalette } from '../colorPalettes';

export const type = 'bar';

export const options = (ctx) => {
  const Horizontal = ctx.options.indexAxis === 'y';
  const FloatingBars = ctx.datasets.find((dataset) =>
    Array.isArray(dataset.data[0])
  );
  const Stacked = ctx.options.scales?.y?.stacked;

  return {
    interaction: {
      mode: Stacked ? 'index' : 'nearest',
    },
    borderRadius: 2,
    borderSkipped: FloatingBars ? false : 'start',
    scales: {
      x: {
        grid: {
          display: FloatingBars || Horizontal,
        },
      },
      y: {
        grid: {
          display: !Horizontal,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            // add axis label to tooltip title
            const AxisLabel = Horizontal
              ? tooltipItems[0].chart.options.scales.y.title.text
              : tooltipItems[0].chart.options.scales.x.title.text;
            const Label = tooltipItems[0].label;

            return AxisLabel + ': ' + Label;
          },
          footer: (tooltipItems) => {
            // add total row
            let sum = 0;

            tooltipItems.forEach(function (tooltipItem) {
              sum += Horizontal ? tooltipItem.parsed.x : tooltipItem.parsed.y;
            });

            return Stacked ? 'Total: ' + sum : null;
          },
        },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  const Horizontal = ctx.options.indexAxis === 'y';
  const Stacked = ctx.options.scales?.y?.stacked;
  const Datasets = ctx.datasets;
  const BarDatasets = Datasets.filter((dataset) => dataset.type !== 'line');
  const Colors = getComputedColorPalette(
    ctx.options.colorPalette || 'categorical'
  );
  const ColorCycles = Math.floor(index / (Colors.length - 1));
  const Index =
    index > Colors.length - 1
      ? index - (Colors.length - 1) * ColorCycles
      : index;

  return {
    backgroundColor: Colors[Index],
    borderWidth: {
      top: !Horizontal && Stacked && index < BarDatasets.length - 1 ? 2 : 0, // stacked bars 2px gap
      right: Horizontal && Stacked && index < BarDatasets.length - 1 ? 2 : 0, // stacked bars 2px gap
      bottom: 0,
      left: 0,
    },
  };
};
