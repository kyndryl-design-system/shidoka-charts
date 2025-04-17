import { getLegendData } from './getLegendData';

export function renderHTMLLegend(chart, container, options = {}) {
  if (!chart || !container) return container;

  container.innerHTML = '';
  const legendItems = getLegendData(chart);
  if (!legendItems.length) return container;

  const opts = {
    className: options.className || 'shidoka-legend',
    itemClassName: options.itemClassName || 'shidoka-legend-item',
    boxWidth: options.boxWidth || 12,
    boxHeight: options.boxHeight || 12,
    borderRadius: options.borderRadius || 2,
    maxHeight: options.maxHeight || 100,
    layout: options.layout || 'horizontal',
  };

  const scrollable = document.createElement('div');
  scrollable.className = opts.className;
  scrollable.style.width = '100%';
  scrollable.style.marginTop = '8px';
  scrollable.style.maxHeight = `${opts.maxHeight}px`;
  scrollable.style.overflowY = 'auto';
  scrollable.style.boxSizing = 'border-box';

  const ul = document.createElement('ul');
  ul.className = `${opts.className}-items`;
  ul.style.display = 'flex';
  ul.style.flexWrap = 'wrap';
  ul.style.justifyContent = 'center';
  ul.style.listStyle = 'none';
  ul.style.padding = '0';
  ul.style.margin = '0';
  ul.style.flexDirection = opts.layout === 'vertical' ? 'column' : 'row';

  legendItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = opts.itemClassName;
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.marginRight = '12px';
    li.style.marginBottom = '8px';
    li.style.cursor = 'pointer';
    li.style.fontFamily = 'var(--kd-font-family-body, inherit)';
    li.style.fontSize = '12px';
    if (item.isHidden) {
      li.style.opacity = '0.5';
      li.style.textDecoration = 'line-through';
    }

    const colorBox = document.createElement('span');
    colorBox.className = `${opts.itemClassName}-color`;
    colorBox.style.width = `${opts.boxWidth}px`;
    colorBox.style.height = `${opts.boxHeight}px`;
    colorBox.style.borderRadius = `${opts.borderRadius}px`;
    colorBox.style.display = 'inline-block';
    colorBox.style.marginRight = '8px';
    if (item.needsBorder) {
      colorBox.style.backgroundColor = item.colorWithAlpha;
      colorBox.style.border = `1.5px solid ${item.color}`;
    } else {
      colorBox.style.backgroundColor = item.color;
    }

    const labelSpan = document.createElement('span');
    labelSpan.className = `${opts.itemClassName}-label`;
    labelSpan.style.fontSize = '11px';
    labelSpan.textContent = item.label;

    li.addEventListener('click', () => {
      item.toggleVisibility();
      if ('dataIndex' in item) {
        const hidden = chart.getDataVisibility(item.dataIndex) === false;
        li.style.opacity = hidden ? '0.5' : '1';
        li.style.textDecoration = hidden ? 'line-through' : 'none';
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

  scrollable.appendChild(ul);
  container.appendChild(scrollable);
  return container;
}
