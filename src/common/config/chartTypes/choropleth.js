import colorPalettes from '../colorPalettes';

export const type = 'choropleth';

export const options = (ctx) => {
  return {
    hoverBorderWidth: 3,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      projection: {
        axis: 'x',
        projection: 'albersUsa',
      },
      color: {
        axis: 'x',
        interpolate: (value) => {
          const Colors =
            colorPalettes[ctx.options.colorPalette || 'rainforest'];
          const Index = Math.round(value * (Colors.length - 1));
          return Colors[Index];
        },
        // legend: {
        //   position: 'bottom-right',
        //   align: 'bottom',
        // },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {};
};
