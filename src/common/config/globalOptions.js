const defaultConfig = (ctx) => {
  const ExplicitSize = ctx.height !== null || ctx.width !== null;
  console.log(ExplicitSize);

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
      chartjs2music: {
        internal: {},
        cc: ctx.ccDiv,
      },
    },
  };
};

export default defaultConfig;
