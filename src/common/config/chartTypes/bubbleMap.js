import { getColorPalette } from '../colorPalettes';

const BorderColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-background-ui-default'
  ) || '#ffffff';

export const type = 'bubbleMap';

export const options = (ctx) => {
  const Colors = getColorPalette(ctx.options.colorPalette || 'categorical');

  return {
    outlineBorderWidth: 0.5,
    outlineBorderColor: BorderColor,
    outlineBackgroundColor: '#D9D7D7',
    backgroundColor: Colors[0], // + '80', // 50% opacity
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        font: {
          size: 12,
          weight: 'bold',
        },
        color: 'white',
        // display: 'auto',
        display: function (context, value) {
          const Value = context.dataset.data[context.dataIndex].value;
          const Range = context.chart.scales.size._range;
          const Avg = (Range.min + Range.max) / 2;

          return Value > Avg ? 'auto' : false;
        },
        align: 'center',
        anchor: 'center',
        formatter: function (entry) {
          return entry.value;
        },
      },
    },
    scales: {
      projection: {
        axis: 'x',
        projection: 'naturalEarth1',
      },
      x: {
        display: false,
      },
      y: {
        display: false,
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
