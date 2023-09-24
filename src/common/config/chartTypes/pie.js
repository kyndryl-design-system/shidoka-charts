import colorPalettes from '../colorPalettes';

export const type = 'pie';

export const options = (ctx) => {
  return {};
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor: colorPalettes,
  };
};
