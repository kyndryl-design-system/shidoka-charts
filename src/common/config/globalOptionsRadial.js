import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

const defaultConfig = (ctx) => {
  const ArcColor = getTokenThemeVal('--kd-color-background-page-default');
  const AxisTextColor = getTokenThemeVal('--kd-color-text-level-primary');

  const scales = {
    x: {
      title: { text: 'X Axis', color: AxisTextColor },
      grid: { display: false },
      ticks: { display: false, color: AxisTextColor },
      border: { display: false },
    },
    y: {
      title: { text: 'Y Axis', color: AxisTextColor },
      grid: { display: false },
      ticks: { display: false, color: AxisTextColor },
      border: { display: false },
    },
  };

  const chartType = ctx.type || ctx.chart?.config.type;
  if (chartType === 'radar' || chartType === 'polarArea') {
    scales.r = {
      grid: { display: true },
      angleLines: { display: true },
      ticks: { color: AxisTextColor },
      pointLabels: { color: AxisTextColor },
    };
  }

  return {
    elements: {
      arc: { borderColor: ArcColor },
    },
    scales,
    plugins: {
      tooltip: {
        callbacks: {
          labelColor(context) {
            const bg = context.dataset.backgroundColor;
            const perPoint = Array.isArray(bg);
            return {
              borderColor: context.dataset.borderColor,
              backgroundColor: perPoint ? bg[context.dataIndex] : bg,
              borderRadius: 2,
            };
          },
        },
      },
    },
  };
};

export default defaultConfig;
