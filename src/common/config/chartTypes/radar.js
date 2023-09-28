import colorPalettes from '../colorPalettes';

export const type = 'radar';

export const options = (ctx) => {
  return {
    pointRadius: 4,
    pointHoverRadius: 5,
    pointBorderWidth: 1,
    borderWidth: 2,
  };
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor:
      colorPalettes[ctx.options.colorPalette || 'default'][index] + '80',
    borderColor: colorPalettes[ctx.options.colorPalette || 'default'][index],
  };
};
