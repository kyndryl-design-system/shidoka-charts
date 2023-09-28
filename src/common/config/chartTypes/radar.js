import colorPalettes from '../colorPalettes';

export const type = 'radar';

export const options = (ctx) => {
  return {};
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor: colorPalettes['default'][index],
    borderColor: colorPalettes['default'][index],
  };
};
