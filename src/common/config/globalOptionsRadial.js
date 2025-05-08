import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

const defaultConfig = (ctx) => {
  const ArcColor = getTokenThemeVal('--kd-color-background-page-default');
  const AxisTextColor = getTokenThemeVal('--kd-color-text-level-primary');

  return {
    elements: {
      arc: {
        borderColor: ArcColor,
      },
    },
    scales: {
      r: {
        ticks: {
          color: AxisTextColor,
        },
        pointLabels: {
          color: AxisTextColor,
        },
      },
      x: {
        title: {
          text: 'X Axis ',
          color: AxisTextColor,
        },
        grid: { display: false },
        ticks: {
          display: false,
          color: AxisTextColor,
        },
        border: { display: false },
      },
      y: {
        title: {
          text: 'Y Axis ',
          color: AxisTextColor,
        },
        grid: { display: false },
        ticks: {
          display: false,
          color: AxisTextColor,
        },
        border: { display: false },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          labelColor: function (context) {
            const PerDatapointColors = Array.isArray(
              context.dataset.backgroundColor
            );

            return {
              borderColor: context.dataset.borderColor,
              backgroundColor: PerDatapointColors
                ? context.dataset.backgroundColor[context.dataIndex]
                : context.dataset.backgroundColor,
              borderRadius: 2,
            };
          },
        },
      },
    },
  };
};

export default defaultConfig;
