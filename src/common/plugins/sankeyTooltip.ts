import type { Chart, TooltipModel } from 'chart.js';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

type SankeyLink = {
  from?: string | number;
  to?: string | number;
  source?: string | number;
  target?: string | number;
  flow?: number | string;
  value?: number | string;
};

type SankeyDataset = {
  data: SankeyLink[];
  labels?: Record<string | number, string>;

  colorFrom?: (args: {
    chart: Chart<'sankey'>;
    dataset: SankeyDataset;
    dataIndex: number;
  }) => string;

  colorTo?: (args: {
    chart: Chart<'sankey'>;
    dataset: SankeyDataset;
    dataIndex: number;
  }) => string;
};

interface SankeyTooltipContext {
  chart: Chart<'sankey'>;
  tooltip: TooltipModel<'sankey'>;
}

export const createSankeyTooltipHandler =
  () => (context: SankeyTooltipContext) => {
    const { chart, tooltip } = context;

    const TooltipBackground = getTokenThemeVal(
      '--kd-color-background-ui-default-dark'
    );
    const TooltipFontColor = getTokenThemeVal(
      '--kd-color-text-variant-inversed'
    );

    let tooltipEl =
      chart.canvas.parentNode?.querySelector<HTMLDivElement>('.sankey-tooltip');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'sankey-tooltip';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.zIndex = '50';
      tooltipEl.style.opacity = '0';
      chart.canvas.parentNode?.appendChild(tooltipEl);
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
    const dataset = item.dataset as SankeyDataset;
    const dataIndex = item.dataIndex;
    const link = dataset.data[dataIndex];

    const fromKey = link.from ?? link.source;
    const toKey = link.to ?? link.target;
    const value = link.flow ?? link.value ?? '';

    const fromLabel =
      (dataset.labels && dataset.labels[fromKey as number]) ?? String(fromKey);
    const toLabel =
      (dataset.labels && dataset.labels[toKey as number]) ?? String(toKey);

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
    inner.style.display = 'inline-flex';
    inner.style.alignItems = 'center';
    inner.style.gap = '6px';
    inner.style.lineHeight = '1';
    inner.style.background = TooltipBackground;
    inner.style.color = TooltipFontColor;
    inner.style.borderRadius = '4px';
    inner.style.padding = '6px 10px';
    inner.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)';
    inner.style.whiteSpace = 'nowrap';

    const fromWrapper = document.createElement('span');
    fromWrapper.style.display = 'inline-flex';
    fromWrapper.style.alignItems = 'center';
    fromWrapper.style.gap = '4px';

    const fromSwatch = document.createElement('span');
    fromSwatch.style.width = '14px';
    fromSwatch.style.height = '14px';
    fromSwatch.style.marginRight = '2px';
    fromSwatch.style.borderRadius = '2px';
    fromSwatch.style.display = 'inline-block';
    fromSwatch.style.background = fromColor;

    const fromText = document.createElement('span');
    fromText.textContent = fromLabel;

    fromWrapper.appendChild(fromSwatch);
    fromWrapper.appendChild(fromText);

    const arrowSpan = document.createElement('span');
    arrowSpan.style.display = 'inline-flex';
    arrowSpan.style.alignItems = 'center';
    arrowSpan.style.lineHeight = '1';
    arrowSpan.textContent = '→';

    const toWrapper = document.createElement('span');
    toWrapper.style.display = 'inline-flex';
    toWrapper.style.alignItems = 'center';
    toWrapper.style.gap = '4px';

    const toSwatch = document.createElement('span');
    toSwatch.style.width = '14px';
    toSwatch.style.height = '14px';
    toSwatch.style.marginRight = '2px';
    toSwatch.style.borderRadius = '2px';
    toSwatch.style.display = 'inline-block';
    toSwatch.style.background = toColor;

    const toText = document.createElement('span');
    toText.textContent = toLabel;

    toWrapper.appendChild(toSwatch);
    toWrapper.appendChild(toText);

    const valueSpan = document.createElement('span');
    valueSpan.style.display = 'inline-flex';
    valueSpan.style.alignItems = 'center';
    valueSpan.style.lineHeight = '1';
    valueSpan.textContent = `: ${String(value)}`;

    inner.appendChild(fromWrapper);
    inner.appendChild(arrowSpan);
    inner.appendChild(toWrapper);
    inner.appendChild(valueSpan);

    const caret = document.createElement('div');
    caret.style.position = 'absolute';
    caret.style.left = '50%';
    caret.style.bottom = '-6px';
    caret.style.transform = 'translateX(-50%)';
    caret.style.width = '0';
    caret.style.height = '0';
    caret.style.borderLeft = '6px solid transparent';
    caret.style.borderRight = '6px solid transparent';
    caret.style.borderTop = `6px solid ${TooltipBackground}`;

    inner.appendChild(caret);
    tooltipEl.appendChild(inner);

    const rect = chart.canvas.getBoundingClientRect();

    tooltipEl.style.opacity = '1';
    tooltipEl.style.left = `${rect.left + window.scrollX + tooltip.caretX}px`;
    tooltipEl.style.top = `${rect.top + window.scrollY + tooltip.caretY}px`;
    tooltipEl.style.transform = 'translate(-50%, calc(-100% - 10px))';
  };
