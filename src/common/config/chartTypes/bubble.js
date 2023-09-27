import colorPalettes from '../colorPalettes';

export const type = 'bubble';

export const options = (ctx) => {
  return {};
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor: colorPalettes['categorical'][index],
  };
};
