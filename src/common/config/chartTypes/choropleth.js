import { getComputedColorPalette } from '../colorPalettes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const type = 'choropleth';

export const options = (ctx) => {
  const BorderColor = getTokenThemeVal('--kd-color-background-page-default');

  return {
    borderWidth: 0.5,
    borderColor: BorderColor,
    plugins: {
      legend: {
        display: false,
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
      color: {
        axis: 'x',
        interpolate: (value) => {
          const Colors = getComputedColorPalette(
            ctx.options.colorPalette || 'sequential01'
          );
          const Index = Math.round(value * (Colors.length - 1));
          return Colors[Index];
        },
        // legend: {
        //   position: 'bottom-left',
        //   align: 'bottom',
        // },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {};
};
