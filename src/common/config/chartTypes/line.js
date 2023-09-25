import colorPalettes from '../colorPalettes';

export const type = 'line';

export const options = (ctx) => {
  const Horizontal = ctx.options.indexAxis === 'y';
  const FloatingBars = ctx.datasets.find((dataset) =>
    Array.isArray(dataset.data[0])
  );

  return {
    interaction: {
      mode: 'index',
    },
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

            return AxisLabel + ' ' + Label;
          },
          footer: (tooltipItems) => {
            // add total row
            let sum = 0;

            tooltipItems.forEach(function (tooltipItem) {
              sum += Horizontal ? tooltipItem.parsed.x : tooltipItem.parsed.y;
            });

            return 'Total: ' + sum;
          },
        },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor: colorPalettes[index],
    borderColor: colorPalettes[index],
  };
};
