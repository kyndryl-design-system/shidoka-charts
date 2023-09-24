import colorPalettes from '../colorPalettes';

export const type = 'line';

export const options = (ctx) => {
  const Horizontal = ctx.options.indexAxis === 'y';

  return {
    scales: {
      x: {
        grid: {
          display: Horizontal,
        },
      },
      y: {
        grid: {
          display: !Horizontal,
        },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor: colorPalettes[index],
    borderColor: colorPalettes[index],
  };
};
