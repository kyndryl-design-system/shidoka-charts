export const options = (ctx) => {
  const FloatingBars = Array.isArray(ctx.datasets[0].data[0]);

  return {
    borderRadius: 2,
    borderSkipped: FloatingBars ? false : 'start',
  };
};

export const datasetOptions = (ctx) => {
  return {};
};
