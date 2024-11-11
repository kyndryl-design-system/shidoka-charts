import { getColorPalette } from '../colorPalettes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const type = 'radar';

export const options = (ctx) => {
  const TextColor = getTokenThemeVal('--kd-color-text-primary');
  const BgColor = getTokenThemeVal('--kd-color-page-bg');
  const GridLinesColor = getTokenThemeVal('--kd-color-utility-border');

  return {
    pointRadius: 4,
    pointHoverRadius: 5,
    pointBorderWidth: 1,
    borderWidth: 2,
    scales: {
      r: {
        grid: {
          color: GridLinesColor,
        },
        angleLines: {
          color: GridLinesColor,
        },
        ticks: {
          color: TextColor,
          backdropColor: BgColor,
        },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  const Colors = getColorPalette(ctx.options.colorPalette || 'categorical');
  const ColorCycles = Math.floor(index / (Colors.length - 1));
  const Index =
    index > Colors.length - 1
      ? index - (Colors.length - 1) * ColorCycles
      : index;

  return {
    backgroundColor: Colors[Index] + '80', // 50% opacity
    borderColor: Colors[Index],
  };
};
