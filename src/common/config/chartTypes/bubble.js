import colorPalettes from '../colorPalettes';

export const type = 'bubble';

export const options = (ctx) => {
  return {};
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor:
      colorPalettes[ctx.options.colorPalette || 'default'][index] + '80',
    borderColor: colorPalettes[ctx.options.colorPalette || 'default'][index],
  };
};
