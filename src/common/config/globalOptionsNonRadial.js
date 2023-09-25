const GridLinesColor = getComputedStyle(
  document.documentElement
).getPropertyValue('--kd-color-border-light');

const defaultConfig = (ctx) => {
  const MultiAxis = Object.keys(ctx.options.scales).length > 2;

  const CommonAxisOptions = {
    grid: {
      drawTicks: false,
      color: GridLinesColor,
    },
    ticks: {
      padding: 8,
    },
    border: {
      display: false,
    },
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          padding: 8,
        },
        ...CommonAxisOptions,
      },
      y: {
        title: {
          display: true,
          padding: { bottom: 8, top: 0 },
        },
        ...CommonAxisOptions,
      },
    },
  };

  if (MultiAxis) {
    const ThirdAxisId = Object.keys(ctx.options.scales)[2];

    options.scales[ThirdAxisId] = {
      title: {
        display: true,
        padding: { bottom: 8, top: 0 },
      },
      ...CommonAxisOptions,
    };
  }

  return options;
};

export default defaultConfig;
