const defaultConfig = (ctx) => {
  return {
    resizeDelay: 50, //debounce the resize
    plugins: {
      chartjs2music: {
        internal: {},
        cc: ctx.ccDiv,
      },
    },
  };
};

export default defaultConfig;
