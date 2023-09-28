import colorPalettes from '../colorPalettes';

const LabelColor = getComputedStyle(document.documentElement).getPropertyValue(
  '--kd-color-text-secondary'
);

export const type = 'doughnut';

export const options = (ctx) => {
  return {
    radius: '80%',
    plugins: {
      datalabels: {
        color: LabelColor,
        font: {
          size: 14,
        },
        display: 'auto',
        align: 'end',
        anchor: 'end',
        formatter: function (value, context) {
          const total = context.chart.data.datasets[0].data
            .filter(
              (dataPoint, index) =>
                !context.chart.legend.legendItems[index].hidden
            )
            .reduce((a, b) => a + b, 0);

          const percentage = Math.round((value / total + Number.EPSILON) * 100);

          return percentage + '%';
        },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor: colorPalettes['categorical'],
  };
};
