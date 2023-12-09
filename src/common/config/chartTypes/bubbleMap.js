import colorPalettes from '../colorPalettes';

const BorderColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-background-ui-default'
  ) || '#ffffff';

export const type = 'bubbleMap';

export const options = (ctx) => {
  const Colors = colorPalettes[ctx.options.colorPalette || 'categorical'];

  return {
    outlineBorderWidth: 0.5,
    outlineBorderColor: BorderColor,
    outlineBackgroundColor: '#D9D7D7',
    backgroundColor: Colors[0], // + '80', // 50% opacity
    plugins: {
      legend: {
        display: false,
      },
      // datalabels: {
      //   font: {
      //     size: 12,
      //     weight: 'bold',
      //   },
      //   color: 'white',
      //   display: 'auto',
      //   align: 'center',
      //   anchor: 'center',
      //   clamp: true,
      //   formatter: function (entry) {
      //     return entry.value;
      //   },
      // },
    },
    scales: {
      projection: {
        axis: 'x',
        projection: 'naturalEarth1',
      },
      //   size: {
      //     axis: 'x',
      //     legend: {
      //       position: 'bottom-left',
      //       align: 'bottom',
      //     },
      //   },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {};
};
