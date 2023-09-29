const BgColor = getComputedStyle(document.documentElement).getPropertyValue(
  '--kd-color-background-ui-default'
);
const TooltipBgColor = getComputedStyle(
  document.documentElement
).getPropertyValue('--kd-color-background-ui-strong');

const defaultConfig = (ctx) => {
  const ExplicitSize = ctx.height !== null || ctx.width !== null;

  return {
    resizeDelay: 50, //debounce the resize
    maintainAspectRatio: !ExplicitSize,
    plugins: {
      canvasBackground: {
        color: BgColor,
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 16,
          boxHeight: 16,
          borderRadius: 2,
          useBorderRadius: true,
          padding: 8,
        },
        // onHover: handleLegendHover, // doesn't work with transparent or gradient bgs
        // onLeave: handleLegendLeave,
      },
      tooltip: {
        backgroundColor: TooltipBgColor,
        multiKeyBackground: 'transparent',
        titleFont: {
          weight: '400',
        },
        footerFont: {
          weight: '400',
        },
        titleMarginBottom: 8,
        bodySpacing: 4,
        footerMarginTop: 10,
        cornerRadius: 2,
        boxWidth: 16,
        boxHeight: 16,
        boxPadding: 4,
      },
      datalabels: {
        display: false,
      },
      chartjs2music: {
        internal: {},
        cc: ctx.ccDiv,
      },
    },
  };
};

export default defaultConfig;

/**
 * The function `handleLegendHover` updates the background and border colors of a chart legend item
 * when it is hovered over.
 * @param e - The `e` parameter is an event object that represents the event that triggered the
 * function. It can be used to access information about the event, such as the target element or the
 * event type.
 * @param item - The `item` parameter represents the legend item that was hovered over. It contains
 * information about the dataset index and the index of the hovered item within that dataset.
 * @param legend - The `legend` parameter is the legend object of a chart. It contains information
 * about the chart's legend, such as the labels and colors of the legend items.
 */
const handleLegendHover = (e, item, legend) => {
  const DatasetIndex = item.datasetIndex || 0;
  const Datasets = legend.chart.data.datasets;
  const Dataset = Datasets[DatasetIndex];
  const AlphaHexLength = 9; // includes #
  const Alpha = '4D'; // 30% opacity

  if (Array.isArray(Dataset.backgroundColor)) {
    Dataset.backgroundColor.forEach((color, index, colors) => {
      colors[index] =
        index === item.index || color.length === AlphaHexLength
          ? color
          : color + Alpha;
    });
  } else {
    Datasets.forEach((dataset, index) => {
      const backgroundColor = dataset.backgroundColor;
      const borderColor = dataset.borderColor;

      if (backgroundColor) {
        dataset.backgroundColor =
          index === DatasetIndex || backgroundColor.length === AlphaHexLength
            ? backgroundColor
            : backgroundColor + Alpha;
      }

      if (borderColor) {
        dataset.borderColor =
          index === DatasetIndex || borderColor.length === AlphaHexLength
            ? borderColor
            : borderColor + Alpha;
      }
    });
  }

  legend.chart.update();
};

/**
 * The function `handleLegendLeave` updates the background and border colors of a chart legend when the
 * mouse leaves the legend item.
 * @param e - The event object that triggered the legend leave event.
 * @param item - The `item` parameter represents the legend item that was interacted with. It contains
 * information about the dataset index and other properties related to the legend item.
 * @param legend - The `legend` parameter is the legend object of a chart. It contains information
 * about the chart's legend, such as the labels and colors of the legend items.
 */
const handleLegendLeave = (e, item, legend) => {
  const DatasetIndex = item.datasetIndex || 0;
  const Datasets = legend.chart.data.datasets;
  const Dataset = Datasets[DatasetIndex];
  const AlphaHexLength = 9;

  if (Array.isArray(Dataset.backgroundColor)) {
    Dataset.backgroundColor.forEach((color, index, colors) => {
      colors[index] =
        color.length === AlphaHexLength ? color.slice(0, -2) : color;
    });
  } else {
    Datasets.forEach((dataset) => {
      const backgroundColor = dataset.backgroundColor;
      const borderColor = dataset.borderColor;

      if (backgroundColor) {
        dataset.backgroundColor =
          backgroundColor.length === AlphaHexLength
            ? backgroundColor.slice(0, -2)
            : backgroundColor;
      }

      if (borderColor) {
        dataset.borderColor =
          borderColor.length === AlphaHexLength
            ? borderColor.slice(0, -2)
            : borderColor;
      }
    });
  }

  legend.chart.update();
};
