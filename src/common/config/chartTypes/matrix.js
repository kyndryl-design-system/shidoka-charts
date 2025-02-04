export const type = 'matrix';

export const options = (ctx) => {
  return {
    plugins: {
      tooltip: {
        callbacks: {
          title() {
            return '';
          },
          label(context) {
            const houses = ['', 'Stark', 'Lannister', 'Targaryen'];
            const v = context.dataset.data[context.dataIndex];
            const house1 = houses[v.x];
            const house2 = houses[v.y];
            if (v.x === v.y) {
              return [`${house1} House`, 'Internal Alliance'];
            }
            if ((v.x === 1 && v.y === 3) || (v.x === 3 && v.y === 1)) {
              return [`${house1} - ${house2}`, 'External Alliance'];
            }
            return [`${house1} - ${house2}`, 'Enemies'];
          },
        },
      },
    },
    scales: {
      x: {
        min: 0.5,
        max: 3.5,
        offset: false,
      },
      y: {
        min: 0.5,
        max: 3.5,
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
    width: ({ chart }) => (chart.chartArea || {}).width / 3 - 1,
    height: ({ chart }) => (chart.chartArea || {}).height / 3 - 1,
  };
};
