import colorPalettes from '../colorPalettes';

const BackgroundColor = getComputedStyle(
  document.documentElement
).getPropertyValue('--kd-color-background-ui-default');

export const type = 'bar';

export const options = (ctx) => {
  const Horizontal = ctx.options.indexAxis === 'y';
  const FloatingBars = Array.isArray(ctx.datasets[0].data[0]);

  return {
    borderRadius: 2,
    borderSkipped: FloatingBars ? false : 'start',
    borderColor: BackgroundColor,
    scales: {
      x: {
        grid: {
          display: FloatingBars || Horizontal,
          // offset: false,
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
  const Horizontal = ctx.options.indexAxis === 'y';
  const Stacked = ctx.options.scales.y.stacked;
  const Datasets = ctx.datasets;
  const BarDatasets = Datasets.filter((dataset) => dataset.type !== 'line');

  return {
    backgroundColor: colorPalettes[index],
    borderWidth: {
      top: !Horizontal && Stacked && index < BarDatasets.length - 1 ? 2 : 0, // stacked bars 2px gap
      right: Horizontal && Stacked && index < BarDatasets.length - 1 ? 2 : 0, // stacked bars 2px gap
    },
  };
};
