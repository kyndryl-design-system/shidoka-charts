import colorPalettes from '../colorPalettes';

export const type = 'line';

export const options = (ctx) => {
  const Horizontal = ctx.options.indexAxis === 'y';
  const FloatingBars = ctx.datasets.find((dataset) =>
    Array.isArray(dataset.data[0])
  );
  const Stacked = ctx.options.scales.y.stacked;
  // const MultiAxis = Object.keys(ctx.options.scales).length > 2;
  // const Combo = ctx.datasets.filter((dataset) => dataset.type).length > 0;

  return {
    interaction: {
      mode: Stacked ? 'index' : 'nearest',
    },
    pointRadius: 8,
    pointHoverRadius: 9,
    pointBorderWidth: 0,
    pointBorderColor: 'transparent',
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

            return Stacked ? 'Total: ' + sum : null;
          },
        },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor:
      colorPalettes[ctx.options.colorPalette || 'default'][index],
    borderColor: colorPalettes[ctx.options.colorPalette || 'default'][index],
    borderWidth: 2,
  };
};
