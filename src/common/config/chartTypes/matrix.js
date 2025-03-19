import { getComputedColorPalette } from '../colorPalettes';

export const type = 'matrix';
export const defaultOpacity = 0.9;

function parseColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

const getColorWithOpacity = (color, opacity) => {
  const finalOpacity = !isNaN(opacity) ? opacity : 0.7;
  const { r, g, b } = parseColor(color);
  return `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
};

function getPresetSymmetricColor(
  value,
  colors,
  neutral = 50,
  band = 15,
  opacity = 1,
  paletteKey
) {
  if (paletteKey.toLowerCase().includes('divergent')) {
    const minVal = -100;
    const maxVal = 100;
    const neutralIndex = Math.floor(colors.length / 2);
    if (value <= 0) {
      const ratio = (value - minVal) / (0 - minVal);
      const idx = Math.round(ratio * neutralIndex);
      return getColorWithOpacity(colors[Math.min(idx, neutralIndex)], opacity);
    } else {
      const ratio = value / maxVal;
      const idx =
        neutralIndex + Math.round(ratio * (colors.length - neutralIndex - 1));
      return getColorWithOpacity(
        colors[Math.min(idx, colors.length - 1)],
        opacity
      );
    }
  } else {
    const minVal = 0;
    const maxVal = 100;
    const ratio = (value - minVal) / (maxVal - minVal);
    const idx = Math.round(ratio * (colors.length - 1));
    return getColorWithOpacity(
      colors[Math.min(idx, colors.length - 1)],
      opacity
    );
  }
}

const gradientLegendPlugin = {
  id: 'gradientLegend',
  afterDraw(chart, args, options) {
    if (!options?.display) return;
    const Colors =
      options.colors ||
      chart.options.plugins?.gradientLegend?.colors ||
      chart.options.colorScale?.colors ||
      chart.data?.datasets?.[0]?._colorPalette;
    if (!Colors || !Colors.length) return;

    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    const paletteKey = options.paletteKey || '';
    const isDivergentPalette = paletteKey.toLowerCase().includes('divergent');

    const computedScale = chart.options.colorScale || {};
    const minVal = computedScale.min ?? (isDivergentPalette ? -100 : 0);
    const neutralVal = computedScale.neutral ?? (isDivergentPalette ? 0 : 50);
    const maxVal = computedScale.max ?? (isDivergentPalette ? 100 : 100);

    const legendOptions = {
      position: options.position || 'bottom',
      width: options.width || Math.min(400, chartArea.width * 0.8),
      height: options.height || 20,
      margin: options.margin || 10,
      borderRadius: options.borderRadius || 4,
      gradientBorderRadius: 1,
      title: options.title || '',
      titleFontSize: options.titleFontSize || 12,
      labelFontSize: options.labelFontSize || 12,
      labelMargin: options.labelMargin || 5,
      opacity: typeof options.opacity === 'number' ? options.opacity : 0.7,
      ...options,
    };

    let x, y;
    if (legendOptions.position === 'bottom') {
      x = chartArea.left + (chartArea.width - legendOptions.width) / 2;
      y = chartArea.bottom + legendOptions.margin;
    } else if (legendOptions.position === 'top') {
      x = chartArea.left + (chartArea.width - legendOptions.width) / 2;
      y = chartArea.top - legendOptions.margin - legendOptions.height;
    } else if (legendOptions.position === 'bottom-left') {
      x = chartArea.left - 70;
      y = chartArea.bottom + 70;
    } else {
      x = chartArea.left + (chartArea.width - legendOptions.width) / 2;
      y = chartArea.bottom + legendOptions.margin;
    }

    const gradient = ctx.createLinearGradient(x, y, x + legendOptions.width, y);
    const neutralIndex = Colors.findIndex((c) =>
      c.toLowerCase().includes('neutral')
    );
    if (neutralIndex > 0) {
      const negativeColors = Colors.slice(0, neutralIndex);
      const neutralColor = Colors[neutralIndex];
      const positiveColors = Colors.slice(neutralIndex + 1);
      negativeColors.forEach((color, i) => {
        const t =
          negativeColors.length > 1
            ? (i / (negativeColors.length - 1)) * 0.5
            : 0;
        gradient.addColorStop(
          t,
          getColorWithOpacity(color, legendOptions.opacity)
        );
      });
      gradient.addColorStop(
        0.5,
        getColorWithOpacity(neutralColor, legendOptions.opacity)
      );
      positiveColors.forEach((color, i) => {
        const t =
          0.5 +
          (positiveColors.length > 1
            ? (i / (positiveColors.length - 1)) * 0.5
            : 0);
        gradient.addColorStop(
          t,
          getColorWithOpacity(color, legendOptions.opacity)
        );
      });
    } else {
      Colors.forEach((color, i) => {
        gradient.addColorStop(
          i / (Colors.length - 1),
          getColorWithOpacity(color, legendOptions.opacity)
        );
      });
    }

    if (legendOptions.title) {
      ctx.font = `500 ${legendOptions.titleFontSize}px ${
        chart.options.font?.family || 'Arial'
      }`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = chart.options.color || '#666';
      ctx.fillText(legendOptions.title, x, y - legendOptions.labelMargin);
    }

    const drawRoundedRect = (xx, yy, w, h, radius) => {
      ctx.beginPath();
      ctx.moveTo(xx + radius, yy);
      ctx.lineTo(xx + w - radius, yy);
      ctx.arcTo(xx + w, yy, xx + w, yy + radius, radius);
      ctx.lineTo(xx + w, yy + h - radius);
      ctx.arcTo(xx + w, yy + h, xx + w - radius, yy + h, radius);
      ctx.lineTo(xx + radius, yy + h);
      ctx.arcTo(xx, yy + h, xx, yy + h - radius, radius);
      ctx.lineTo(xx, yy + radius);
      ctx.arcTo(xx, yy, xx + radius, yy, radius);
      ctx.closePath();
    };

    ctx.fillStyle = '#fff';
    drawRoundedRect(
      x,
      y,
      legendOptions.width,
      legendOptions.height,
      legendOptions.borderRadius
    );
    ctx.fill();

    ctx.fillStyle = gradient;
    drawRoundedRect(
      x,
      y,
      legendOptions.width,
      legendOptions.height,
      legendOptions.gradientBorderRadius
    );
    ctx.fill();

    ctx.font = `${legendOptions.labelFontSize}px ${
      chart.options.font?.family || 'Arial'
    }`;
    ctx.fillStyle = chart.options.color || '#666';
    const formatValue = (val) => val.toString();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(
      formatValue(minVal),
      x,
      y + legendOptions.height + legendOptions.labelMargin
    );

    if (Colors.length >= 3 && neutralVal !== undefined) {
      ctx.textAlign = 'center';
      ctx.fillText(
        formatValue(neutralVal),
        x + legendOptions.width / 2,
        y + legendOptions.height + legendOptions.labelMargin
      );
    }

    ctx.textAlign = 'right';
    ctx.fillText(
      formatValue(maxVal),
      x + legendOptions.width,
      y + legendOptions.height + legendOptions.labelMargin
    );
  },
};

export const options = (ctx) => {
  const ds = ctx?.datasets?.[0];
  const data = ds?.data ?? [];
  const allValues = data
    .map((d) => (typeof d.value === 'number' ? d.value : undefined))
    .filter((v) => v !== undefined);

  const paletteKey = ctx.options?.colorPalette || 'sequential02';
  const Colors = getComputedColorPalette(paletteKey);
  const minValue = allValues.length ? Math.min(...allValues) : 0;
  const maxValue = allValues.length ? Math.max(...allValues) : 0;
  const isDivergent = paletteKey.toLowerCase().includes('divergent');
  const computedNeutral = isDivergent ? 0 : 50;
  const legendPadding = ctx.options?.plugins?.gradientLegend?.display
    ? { bottom: 30 }
    : { bottom: 0 };

  return {
    layout: { padding: legendPadding },
    plugins: {
      tooltip: {
        callbacks: {
          title() {
            return '';
          },
          label(context) {
            const v = context.dataset.data[context.dataIndex];
            const rowLabel = ctx.labels.y?.[v.y - 1] || ctx.labels[v.y - 1];
            const colLabel = ctx.labels.x?.[v.x - 1] || ctx.labels[v.x - 1];
            const metadata = context.dataset.metadata;
            if (!metadata) {
              return [
                `${rowLabel} - ${colLabel}`,
                `Value: ${v.value ?? 'N/A'}`,
              ];
            }
            const cellData = metadata.find(
              (item) => item.x === v.x && item.y === v.y
            );
            return cellData
              ? [
                  `${rowLabel} - ${colLabel}`,
                  ...Object.entries(cellData)
                    .filter(([key]) => key !== 'x' && key !== 'y')
                    .map(([key, value]) => `${key}: ${value}`),
                ]
              : [`${rowLabel} - ${colLabel}`, `Value: ${v.value ?? 'N/A'}`];
          },
        },
      },
      legend: { display: false },
      gradientLegend: {
        display: ctx.options?.plugins?.gradientLegend?.display ?? false,
        position: 'bottom-left',
        title: ctx.options?.plugins?.gradientLegend?.title ?? '',
        margin: 15,
        height: 15,
        width: 280,
        opacity: defaultOpacity,
        colors: Colors,
        paletteKey,
        legendLabels: [minValue, computedNeutral, maxValue],
      },
    },
    colorPalette: Colors,
    colorScale: {
      min: minValue,
      neutral: computedNeutral,
      max: maxValue,
      colors: Colors,
    },
    legend: { display: false },
    scales: {
      x: {
        grid: { display: false },
        maxTicksLimit: 15,
        min: 1,
        max: ctx.labels.x?.length ?? ctx.labels?.length ?? 3,
        offset: true,
        ticks: {
          autoSkip: false,
          maxTicksLimit: 15,
          callback: (value) =>
            ctx.labels.x?.[value - 1] ?? ctx.labels?.[value - 1] ?? '',
          padding: 20,
        },
        afterFit(scale) {
          if (ctx.options?.plugins?.gradientLegend?.display) {
            scale.height -= 10;
          }
        },
      },
      y: {
        grid: { display: false },
        maxTicksLimit: 15,
        min: 1,
        max: ctx.labels.y?.length ?? ctx.labels?.length ?? 3,
        ticks: {
          autoSkip: false,
          maxTicksLimit: 15,
          callback: (value) =>
            ctx.labels.y?.[value - 1] ?? ctx.labels?.[value - 1] ?? '',
        },
      },
    },
  };
};

export const datasetOptions = (ctx) => {
  const paletteKey = ctx.options?.colorPalette || 'categorical';
  const Colors = getComputedColorPalette(paletteKey);
  const numCols = ctx.labels.x?.length ?? ctx.labels?.length ?? 3;
  const numRows = ctx.labels.y?.length ?? ctx.labels?.length ?? 3;

  return {
    borderColor: 'transparent',
    borderWidth: 0,
    width: ({ chart }) => (chart.chartArea?.width ?? 0) / numCols - 2,
    height: ({ chart }) => (chart.chartArea?.height ?? 0) / numRows - 1,
    backgroundColor: ({ raw }) =>
      raw.value !== undefined
        ? getPresetSymmetricColor(
            raw.value,
            Colors,
            50,
            15,
            defaultOpacity,
            paletteKey
          )
        : 'rgba(204, 204, 204, 0.8)',
    hoverBackgroundColor: ({ raw }) =>
      raw.value !== undefined
        ? getPresetSymmetricColor(raw.value, Colors, 50, 15, 1, paletteKey)
        : '#999',
  };
};

export default {
  options,
  datasetOptions,
  plugins: [gradientLegendPlugin],
};
