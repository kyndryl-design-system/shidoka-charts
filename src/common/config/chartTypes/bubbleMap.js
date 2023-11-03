import colorPalettes from '../colorPalettes';

export const type = 'bubbleMap';

export const options = (ctx) => {
  const Colors = colorPalettes[ctx.options.colorPalette || 'default'];

  return {
    backgroundColor: Colors[0] + '80', // 50% opacity
    borderColor: Colors[0],
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        font: {
          size: 12,
          weight: 'bold',
        },
        display: 'auto',
        align: 'end',
        anchor: 'end',
        clamp: true,
        formatter: function (value, context) {
          const label = context.dataset.data[context.dataIndex];
          return label.description;
        },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {};
};
