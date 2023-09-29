import colorPalettes from '../colorPalettes';

export const type = 'line';

export const options = (ctx) => {
  const Horizontal = ctx.options.indexAxis === 'y';
  const FloatingBars = ctx.datasets.find((dataset) =>
    Array.isArray(dataset.data[0])
  );
  const Stacked = ctx.options.scales?.y?.stacked;
  // const MultiAxis = Object.keys(ctx.options.scales).length > 2;
  // const Combo = ctx.datasets.filter((dataset) => dataset.type).length > 0;

  return {
    interaction: {
      mode: Stacked ? 'index' : 'nearest',
    },
    pointRadius: 4,
    pointHoverRadius: 5,
    pointBorderWidth: 1,
    scales: {
      x: {
        grid: {
          display: FloatingBars || Horizontal,
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
  const Colors = colorPalettes[ctx.options.colorPalette || 'default'];
  const ColorCycles = Math.floor(index / (Colors.length - 1));
  const Index =
    index > Colors.length - 1
      ? index - (Colors.length - 1) * ColorCycles
      : index;

  return {
    // pointBorderColor:
    //   colorPalettes[ctx.options.colorPalette || 'default'][index],
    // backgroundColor: Colors[Index] + '80',
    pointBackgroundColor: Colors[Index] + '80',
    borderColor: Colors[index],
    backgroundColor: (context) => {
      const ctx = context.chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, Colors[Index] + '99');
      gradient.addColorStop(1, Colors[Index] + '4D');
      return gradient;
    },
    borderWidth: 2,
  };
};
