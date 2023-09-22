export const options = (ctx) => {
  const Horizontal = ctx.options.indexAxis === 'y';
  const FloatingBars = Array.isArray(ctx.datasets[0].data[0]);

  return {
    borderRadius: 2,
    borderSkipped: FloatingBars ? false : 'start',
    scales: {
      x: {
        grid: {
          display: FloatingBars || Horizontal,
        },
      },
      y: {
        grid: {
          display: !Horizontal,
        },
      },
    },
  };
};

export const datasetOptions = (ctx) => {
  return {};
};
