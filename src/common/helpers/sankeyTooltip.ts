import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const createSankeyTooltipHandler = () => (context: any) => {
  const { chart, tooltip } = context;

  const TooltipBackground = getTokenThemeVal(
    '--kd-color-background-ui-default-dark'
  );
  const TooltipFontColor = getTokenThemeVal('--kd-color-text-variant-inversed');

  let tooltipEl = chart.canvas.parentNode.querySelector('.sankey-tooltip');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'sankey-tooltip';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.zIndex = '50';
    tooltipEl.style.opacity = '0';
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  tooltipEl.style.background = 'transparent';
  tooltipEl.style.padding = '0';
  tooltipEl.style.borderRadius = '0';
  tooltipEl.style.boxShadow = 'none';
  tooltipEl.style.color = TooltipFontColor;
  tooltipEl.style.font =
    '12px/1.4 system-ui, -apple-system, BlinkMacSystemFont,"Segoe UI",sans-serif';

  if (!tooltip || tooltip.opacity === 0) {
    tooltipEl.style.opacity = '0';
    return;
  }

  const item = tooltip.dataPoints[0];
  const dataset = item.dataset;
  const dataIndex = item.dataIndex;
  const link = dataset.data[dataIndex];

  const fromKey = link.from ?? link.source;
  const toKey = link.to ?? link.target;
  const value = link.flow ?? link.value ?? '';

  const fromLabel =
    (dataset.labels && dataset.labels[fromKey]) ?? String(fromKey);
  const toLabel = (dataset.labels && dataset.labels[toKey]) ?? String(toKey);

  const fromColor =
    typeof dataset.colorFrom === 'function'
      ? dataset.colorFrom({ chart, dataset, dataIndex })
      : '#888';

  const toColor =
    typeof dataset.colorTo === 'function'
      ? dataset.colorTo({ chart, dataset, dataIndex })
      : '#888';

  tooltipEl.innerHTML = '';

  const inner = document.createElement('div');
  inner.style.position = 'relative';
  inner.style.display = 'inline-block';
  inner.style.background = TooltipBackground;
  inner.style.color = TooltipFontColor;
  inner.style.borderRadius = '6px';
  inner.style.padding = '6px 10px';
  inner.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)';
  inner.style.whiteSpace = 'nowrap';

  inner.innerHTML = `
    <span style="display:inline-flex;align-items:center;gap:4px;margin-right:6px;">
      <span style="width:8px;height:8px;border-radius:2px;background:${fromColor};display:inline-block;"></span>
      <span>${fromLabel}</span>
    </span>
    <span style="margin-right:6px;">→</span>
    <span style="display:inline-flex;align-items:center;gap:4px;margin-right:4px;">
      <span style="width:8px;height:8px;border-radius:2px;background:${toColor};display:inline-block;"></span>
      <span>${toLabel}</span>
    </span>
    <span>: ${value}</span>
  `;

  const caret = document.createElement('div');
  caret.style.position = 'absolute';
  caret.style.left = '50%';
  caret.style.bottom = '-4px';
  caret.style.transform = 'translateX(-50%)';
  caret.style.width = '0';
  caret.style.height = '0';
  caret.style.borderLeft = '6px solid transparent';
  caret.style.borderRight = '6px solid transparent';
  caret.style.borderTop = `6px solid ${TooltipBackground}`;

  inner.appendChild(caret);
  tooltipEl.appendChild(inner);

  const { offsetLeft, offsetTop } = chart.canvas;
  tooltipEl.style.opacity = '1';
  tooltipEl.style.left = `${offsetLeft + tooltip.caretX}px`;
  tooltipEl.style.top = `${offsetTop + tooltip.caretY}px`;
  tooltipEl.style.transform = `translate(-50%, calc(-100% - 10px))`;
};
