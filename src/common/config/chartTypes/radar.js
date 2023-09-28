import colorPalettes from '../colorPalettes';

export const type = 'radar';

export const options = (ctx) => {
  return {};
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor:
      colorPalettes[ctx.options.colorPalette || 'default'][index],
    borderColor: colorPalettes[ctx.options.colorPalette || 'default'][index],
  };
};
