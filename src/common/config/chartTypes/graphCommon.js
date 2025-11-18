import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';
import { getComputedColorPalette } from '../colorPalettes';

export const graphCommonOptions = (ctx) => {
  const labelBgColor = getTokenThemeVal(
    '--kd-color-background-container-secondary'
  );

  return {
    pointRadius: 6,
    pointHoverRadius: 7,
    pointBorderWidth: 1,
    edgeLineBorderWidth: 1,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          title: () => '',
        },
      },
      datalabels: {
        align: 'bottom',
        offset: 8,
        backgroundColor: labelBgColor,
        borderRadius: 2,
        formatter: (v) => {
          return v.name;
        },
      },
    },
    // animation: {
    //   duration: 100,
    //   easing: 'easeInOutQuart',
    //   delay: (context) => {
    //     const dataIndex = context?.dataIndex || 0;
    //     const depth = context?.raw?.depth || 0;
    //     return depth * 300 + dataIndex * 50;
    //   },
    // },
  };
};

export const graphCommonDatasetOptions = (ctx, index) => {
  const borderColor = getTokenThemeVal('--kd-color-border-level-secondary');

  const Colors = getComputedColorPalette(
    ctx.options.colorPalette || 'categorical'
  );
  const ColorCycles = Math.floor(index / (Colors.length - 1));
  const Index =
    index > Colors.length - 1
      ? index - (Colors.length - 1) * ColorCycles
      : index;

  return {
    borderColor: borderColor,
    backgroundColor: Colors[Index],
  };
};
