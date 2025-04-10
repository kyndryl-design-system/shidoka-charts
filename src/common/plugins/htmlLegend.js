/**
 * HTML Legend Generator for Chart.js
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
    boxWidth: options.boxWidth || 12,
    boxHeight: options.boxHeight || 12,
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
    chart.data.datasets.forEach((dataset) => {
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

      if (
        dataset.type === 'line' ||
        ['bubble', 'line', 'radar', 'scatter'].indexOf(chart.config.type) > -1
      ) {
        let rgba = color;

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

        colorBox.style.backgroundColor = rgba;
        colorBox.style.border =
          chart.config.type === 'bubble' || chart.config.type === 'scatter'
            ? `1.5px solid ${color}`
            : `2px solid ${color}`;
      } else {
        colorBox.style.backgroundColor = color;
      }

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
