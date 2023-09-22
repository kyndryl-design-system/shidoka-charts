export const options = (ctx) => {
  return {
    plugins: {
      legend: {
        display: false,
      },
    },
    labels: {
      align: 'left',
      display: true,
      color: 'white',
      hoverColor: 'white',
      font: { size: 12 },
      position: 'top',
      overflow: 'hidden',
    },
    captions: {
      align: 'center',
      display: true,
      color: 'white',
      hoverColor: 'white',
      font: {
        size: 14,
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {};
};
