const defaultConfig = (ctx) => {
  return {
    scales: {
      x: {
        title: { text: 'X Axis ' },
        grid: { display: false },
        ticks: { display: false },
        border: { display: false },
      },
      y: {
        title: { text: 'Y Axis ' },
        grid: { display: false },
        ticks: { display: false },
        border: { display: false },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          labelColor: function (context) {
            const PerDatapointColors = Array.isArray(
              context.dataset.backgroundColor
            );

            return {
              // borderColor: context.dataset.borderColor,
              backgroundColor: PerDatapointColors
                ? context.dataset.backgroundColor[context.dataIndex]
                : context.dataset.backgroundColor,
              borderRadius: 2,
            };
          },
        },
      },
    },
  };
};

export default defaultConfig;
