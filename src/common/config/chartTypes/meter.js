import colorPalettes from '../colorPalettes';

const LabelColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-text-secondary'
  ) || '#6d6d6d';

export const type = 'meter';

export const options = (ctx) => {
  return {
    radius: '80%',
    plugins: {},
  };
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor: colorPalettes[ctx.options.colorPalette || 'categorical'],
  };
};
