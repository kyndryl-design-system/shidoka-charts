import { getComputedColorPalette } from '../colorPalettes';

export const type = 'pie';

export const options = () => {
  return {
    radius: '80%',
    plugins: {
      datalabels: {
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
                !context.chart.legend.legendItems[index]?.hidden
            )
            .reduce((a, b) => a + b, 0);

          const percentage =
            Math.round((value / total + Number.EPSILON) * 100) + '%';

          return !total ? '' : percentage;
        },
      },
    },
  };
};

export const datasetOptions = (ctx) => {
  return {
    backgroundColor: getComputedColorPalette(
      ctx.options.colorPalette || 'categorical'
    ),
  };
};
