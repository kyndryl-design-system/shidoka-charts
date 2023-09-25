const defaultConfig = (ctx) => {
  return {
    plugins: {
      tooltip: {
        callbacks: {
          labelColor: function (context) {
            return {
              backgroundColor:
                context.dataset.backgroundColor[context.dataIndex],
              borderRadius: 2,
            };
          },
        },
      },
    },
  };
};

export default defaultConfig;
