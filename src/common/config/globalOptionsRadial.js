const defaultConfig = (ctx) => {
  return {
    plugins: {
      tooltip: {
        callbacks: {
          labelColor: function (context) {
            const PerDatapointColors = Array.isArray(
              context.dataset.backgroundColor
            );

            return {
              borderColor: context.dataset.borderColor,
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
