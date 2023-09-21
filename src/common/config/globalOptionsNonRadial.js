const defaultConfig = (ctx) => {
  const IndexY = ctx.options.indexAxis === 'y';

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
          display: IndexY,
          drawTicks: false,
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
          display: !IndexY,
          drawTicks: false,
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
