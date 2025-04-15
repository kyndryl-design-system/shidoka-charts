/**
 * Default HTML renderer for Chart.js legends
 * Provides a starting point for developers to create custom legends
 */

import { getLegendData } from './getLegendData';

export function renderHTMLLegend(chart, container, options = {}) {
  if (!chart || !container) return container;

  container.innerHTML = '';

  const legendItems = getLegendData(chart);
  if (legendItems.length === 0) return container;

  const legendOptions = {
    maxHeight: options.maxHeight || 100,
    boxWidth: options.boxWidth || 12,
    boxHeight: options.boxHeight || 12,
    borderRadius: options.borderRadius || 2,
    className: options.className || 'shidoka-legend',
    itemClassName: options.itemClassName || 'shidoka-legend-item',
    layout: options.layout || 'horizontal',
  };

  const scrollableContainer = document.createElement('div');
  scrollableContainer.className = legendOptions.className;

  scrollableContainer.setAttribute('tabindex', '0');
  scrollableContainer.setAttribute('role', 'group');
  scrollableContainer.setAttribute('aria-label', 'Chart legend');

  scrollableContainer.style.display = 'flex';
  scrollableContainer.style.flexWrap = 'wrap';
  scrollableContainer.style.justifyContent = 'center';
  scrollableContainer.style.marginTop = '8px';
  scrollableContainer.style.width = '100%';

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

  const ul = document.createElement('ul');
  ul.className = `${legendOptions.className}-items`;
  ul.style.margin = '0';
  ul.style.padding = '0';
  ul.style.display = 'flex';
  ul.style.flexDirection =
    legendOptions.layout === 'vertical' ? 'column' : 'row';
  ul.style.flexWrap = 'wrap';
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
    li.style.fontSize = '12px';
    li.style.fontFamily = 'var(--kd-font-family-body, inherit)';

    if (item.isHidden) {
      li.style.opacity = '0.5';
      li.style.textDecoration = 'line-through';
    }

    const colorBox = document.createElement('span');
    colorBox.className = `${legendOptions.itemClassName}-color`;
    colorBox.style.width = `${legendOptions.boxWidth}px`;
    colorBox.style.height = `${legendOptions.boxHeight}px`;
    colorBox.style.borderRadius = `${legendOptions.borderRadius}px`;
    colorBox.style.display = 'inline-block';
    colorBox.style.marginRight = '8px';

    if (item.needsBorder) {
      colorBox.style.backgroundColor = item.colorWithAlpha;
      colorBox.style.border = `1.5px solid ${item.color}`;
    } else {
      colorBox.style.backgroundColor = item.color;
    }

    const labelSpan = document.createElement('span');
    labelSpan.className = `${legendOptions.itemClassName}-label`;
    labelSpan.style.fontSize = '11px';
    labelSpan.style.fontFamily = 'var(--kd-font-family-body, inherit)';
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

  setTimeout(() => {
    if (scrollContent.scrollHeight > scrollContent.clientHeight) {
      scrollContent.style.overflowY = 'scroll';
    } else {
      scrollContent.style.overflowY = 'hidden';
    }
  }, 0);

  return container;
}
