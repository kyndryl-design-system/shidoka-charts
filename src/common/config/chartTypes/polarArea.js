import { getComputedColorPalette } from '../colorPalettes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const type = 'polarArea';

export const options = (ctx) => {
  const TextColor = getTokenThemeVal('--kd-color-text-levels-primary');
  const BgColor = getTokenThemeVal('--kd-color-page-bg');
  const GridLinesColor = getTokenThemeVal('--kd-color-utility-border');

  return {
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
  return {
    backgroundColor: getComputedColorPalette(
      ctx.options.colorPalette || 'categorical'
    ).map(
      (color) => color + 'BF' // 75% opacity
    ),
  };
};
