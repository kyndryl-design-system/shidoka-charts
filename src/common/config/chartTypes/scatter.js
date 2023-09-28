import colorPalettes from '../colorPalettes';

export const type = 'scatter';

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
