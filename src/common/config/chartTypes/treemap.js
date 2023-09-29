import colorPalettes from '../colorPalettes';

const LabelColor = getComputedStyle(document.documentElement).getPropertyValue(
  '--kd-color-text-primary'
);

export const type = 'treemap';

export const options = (ctx) => {
  return {
    plugins: {
      legend: {
        display: false,
      },
    },
    spacing: 1,
    borderWidth: 1,
    labels: {
      align: 'left',
      display: true,
      color: LabelColor,
      // color: 'white',
      // hoverColor: 'white',
      font: { size: 12 },
      position: 'top',
      overflow: 'hidden',
    },
    captions: {
      align: 'center',
      display: true,
      color: LabelColor,
      // color: 'white',
      // hoverColor: 'white',
      font: {
        size: 14,
      },
      padding: 0,
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {
    backgroundColor:
      colorPalettes[ctx.options.colorPalette || 'default'][0] + '80',
    borderColor: colorPalettes[ctx.options.colorPalette || 'default'][0],
  };
};
