import { getComputedColorPalette } from '../colorPalettes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const type = 'radar';

export const options = (ctx) => {
  const TextColor = getTokenThemeVal('--kd-color-text-level-primary');
  const BgColor = getTokenThemeVal('--kd-color-background-page-default');
  const GridLinesColor = getTokenThemeVal('--kd-color-border-variants-light');

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
  const Colors = getComputedColorPalette(
    ctx.options.colorPalette || 'categorical'
  );
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
