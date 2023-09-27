import colorPalettes from '../colorPalettes';

export const type = 'scatter';

export const options = (ctx) => {
  return {};
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor: colorPalettes['categorical'][index],
  };
};
