import colorPalettes from '../colorPalettes';

const BackgroundColor = getComputedStyle(
  document.documentElement
).getPropertyValue('--kd-color-background-ui-default');

export const type = 'bar';

export const options = (ctx) => {
  const Horizontal = ctx.options.indexAxis === 'y';
  const FloatingBars = ctx.datasets.find((dataset) =>
    Array.isArray(dataset.data[0])
  );
  const MultiAxis = Object.keys(ctx.options.scales).length > 2;
  const Combo = ctx.datasets.filter((dataset) => dataset.type).length > 0;

  return {
    interaction: {
      mode: FloatingBars || Combo || MultiAxis ? 'nearest' : 'index',
    },
    borderRadius: 2,
    borderSkipped: FloatingBars ? false : 'start',
    scales: {
      x: {
        grid: {
          display: FloatingBars || Horizontal,
          // offset: false,
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
          title: (tootltipItems) => {
            // add axis label to tooltip title
            const AxisLabel = Horizontal
              ? ctx.options.scales.y.title.text
              : ctx.options.scales.x.title.text;
            const Label = tootltipItems[0].label;

            return AxisLabel + ': ' + Label;
          },
          footer: (tooltipItems) => {
            // add total row
            let sum = 0;

            tooltipItems.forEach(function (tooltipItem) {
              sum += Horizontal ? tooltipItem.parsed.x : tooltipItem.parsed.y;
            });

            return FloatingBars || Combo || MultiAxis ? null : 'Total: ' + sum;
          },
        },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  const Horizontal = ctx.options.indexAxis === 'y';
  const Stacked = ctx.options.scales.y.stacked;
  const Datasets = ctx.datasets;
  const BarDatasets = Datasets.filter((dataset) => dataset.type !== 'line');

  return {
    backgroundColor: colorPalettes[index],
    borderWidth: {
      top: !Horizontal && Stacked && index < BarDatasets.length - 1 ? 2 : 0, // stacked bars 2px gap
      right: Horizontal && Stacked && index < BarDatasets.length - 1 ? 2 : 0, // stacked bars 2px gap
      bottom: 0,
      left: 0,
    },
  };
};
