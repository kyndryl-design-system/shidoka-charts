import { getComputedColorPalette } from '../colorPalettes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const type = 'polarArea';

export const options = (ctx) => {
  const TextColor = getTokenThemeVal('--kd-color-text-level-primary');
  const BgColor = getTokenThemeVal('--kd-color-background-page-default');
  const GridLinesColor = getTokenThemeVal('--kd-color-border-variants-light');

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
