/**
 * HTML Legend Generator for Chart.js
 *
 * Creates a scrollable HTML legend that uses the chart's labels instead of dataset titles.
 * Can be used as a replacement for the default Chart.js canvas-based legend.
 */

/**
 * Creates a scrollable HTML legend for a Chart.js chart
 *
 * @param {Object} chart - The Chart.js chart instance
 * @param {HTMLElement} container - The container element to place the legend
 * @param {Object} options - Configuration options for the legend
 * @param {number} options.maxHeight - Maximum height for the legend container (px)
 * @param {number} options.boxWidth - Width of the color boxes (px)
 * @param {number} options.boxHeight - Height of the color boxes (px)
 * @param {number} options.borderRadius - Border radius of the color boxes (px)
 */
/**
 * Determines whether to use labels or datasets for the legend
 * @param {Object} chart - The Chart.js chart instance
 * @returns {boolean} True if labels should be used, false if datasets should be used
 */
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

export function generateScrollableLegend(chart, container, options = {}) {
  if (!chart || !container) return;

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
    container.innerHTML = '';
    return;
  }

  if (chart.config.type === 'doughnut') {
    const hasMeterProperties = chart.data.datasets.some(
      (dataset) => 'needleValue' in dataset
    );
    if (hasMeterProperties) {
      container.innerHTML = '';
      return;
    }
  }

  container.innerHTML = '';

  const legendOptions = {
    maxHeight: options.maxHeight || 100,
    boxWidth: options.boxWidth || 16,
    boxHeight: options.boxHeight || 16,
    borderRadius: options.borderRadius || 2,
  };

  const scrollableContainer = document.createElement('div');
  scrollableContainer.className = 'scrollable-legend';

  scrollableContainer.style.maxHeight = `${legendOptions.maxHeight}px`;
  scrollableContainer.style.overflowY = 'auto';
  scrollableContainer.style.display = 'flex';
  scrollableContainer.style.flexWrap = 'wrap';
  scrollableContainer.style.justifyContent = 'center';
  scrollableContainer.style.marginTop = '8px';

  const ul = document.createElement('ul');
  ul.className = 'legend-items';
  ul.style.margin = '0';
  ul.style.padding = '0';
  ul.style.display = 'flex';
  ul.style.flexWrap = 'wrap';
  ul.style.justifyContent = 'center';
  ul.style.listStyle = 'none';
  ul.style.width = '100%';

  if (shouldUseLabelBasedLegend(chart)) {
    const dataset = chart.data.datasets[0];

    chart.data.labels.forEach((label, index) => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.marginRight = '12px';
      li.style.marginBottom = '8px';
      li.style.cursor = 'pointer';

      const colorBox = document.createElement('span');
      colorBox.style.width = `${legendOptions.boxWidth}px`;
      colorBox.style.height = `${legendOptions.boxHeight}px`;
      colorBox.style.borderRadius = `${legendOptions.borderRadius}px`;
      colorBox.style.display = 'inline-block';
      colorBox.style.marginRight = '8px';

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

      colorBox.style.backgroundColor = color;

      const text = document.createTextNode(label);

      li.appendChild(colorBox);
      li.appendChild(text);

      li.addEventListener('click', () => {
        const isCurrentlyHidden = chart.getDataVisibility(index) === false;

        chart.toggleDataVisibility(index);

        if (!isCurrentlyHidden) {
          li.style.opacity = '0.5';
          li.style.textDecoration = 'line-through';
        } else {
          li.style.opacity = '1';
          li.style.textDecoration = 'none';
        }

        chart.update();
      });

      ul.appendChild(li);
    });
  } else {
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      if (!dataset.label) return;

      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.marginRight = '12px';
      li.style.marginBottom = '8px';
      li.style.cursor = 'pointer';

      const colorBox = document.createElement('span');
      colorBox.style.width = `${legendOptions.boxWidth}px`;
      colorBox.style.height = `${legendOptions.boxHeight}px`;
      colorBox.style.borderRadius = `${legendOptions.borderRadius}px`;
      colorBox.style.display = 'inline-block';
      colorBox.style.marginRight = '8px';

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

      colorBox.style.backgroundColor = color;

      const text = document.createTextNode(dataset.label);

      li.appendChild(colorBox);
      li.appendChild(text);

      li.addEventListener('click', () => {
        const index = chart.data.datasets.indexOf(dataset);
        const meta = chart.getDatasetMeta(index);

        meta.hidden = !meta.hidden;

        if (meta.hidden) {
          li.style.opacity = '0.5';
          li.style.textDecoration = 'line-through';
        } else {
          li.style.opacity = '1';
          li.style.textDecoration = 'none';
        }

        chart.update();
      });

      ul.appendChild(li);
    });
  }

  scrollableContainer.appendChild(ul);
  container.appendChild(scrollableContainer);
}
