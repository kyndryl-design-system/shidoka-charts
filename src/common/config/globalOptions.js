const BgColor = getComputedStyle(document.documentElement).getPropertyValue(
  '--kd-color-background-ui-default'
);
const TooltipBgColor = getComputedStyle(
  document.documentElement
).getPropertyValue('--kd-color-background-ui-strong');

const defaultConfig = (ctx) => {
  const ExplicitSize = ctx.height !== null || ctx.width !== null;

  return {
    resizeDelay: 50, //debounce the resize
    maintainAspectRatio: !ExplicitSize,
    plugins: {
      canvasBackground: {
        color: BgColor,
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 16,
          boxHeight: 16,
          borderRadius: 2,
          useBorderRadius: true,
          padding: 8,
        },
      },
      tooltip: {
        backgroundColor: TooltipBgColor,
        multiKeyBackground: 'transparent',
        titleFont: {
          weight: '400',
        },
        footerFont: {
          weight: '400',
        },
        titleMarginBottom: 8,
        bodySpacing: 4,
        footerMarginTop: 10,
        cornerRadius: 2,
        boxWidth: 16,
        boxHeight: 16,
        boxPadding: 4,

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
      chartjs2music: {
        internal: {},
        cc: ctx.ccDiv,
      },
    },
  };
};

export default defaultConfig;
