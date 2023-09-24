import colorPalettes from '../colorPalettes';

export const type = 'doughnut';

export const options = (ctx) => {
  return {};
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor: colorPalettes,
  };
};
