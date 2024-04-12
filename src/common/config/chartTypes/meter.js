import colorPalettes from '../colorPalettes';

const LabelColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-text-secondary'
  ) || '#6d6d6d';

export const type = 'meter';

export const options = () => {
  return {
    radius: '80%',
    plugins: {
      datalabels: {
        color: LabelColor,
        font: function (context) {
          var w = context.chart.width;
          return {
            size: w < 512 ? 10 : 12,
            weight: 'bold',
          };
        },
        display: 'auto',
        align: 'end',
        anchor: 'end',
        formatter: function (value, context) {
          return context.chart.data.labels[context.dataIndex];
        },
      },
      //   datalabels: {
      //     color: LabelColor,
      //     font: {
      //       size: 14,
      //     },
      //     display: 'auto',
      //     align: 'end',
      //     anchor: 'end',
      //     formatter: function (value, context) {
      //       const total = context.chart.data.datasets[0].data
      //         .filter(
      //           (dataPoint, index) =>
      //             !context.chart.legend.legendItems[index].hidden
      //         )
      //         .reduce((a, b) => a + b, 0);
      //       const percentage = Math.round((value / total + Number.EPSILON) * 100);
      //       return percentage + '%';
      //     },
      //   },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor: colorPalettes[ctx.options.colorPalette || 'categorical'],
  };
};
