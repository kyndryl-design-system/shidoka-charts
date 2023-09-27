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
          const ColorCount = 11; // 12, zero based
          let index = Math.round(value * 11);
          index = index > ColorCount ? ColorCount : index;
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
