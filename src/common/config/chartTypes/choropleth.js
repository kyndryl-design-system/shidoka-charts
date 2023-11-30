import colorPalettes from '../colorPalettes';

export const type = 'choropleth';

export const options = (ctx) => {
  return {
    hoverBorderWidth: 3,
    showOutline: false,
    showGraticule: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    // -- if required in future --- //
    //     datalabels: {
    //       font: {
    //         size: 12,
    //         weight: 'bold',
    //       },
    //       display: 'auto',
    //       align: 'end',
    //       anchor: 'end',
    //       formatter: function (value, context) {
    //         const label = context.dataset.data[context.dataIndex];
    //         return label.value.toFixed(3);
    //       },
    //     },
    scales: {
      projection: {
        axis: 'x',
        projection: 'naturalEarth1',
      },
      color: {
        axis: 'x',
        interpolate: (value) => {
          const Colors =
            colorPalettes[ctx.options.colorPalette || 'categorical'];
          const Index = Math.round(value * (Colors.length - 1));
          return Colors[Index];
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
