import { getComputedColorPalette } from '../colorPalettes';

const LabelColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-text-primary'
  ) || '#3d3c3c';

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
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor: getComputedColorPalette(
      ctx.options.colorPalette || 'rag03'
    ),
  };
};
