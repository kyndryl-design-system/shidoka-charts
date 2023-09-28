import colorPalettes from '../colorPalettes';

export const type = 'bubbleMap';

export const options = (ctx) => {
  const Colors = colorPalettes[ctx.options.colorPalette || 'default'];

  return {
    backgroundColor: Colors[0] + '80',
    borderColor: Colors[0],
    plugins: {
      legend: {
        display: false,
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {};
};
