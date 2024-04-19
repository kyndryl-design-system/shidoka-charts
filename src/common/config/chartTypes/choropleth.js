import colorPalettes from '../colorPalettes';

const BorderColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-background-ui-default'
  ) || '#ffffff';

export const type = 'choropleth';

export const options = (ctx) => {
  return {
    borderWidth: 0.5,
    borderColor: BorderColor,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      projection: {
        axis: 'x',
        projection: 'naturalEarth1',
      },
      x: {
        display: false,
      },
      y: {
        display: false,
      },
      color: {
        axis: 'x',
        interpolate: (value) => {
          const Colors =
            colorPalettes[ctx.options.colorPalette || 'sequential01'];
          const Index = Math.round(value * (Colors.length - 1));
          return Colors[Index];
        },
        // legend: {
        //   position: 'bottom-left',
        //   align: 'bottom',
        // },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {};
};
