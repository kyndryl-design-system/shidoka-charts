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
    plugins: {
      tooltip: {
        callbacks: {
          labelColor: function (context) {
            return {
              borderColor: context.dataset.borderColor,
              backgroundColor: context.dataset.backgroundColor,
              borderRadius: 2,
            };
          },
        },
      },
    },
  };

  if (MultiAxis) {
    const ThirdAxisId = Object.keys(ctx.options.scales).find(
      (scaleId) => scaleId !== 'x' && scaleId !== 'y'
    );

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
