const GridLinesColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-border-light'
  ) || '#dcdad8';

const defaultConfig = (ctx) => {
  const MultiAxis =
    ctx.options.scales && Object.keys(ctx.options.scales).length > 2;

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
          text: 'X Axis ',
          padding: 8,
        },
        ...CommonAxisOptions,
      },
      y: {
        title: {
          display: true,
          text: 'Y Axis ',
          padding: { bottom: 8, top: 0 },
        },
        ...CommonAxisOptions,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          labelColor: function (context) {
            const PerDatapointColors = Array.isArray(
              context.dataset.backgroundColor
            );
            const IsFunction =
              typeof context.dataset.backgroundColor == 'function';
            const BgColor = IsFunction
              ? context.dataset.borderColor + '80'
              : context.dataset.backgroundColor;

            return {
              borderColor: context.dataset.borderColor,
              backgroundColor: PerDatapointColors
                ? BgColor[context.dataIndex]
                : BgColor,
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
      position: 'right',
      grid: {
        drawOnChartArea: false,
        drawTicks: false,
        color: GridLinesColor,
      },
      border: {
        display: false,
      },
    };
  }

  return options;
};

export default defaultConfig;
