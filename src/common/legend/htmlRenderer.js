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
  columns: 0,
  labelFormatter: null,
  itemClassResolver: null,
  position: 'bottom',
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

  const ulStyles = {
    display: 'flex',
    listStyle: 'none',
    margin: '0',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '0',
    gap: '12px',
    width: '100%',
  };

  if (opts.layout === 'vertical') {
    ulStyles.flexDirection = 'column';
    ulStyles.flexWrap = 'nowrap';
    ulStyles.justifyContent = 'flex-start';
  } else if (opts.columns > 0) {
    ulStyles.display = 'grid';
    ulStyles.gridTemplateColumns = `repeat(${opts.columns}, 1fr)`;
    ulStyles.justifyContent = 'flex-start';
  } else {
    ulStyles.flexWrap = 'wrap';
    ulStyles.justifyContent = 'center';
  }

  applyStyles(ul, ulStyles);

  const legendItems = [];

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = opts.itemClassName;
    li.setAttribute('data-legend-item', item.label);
    li.setAttribute(
      'data-index',
      item.datasetIndex !== undefined
        ? item.datasetIndex
        : item.dataIndex !== undefined
        ? item.dataIndex
        : ''
    );

    if (
      opts.itemClassResolver &&
      typeof opts.itemClassResolver === 'function'
    ) {
      const customClass = opts.itemClassResolver(item);
      if (customClass) {
        li.classList.add(customClass);
      }
    }

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

    const buttonWrapper = document.createElement('button');
    buttonWrapper.className = `${opts.itemClassName}-button`;
    buttonWrapper.setAttribute('data-color-name', item.label);
    applyStyles(buttonWrapper, {
      background: 'none',
      border: 'none',
      padding: '0',
      margin: '0',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      color: 'inherit',
      textAlign: 'left',
    });

    buttonWrapper.setAttribute('aria-pressed', (!item.isHidden).toString());
    buttonWrapper.setAttribute(
      'aria-label',
      `${item.label}${item.isHidden ? ' (hidden)' : ''}`
    );

    buttonWrapper.addEventListener('focus', () => {
      buttonWrapper.style.outline =
        '2px solid var(--kd-color-border-variants-focus)';
      buttonWrapper.style.outlineOffset = '2px';
    });

    buttonWrapper.addEventListener('blur', () => {
      buttonWrapper.style.outline = '';
      buttonWrapper.style.outlineOffset = '';
    });

    li.setAttribute('role', 'listitem');

    buttonWrapper.addEventListener('mouseover', () => {
      li.style.opacity = '0.8';
    });

    buttonWrapper.addEventListener('mouseout', () => {
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

    const valueVisible =
      chart.config.type === 'doughnut' ||
      chart.config.type === 'pie' ||
      chart.config.type === 'polarArea';

    const label = document.createElement('span');
    label.className = `${opts.itemClassName}-label`;

    if (opts.labelFormatter && typeof opts.labelFormatter === 'function') {
      label.textContent = opts.labelFormatter(item.label, item);
    } else {
      label.textContent = item.label;
    }

    if (valueVisible && 'dataIndex' in item && chart.data.datasets[0].data) {
      const value = chart.data.datasets[0].data[item.dataIndex];
      if (value !== undefined) {
        const valueSpan = document.createElement('span');
        valueSpan.className = `${opts.itemClassName}-value`;
        valueSpan.textContent = ` (${value})`;
        applyStyles(valueSpan, {
          marginLeft: '4px',
          fontSize: '0.9em',
          opacity: '0.8',
        });
        label.appendChild(valueSpan);
      }
    }

    const toggleItemVisibility = (e) => {
      e.stopPropagation();

      item.toggleVisibility();
      const hidden =
        'dataIndex' in item
          ? chart.getDataVisibility(item.dataIndex) === false
          : chart.getDatasetMeta(item.datasetIndex).hidden;
      li.style.opacity = hidden ? '0.5' : '1';
      li.style.textDecoration = hidden ? 'line-through' : 'none';
      buttonWrapper.setAttribute('aria-pressed', (!hidden).toString());
      buttonWrapper.setAttribute(
        'aria-label',
        `${item.label}${hidden ? ' (hidden)' : ''}`
      );

      const info = {
        item,
        chart,
        isHidden: hidden,
        label: item.label,
        dataIndex: 'dataIndex' in item ? item.dataIndex : undefined,
        datasetIndex: 'datasetIndex' in item ? item.datasetIndex : undefined,
        element: li,
        event: e,
      };

      if (typeof opts.onItemClick === 'function') {
        opts.onItemClick(info);
      }

      container.dispatchEvent(
        new CustomEvent('on-click', {
          detail: info,
          bubbles: true,
          composed: true,
        })
      );
    };

    buttonWrapper.addEventListener('click', toggleItemVisibility);
    buttonWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItemVisibility(e);
      }
    });

    buttonWrapper.appendChild(colorBox);
    buttonWrapper.appendChild(label);
    li.appendChild(buttonWrapper);
    ul.appendChild(li);

    legendItems.push(buttonWrapper);
  });

  if (legendItems.length > 0) {
    legendItems.forEach((button, index) => {
      button.addEventListener('keydown', (e) => {
        const navigateTo = (targetIndex) => {
          if (targetIndex >= 0 && targetIndex < legendItems.length) {
            legendItems[targetIndex].focus();
            e.preventDefault();
          }
        };

        if (opts.columns > 1) {
          const totalRows = Math.ceil(legendItems.length / opts.columns);
          const currentRow = Math.floor(index / opts.columns);
          const currentCol = index % opts.columns;

          switch (e.key) {
            case 'ArrowRight':
              navigateTo(
                currentRow * opts.columns + ((currentCol + 1) % opts.columns)
              );
              break;
            case 'ArrowLeft':
              navigateTo(
                currentRow * opts.columns +
                  ((currentCol - 1 + opts.columns) % opts.columns)
              );
              break;
            case 'ArrowDown':
              navigateTo(
                ((currentRow + 1) % totalRows) * opts.columns + currentCol
              );
              break;
            case 'ArrowUp':
              navigateTo(
                ((currentRow - 1 + totalRows) % totalRows) * opts.columns +
                  currentCol
              );
              break;
          }
        } else if (opts.layout === 'vertical' || opts.columns === 1) {
          switch (e.key) {
            case 'ArrowDown':
              navigateTo((index + 1) % legendItems.length);
              break;
            case 'ArrowUp':
              navigateTo((index - 1 + legendItems.length) % legendItems.length);
              break;
          }
        } else {
          switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
              navigateTo((index + 1) % legendItems.length);
              break;
            case 'ArrowLeft':
            case 'ArrowUp':
              navigateTo((index - 1 + legendItems.length) % legendItems.length);
              break;
          }
        }
      });
    });
  }

  scrollableContainer.appendChild(ul);
  legendOuterContainer.appendChild(scrollableContainer);

  if (opts.position === 'left' || opts.position === 'right') {
    applyStyles(legendOuterContainer, {
      float: opts.position,
      maxWidth: '25%',
      paddingLeft: opts.position === 'right' ? '15px' : '0',
      paddingRight: opts.position === 'left' ? '15px' : '0',
    });

    applyStyles(scrollableContainer, {
      maxHeight: '100%',
      height: 'auto',
    });

    if (opts.layout !== 'vertical') {
      applyStyles(ul, {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
      });
    }
  }

  container.appendChild(legendOuterContainer);

  scrollableContainer.style.overflowY =
    scrollableContainer.scrollHeight > scrollableContainer.clientHeight
      ? 'auto'
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
