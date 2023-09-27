import { sequential } from '../colorPalettes';

export const type = 'choropleth';

export const options = (ctx) => {
  return {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      projection: {
        axis: 'x',
        projection: 'albersUsa',
      },
      color: {
        axis: 'x',
        // interpolate: 'purples',
        interpolate: (value) => {
          const ColorCount = 12;
          let index = Math.round(value * (ColorCount - 1));
          return sequential['rainforest'][index];
        },
        // legend: {
        //   position: 'bottom-right',
        //   align: 'bottom',
        // },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  return {};
};
