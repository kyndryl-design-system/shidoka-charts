import { getComputedColorPalette } from '../colorPalettes';

export const type = 'meter';

export const options = () => {
  return {
    radius: '80%',
    circumference: 180,
    rotation: 270,
    aspectRatio: 1.3,
    borderWidth: 2,
    cutout: '80%',
    datasets: {
      borderWidth: 2,
      cutout: '80%',
    },
    plugins: {
      legend: {
        display: false,
      },

      datalabels: {
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
    },
  };
};

export const datasetOptions = (ctx) => {
  return {
    backgroundColor: getComputedColorPalette(
      ctx.options.colorPalette || 'statusDark'
    ),
  };
};
