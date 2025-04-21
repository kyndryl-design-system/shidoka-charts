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
  onItemClick: null,
  adjustChartHeight: true,
  reservedLegendHeight: 40,
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

  const legendOuterContainer = document.createElement('div');
  legendOuterContainer.className = `${opts.className}-container`;
  applyStyles(legendOuterContainer, {
    width: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
    marginRight: 'auto',
    marginLeft: 'auto',
    boxSizing: 'border-box',
  });

  const scrollableContainer = document.createElement('div');
  scrollableContainer.className = opts.className;
  applyStyles(scrollableContainer, {
    width: '100%',
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
    } else if (e.key === 'PageDown') {
      scrollableContainer.scrollTop += scrollableContainer.clientHeight;
      e.preventDefault();
    } else if (e.key === 'PageUp') {
      scrollableContainer.scrollTop -= scrollableContainer.clientHeight;
      e.preventDefault();
    } else if (e.key === 'Home') {
      scrollableContainer.scrollTop = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      e.preventDefault();
    }
  });

  const ul = document.createElement('ul');
  ul.className = `${opts.className}-items`;
  ul.setAttribute('role', 'list');
  applyStyles(ul, {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    listStyle: 'none',
    margin: '0',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '0',
    flexDirection: opts.layout === 'vertical' ? 'column' : 'row',
    gap: '4px',
    width: '100%',
  });

  const legendItems = [];

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
      height: '100%',
      userSelect: 'none',
      opacity: item.isHidden ? '0.5' : '1',
      textDecoration: item.isHidden ? 'line-through' : 'none',
    });

    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.setAttribute('aria-pressed', (!item.isHidden).toString());
    li.setAttribute(
      'aria-label',
      `${item.label}${item.isHidden ? ' (hidden)' : ''}`
    );

    li.addEventListener('focus', () => {
      li.style.outline = '2px solid var(--kd-color-border-variants-focus)';
      li.style.outlineOffset = '2px';
    });

    li.addEventListener('blur', () => {
      li.style.outline = '';
      li.style.outlineOffset = '';
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

    const toggleItemVisibility = () => {
      item.toggleVisibility();
      const hidden =
        'dataIndex' in item
          ? chart.getDataVisibility(item.dataIndex) === false
          : chart.getDatasetMeta(item.datasetIndex).hidden;
      li.style.opacity = hidden ? '0.5' : '1';
      li.style.textDecoration = hidden ? 'line-through' : 'none';
      li.setAttribute('aria-pressed', (!hidden).toString());
      li.setAttribute(
        'aria-label',
        `${item.label}${hidden ? ' (hidden)' : ''}`
      );

      if (typeof opts.onItemClick === 'function') {
        opts.onItemClick({
          item,
          chart,
          isHidden: hidden,
          label: item.label,
          dataIndex: 'dataIndex' in item ? item.dataIndex : undefined,
          datasetIndex: 'datasetIndex' in item ? item.datasetIndex : undefined,
          element: li,
        });
      }
    };

    li.addEventListener('click', toggleItemVisibility);

    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        toggleItemVisibility();
        e.preventDefault();
      }
    });

    li.appendChild(colorBox);
    li.appendChild(label);
    ul.appendChild(li);

    legendItems.push(li);
  });

  if (legendItems.length > 0) {
    legendItems.forEach((item, index) => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          const nextIndex = (index + 1) % legendItems.length;
          legendItems[nextIndex].focus();
          e.preventDefault();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          const prevIndex =
            (index - 1 + legendItems.length) % legendItems.length;
          legendItems[prevIndex].focus();
          e.preventDefault();
        }
      });
    });
  }

  scrollableContainer.appendChild(ul);
  legendOuterContainer.appendChild(scrollableContainer);
  container.appendChild(legendOuterContainer);

  scrollableContainer.style.overflowY =
    scrollableContainer.scrollHeight > scrollableContainer.clientHeight
      ? 'scroll'
      : 'hidden';

  if (opts.adjustChartHeight && chart.canvas) {
    const legendHeight = Math.min(
      scrollableContainer.scrollHeight,
      opts.maxHeight || scrollableContainer.scrollHeight
    );
    const totalHeight = legendHeight + opts.reservedLegendHeight;

    if (totalHeight > opts.reservedLegendHeight) {
      const chartContainer = chart.canvas.parentElement;
      if (chartContainer) {
        if (!chartContainer.dataset.originalHeight) {
          chartContainer.dataset.originalHeight =
            chartContainer.style.height || 'auto';
        }

        const originalHeight = chartContainer.dataset.originalHeight;
        const newHeight =
          originalHeight !== 'auto'
            ? `calc(${originalHeight} - ${legendHeight}px)`
            : `calc(100% - ${legendHeight}px)`;

        chartContainer.style.height = newHeight;

        chart.resize();
      }
    }
  }

  return container;
}
