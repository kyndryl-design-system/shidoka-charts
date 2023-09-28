import colorPalettes from '../colorPalettes';

export const type = 'polarArea';

export const options = (ctx) => {
  return {};
};

export const datasetOptions = (ctx, index) => {
  return {
    // backgroundColor: colorPalettes[ctx.options.colorPalette || 'default'],
    backgroundColor: colorPalettes[ctx.options.colorPalette || 'default'].map(
      (color) => color + 'BF'
    ),
  };
};
