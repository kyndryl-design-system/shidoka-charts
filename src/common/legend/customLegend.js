import { getLegendData } from './getLegendData';

export function renderCustomLegend(chart, container, options = {}) {
  if (!chart || !container) return container;

  const legendItems = getLegendData(chart);

  if (legendItems.length === 0) return container;

  container.innerHTML = '';

  const legendOptions = {
    className: options.className || 'custom-legend',
    itemClassName: options.itemClassName || 'custom-legend-item',
    layout: options.layout || 'horizontal',
    fontSize: options.fontSize || '11px',
    boxWidth: options.boxWidth || 12,
    boxHeight: options.boxHeight || 12,
    boxMargin: options.boxMargin || 8,
  };
  const scrollableContainer = document.createElement('div');

  scrollableContainer.className = `${legendOptions.className}-container`;
  scrollableContainer.style.width = '100%';
  scrollableContainer.style.marginTop = '8px';

  const scrollContent = document.createElement('div');

  scrollContent.className = `${legendOptions.className}-scroll-content`;
  scrollContent.style.maxHeight = options.maxHeight || '100px';
  scrollContent.style.width = '100%';
  scrollContent.style.paddingRight = '8px';
  scrollContent.style.paddingLeft = '4px';
  scrollContent.style.webkitOverflowScrolling = 'touch';
  scrollContent.style.scrollbarWidth = 'thin';
  scrollContent.style.scrollbarColor = '#888 #f1f1f1';
  scrollContent.style.msOverflowStyle = 'scrollbar';
  scrollContent.style.overflowX = 'hidden';
  scrollContent.style.overflowY = 'auto';

  const ul = document.createElement('ul');

  ul.className = legendOptions.className;
  ul.style.margin = '0';
  ul.style.padding = '0px';
  ul.style.display = 'flex';
  ul.style.flexDirection =
    legendOptions.layout === 'vertical' ? 'column' : 'row';
  ul.style.flexWrap = 'wrap';
  ul.style.gap = '8px';
  ul.style.justifyContent = 'center';
  ul.style.listStyle = 'none';
  ul.style.width = '100%';

  legendItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = legendOptions.itemClassName;
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.marginRight = '12px';
    li.style.marginBottom = '8px';
    li.style.cursor = 'pointer';
    li.style.fontSize = legendOptions.fontSize;
    li.style.fontFamily = 'var(--kd-font-family-body, inherit)';

    if (item.isHidden) {
      li.style.opacity = '0.5';
      li.style.textDecoration = 'line-through';
    }

    const colorBox = document.createElement('span');

    colorBox.className = `${legendOptions.itemClassName}-color`;
    colorBox.style.width = `${legendOptions.boxWidth}px`;
    colorBox.style.height = `${legendOptions.boxHeight}px`;
    colorBox.style.borderRadius = '2px';
    colorBox.style.display = 'inline-block';
    colorBox.style.marginRight = `${legendOptions.boxMargin}px`;

    if (item.needsBorder) {
      colorBox.style.backgroundColor = item.colorWithAlpha;
      colorBox.style.border = `1.5px solid ${item.color}`;
    } else {
      colorBox.style.backgroundColor = item.color;
    }

    const labelSpan = document.createElement('span');

    labelSpan.textContent = item.label;
    li.addEventListener('click', () => {
      item.toggleVisibility();
      if ('dataIndex' in item) {
        const isCurrentlyHidden =
          chart.getDataVisibility(item.dataIndex) === false;
        li.style.opacity = isCurrentlyHidden ? '0.5' : '1';
        li.style.textDecoration = isCurrentlyHidden ? 'line-through' : 'none';
      } else {
        const meta = chart.getDatasetMeta(item.datasetIndex);
        li.style.opacity = meta.hidden ? '0.5' : '1';
        li.style.textDecoration = meta.hidden ? 'line-through' : 'none';
      }
    });
    li.appendChild(colorBox);
    li.appendChild(labelSpan);
    ul.appendChild(li);
  });

  scrollContent.appendChild(ul);
  scrollableContainer.appendChild(scrollContent);

  container.appendChild(scrollableContainer);

  if (scrollContent.scrollHeight > scrollContent.clientHeight) {
    scrollContent.style.overflowY = 'scroll';
  } else {
    scrollContent.style.overflowY = 'hidden';
  }

  return container;
}

export function renderBoxedLegend(chart, container, options = {}) {
  if (!chart || !container) return;
  const legendItems = getLegendData(chart);
  if (legendItems.length === 0) return;
  const legendOptions = {
    maxHeight: options.maxHeight || 300,
    className: 'my-custom-legend',
    itemClassName: 'my-custom-legend-item',
  };

  container.innerHTML = '';

  const scrollableContainer = document.createElement('div');

  scrollableContainer.className = `${legendOptions.className}-container`;
  scrollableContainer.style.width = '100%';
  scrollableContainer.style.marginTop = '8px';

  const scrollContent = document.createElement('div');

  scrollContent.className = `${legendOptions.className}-scroll-content`;
  scrollContent.style.maxHeight = `${legendOptions.maxHeight}px`;
  scrollContent.style.width = '100%';
  scrollContent.style.paddingRight = '8px';
  scrollContent.style.paddingLeft = '4px';
  scrollContent.style.webkitOverflowScrolling = 'touch';
  scrollContent.style.scrollbarWidth = 'thin';
  scrollContent.style.scrollbarColor = '#888 #f1f1f1';
  scrollContent.style.msOverflowStyle = 'scrollbar';
  scrollContent.style.overflowX = 'hidden';
  scrollContent.style.overflowY = 'auto';

  const ul = document.createElement('ul');

  ul.className = legendOptions.className;
  ul.style.margin = '0';
  ul.style.padding = '0';
  ul.style.display = 'flex';
  ul.style.flexWrap = 'wrap';
  ul.style.gap = '8px';
  ul.style.justifyContent = 'center';
  ul.style.listStyle = 'none';
  ul.style.width = '100%';

  legendItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = legendOptions.itemClassName;
    if (item.isHidden) {
      li.classList.add('hidden');
    }
    const colorBox = document.createElement('span');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = item.color;
    const label = document.createTextNode(item.label);
    li.addEventListener('click', () => {
      item.toggleVisibility();
      if (item.isHidden) {
        li.classList.add('hidden');
      } else {
        li.classList.remove('hidden');
      }
    });
    li.appendChild(colorBox);
    li.appendChild(label);
    ul.appendChild(li);
  });

  scrollContent.appendChild(ul);
  scrollableContainer.appendChild(scrollContent);
  container.appendChild(scrollableContainer);

  if (scrollContent.scrollHeight > scrollContent.clientHeight) {
    scrollContent.style.overflowY = 'scroll';
  } else {
    scrollContent.style.overflowY = 'hidden';
  }
}
