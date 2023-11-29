import colorPalettes from '../colorPalettes';

export const type = 'polarArea';

export const options = (ctx) => {
  return {};
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor: colorPalettes[
      ctx.options.colorPalette || 'categorical'
    ].map(
      (color) => color + 'BF' // 75% opacity
    ),
  };
};
