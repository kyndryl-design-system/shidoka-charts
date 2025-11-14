import { getComputedColorPalette } from '../colorPalettes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const type = 'sankey';

const getSankeyLabelColor = () =>
  getTokenThemeVal('--kd-color-text-level-primary');

export const options = (ctx) => {
  const BorderColor = getTokenThemeVal('--kd-color-background-page-default');
  const LabelColor = getSankeyLabelColor();
  const Colors = getComputedColorPalette(
    ctx?.options?.colorPalette || 'categorical'
  );
  const SankeyBackground = getTokenThemeVal(
    '--kd-color-data-viz-level-secondary'
  );

  const userOptions = ctx?.options || {};

  return {
    outlineBorderWidth: 0.5,
    outlineBorderColor: BorderColor,
    outlineBackgroundColor: SankeyBackground,
    backgroundColor: Colors[0],
    ...userOptions,
    plugins: {
      legend: { display: false },
      datalabels: {
        font: {
          size: 12,
          weight: 'bold',
        },
        color: LabelColor,
      },
      tooltip: {
        enabled: false,
        external: sankeyExternalTooltip,
      },
      ...(userOptions.plugins || {}),
    },
    sankey: {
      dataTableHeaderLabels: {
        source: 'Source',
        target: 'Target',
        value: 'Weight',
      },
      ...(userOptions.sankey || {}),
    },
    borderColor: BorderColor,
  };
};

const getFrom = (d) => d?.from ?? d?.source;
const getTo = (d) => d?.to ?? d?.target;

export const datasetOptions = (ctx) => {
  const rawKey = ctx?.options?.colorPalette || 'categorical';
  const key = rawKey === 'default' ? 'categorical' : rawKey;
  const LabelColor = getSankeyLabelColor();

  let palette =
    getComputedColorPalette(key) ||
    getComputedColorPalette('categorical') ||
    [];

  const buildNodeColorMap = (dataset) => {
    const cachedKey = dataset._nodeColorMapPaletteKey;
    if (dataset._nodeColorMap && cachedKey === key)
      return dataset._nodeColorMap;

    const nodes = [];
    (dataset.data || []).forEach((d) => {
      if (!d) return;
      const f = getFrom(d);
      const t = getTo(d);
      if (f !== undefined && !nodes.includes(f)) nodes.push(f);
      if (t !== undefined && !nodes.includes(t)) nodes.push(t);
    });

    const map = {};
    nodes.forEach((n, i) => {
      map[n] = palette[i % palette.length];
    });

    dataset._nodeColorMap = map;
    dataset._nodeColorMapPaletteKey = key;
    dataset._colorPalette = palette;

    return map;
  };

  const getNodeColor = (dataset, nodeKey) => {
    if (!dataset) return palette[0];
    const map = buildNodeColorMap(dataset);
    return nodeKey !== undefined && map[nodeKey] ? map[nodeKey] : palette[0];
  };

  const colorForIndex = (context, which /* 'from' | 'to' */) => {
    const ds = context?.dataset;
    const idx = typeof context?.dataIndex === 'number' ? context.dataIndex : 0;
    const link = ds?.data?.[idx];
    if (!link) return palette[0];
    const k = which === 'from' ? getFrom(link) : getTo(link);
    return getNodeColor(ds, k);
  };

  return {
    color: LabelColor,
    colorFrom: (ctx2) => colorForIndex(ctx2, 'from'),
    colorTo: (ctx2) => colorForIndex(ctx2, 'to'),
    hoverColorFrom: (ctx2) => colorForIndex(ctx2, 'from'),
    hoverColorTo: (ctx2) => colorForIndex(ctx2, 'to'),
    colorMode: 'gradient',
  };
};

export const normalizeData = (a) => {
  const datasetsSource =
    (a.datasets && a.datasets.length && a.datasets) || a.data?.datasets;

  const datasets = (datasetsSource || []).map((ds) => ({ ...ds }));

  if (Array.isArray(a.labels) && a.labels.length) {
    return { datasets, labels: a.labels };
  }

  const nodeLabels = (() => {
    if (!datasets?.[0]?.data?.length) return [];
    const ds = datasets[0];
    const nodes = [];
    ds.data.forEach((link) => {
      if (!link) return;
      const from = link.from ?? link.source;
      const to = link.to ?? link.target;
      if (from !== undefined && !nodes.includes(from)) nodes.push(from);
      if (to !== undefined && !nodes.includes(to)) nodes.push(to);
    });
    return nodes.map((n) => (ds.labels?.[n] ? ds.labels[n] : String(n)));
  })();

  return { datasets, labels: nodeLabels };
};

const sankeyExternalTooltip = (context) => {
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
  tooltipEl.style.transform = 'translate(-50%, calc(-100% - 10px))';
};
