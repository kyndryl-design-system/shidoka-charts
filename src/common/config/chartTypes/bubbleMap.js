import { getComputedColorPalette } from '../colorPalettes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const type = 'bubbleMap';

export const options = (ctx) => {
  const BorderColor = getTokenThemeVal('--kd-color-background-page-default');
  const LabelColor = getTokenThemeVal('--kd-color-text-variant-inversed');
  const Colors = getComputedColorPalette(
    ctx.options.colorPalette || 'categorical'
  );
  const BubbleColor = getTokenThemeVal('--kd-color-data-viz-level-secondary');

  return {
    outlineBorderWidth: 0.5,
    outlineBorderColor: BorderColor,
    outlineBackgroundColor: BubbleColor,
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
        color: LabelColor,
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
