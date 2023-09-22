import colorPalettes from '../colorPalettes';

export const options = (ctx) => {
  return {};
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor: colorPalettes[index],
    borderColor: colorPalettes[index],
  };
};
