import { getLegendData } from './getLegendData';

const defaultOpts = {
  className: 'shidoka-legend',
  itemClassName: 'shidoka-legend-item',
  boxWidth: 14,
  boxHeight: 14,
  borderRadius: 2,
  maxHeight: 100,
  layout: 'horizontal',
  fontSize: '12px',
  boxMargin: 8,
};

function applyStyles(el, styles) {
  Object.assign(el.style, styles);
}

export function renderHTMLLegend(chart, container, options) {
  if (!chart || !container) return container;

  container.innerHTML = '';
  const items = getLegendData(chart);
  if (!items.length) return container;

  const opts = { ...defaultOpts, ...options };

  const scrollableContainer = document.createElement('div');
  scrollableContainer.className = `${opts.className}-container`;
  applyStyles(scrollableContainer, {
    width: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
    marginRight: 'auto',
    marginLeft: 'auto',
    maxHeight: `${opts.maxHeight}px`,
    overflowY: 'auto',
    boxSizing: 'border-box',
  });
  scrollableContainer.tabIndex = 0;
  scrollableContainer.setAttribute('role', 'region');
  scrollableContainer.setAttribute('aria-label', 'Chart legend items');
  scrollableContainer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      scrollableContainer.scrollTop += 40;
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      scrollableContainer.scrollTop -= 40;
      e.preventDefault();
    }
  });

  const ul = document.createElement('ul');
  ul.className = `${opts.className}-items`;
  applyStyles(ul, {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    listStyle: 'none',
    margin: '0',
    paddingLeft: '0',
    flexDirection: opts.layout === 'vertical' ? 'column' : 'row',
    gap: '4px',
    width: '100%',
  });

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = opts.itemClassName;
    applyStyles(li, {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      fontFamily: 'var(--kd-font-family-body, inherit)',
      fontSize: opts.fontSize,
      marginRight: '12px',
      marginBottom: '8px',
      userSelect: 'none',
      opacity: item.isHidden ? '0.5' : '1',
      textDecoration: item.isHidden ? 'line-through' : 'none',
    });

    li.addEventListener('mouseover', () => {
      li.style.opacity = '0.8';
    });

    li.addEventListener('mouseout', () => {
      li.style.opacity = item.isHidden ? '0.5' : '1';
    });

    const colorBox = document.createElement('span');
    colorBox.className = `${opts.itemClassName}-color`;
    applyStyles(colorBox, {
      width: `${opts.boxWidth}px`,
      height: `${opts.boxHeight}px`,
      borderRadius: `${opts.borderRadius}px`,
      display: 'inline-block',
      marginRight: `${opts.boxMargin}px`,
      boxSizing: 'border-box',
      backgroundColor: item.needsBorder ? item.colorWithAlpha : item.color,
      border: item.needsBorder ? `1.5px solid ${item.color}` : '',
    });

    const label = document.createElement('span');
    label.className = `${opts.itemClassName}-label`;
    label.textContent = item.label;

    li.addEventListener('click', () => {
      item.toggleVisibility();
      const hidden =
        'dataIndex' in item
          ? chart.getDataVisibility(item.dataIndex) === false
          : chart.getDatasetMeta(item.datasetIndex).hidden;
      li.style.opacity = hidden ? '0.5' : '1';
      li.style.textDecoration = hidden ? 'line-through' : 'none';
    });

    li.appendChild(colorBox);
    li.appendChild(label);
    ul.appendChild(li);
  });

  scrollableContainer.appendChild(ul);
  container.appendChild(scrollableContainer);

  scrollableContainer.style.overflowY =
    scrollableContainer.scrollHeight > scrollableContainer.clientHeight
      ? 'scroll'
      : 'hidden';

  return container;
}
