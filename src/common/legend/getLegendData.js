/**
 * Generates legend data from a Chart.js chart instance without any DOM manipulation.
 * This function extracts the necessary data to build a custom legend.
 *
 * @param {Chart} chart - The Chart.js chart instance
 * @returns {Array} An array of legend items with properties for rendering
 */
export function getLegendData(chart) {
  if (!chart) return [];

  const legendItems = [];
  const showLegendChartTypes = [
    'bar',
    'line',
    'pie',
    'doughnut',
    'polarArea',
    'radar',
    'scatter',
    'bubble',
  ];

  if (!showLegendChartTypes.includes(chart.config.type)) {
    return [];
  }

  if (chart.config.type === 'doughnut') {
    const hasMeterProperties = chart.data.datasets.some(
      (dataset) => 'needleValue' in dataset
    );
    if (hasMeterProperties) {
      return [];
    }
  }

  function shouldUseLabelBasedLegend(chart) {
    const labelBasedChartTypes = ['pie', 'doughnut', 'polarArea'];

    if (
      labelBasedChartTypes.includes(chart.config.type) &&
      chart.data.labels &&
      chart.data.labels.length
    ) {
      return true;
    }

    if (
      chart.data.labels &&
      chart.data.labels.length &&
      !chart.data.datasets.some((ds) => ds.label)
    ) {
      return true;
    }

    return false;
  }

  if (shouldUseLabelBasedLegend(chart)) {
    const dataset = chart.data.datasets[0];

    chart.data.labels.forEach((label, index) => {
      let color;
      if (dataset) {
        const bgColor = dataset.backgroundColor;

        if (Array.isArray(bgColor)) {
          color = bgColor[index % bgColor.length];
        } else if (typeof bgColor === 'function') {
          color = '#ccc';
        } else {
          color = bgColor;
        }
      } else {
        color = '#ccc';
      }

      legendItems.push({
        label,
        color,
        dataIndex: index,
        isHidden: chart.getDataVisibility(index) === false,
        // Function to toggle visibility
        toggleVisibility: () => {
          chart.toggleDataVisibility(index);
          chart.update();
        },
      });
    });
  } else {
    chart.data.datasets.forEach((dataset) => {
      if (!dataset.label) return;

      const index = chart.data.datasets.indexOf(dataset);
      const meta = chart.getDatasetMeta(index);

      let color;
      if (
        (chart.config.type === 'line' || dataset.type === 'line') &&
        dataset.borderColor
      ) {
        const borderColor = dataset.borderColor;
        color = Array.isArray(borderColor)
          ? borderColor[0]
          : typeof borderColor === 'function'
          ? '#ccc'
          : borderColor;
      } else {
        const bgColor =
          dataset.backgroundColor || dataset.borderColor || '#ccc';
        color = Array.isArray(bgColor)
          ? bgColor[0]
          : typeof bgColor === 'function'
          ? '#ccc'
          : bgColor;
      }

      let rgba = color;

      if (
        dataset.type === 'line' ||
        ['bubble', 'line', 'radar', 'scatter'].indexOf(chart.config.type) > -1
      ) {
        if (color.startsWith('#')) {
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          rgba = `rgba(${r}, ${g}, ${b}, 0.4)`;
        } else if (color.startsWith('rgb(')) {
          rgba = color.replace('rgb(', 'rgba(').replace(')', ', 0.4)');
        } else if (color.startsWith('rgba(')) {
          rgba = color.replace(/[\d.]+\)$/, '0.4)');
        }
      }

      const chartType = dataset.type || chart.config.type;
      const needsBorder =
        chartType === 'bubble' ||
        chartType === 'scatter' ||
        chartType === 'line' ||
        chartType === 'radar';

      legendItems.push({
        label: dataset.label,
        color,
        colorWithAlpha: rgba,
        datasetIndex: index,
        isHidden: meta.hidden,
        needsBorder,
        chartType,
        toggleVisibility: () => {
          meta.hidden = !meta.hidden;
          chart.update();
        },
      });
    });
  }

  return legendItems;
}
