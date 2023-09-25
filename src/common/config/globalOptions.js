const TooltipBgColor = getComputedStyle(
  document.documentElement
).getPropertyValue('--kd-color-background-ui-strong');

const defaultConfig = (ctx) => {
  const ExplicitSize = ctx.height !== null || ctx.width !== null;

  return {
    resizeDelay: 50, //debounce the resize
    maintainAspectRatio: !ExplicitSize,
    plugins: {
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
        titleFont: {
          weight: '400',
        },
        bodySpacing: 6,
        footerFont: {
          weight: '400',
        },
        titleMarginBottom: 8,
        footerMarginTop: 8,
        cornerRadius: 2,
        boxWidth: 16,
        boxHeight: 16,
        boxPadding: 8,
        useBorderRadius: true,
      },
      chartjs2music: {
        internal: {},
        cc: ctx.ccDiv,
      },
    },
  };
};

export default defaultConfig;
