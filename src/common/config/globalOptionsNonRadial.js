const GridLinesColor = getComputedStyle(
  document.documentElement
).getPropertyValue('--kd-color-border-light');

const defaultConfig = (ctx) => {
  return {
    plugins: {
      legend: {
        align: 'start',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          padding: 16,
        },
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
      },
      y: {
        title: {
          display: true,
          padding: 16,
        },
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
      },
    },
  };
};

export default defaultConfig;
