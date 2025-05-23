import { getComputedColorPalette } from '../colorPalettes';

export const type = 'matrix';

export const createMatrixData = (data, options = {}) => {
  const { xAxis, yAxis, xKey = 'x', yKey = 'y', valueKey = 'value' } = options;

  if (!xAxis || !yAxis || !Array.isArray(xAxis) || !Array.isArray(yAxis)) {
    throw new Error('xAxis and yAxis must be provided as arrays');
  }

  const matrixData = [];
  const dataMap = new Map();

  data.forEach((item) => {
    const xValue = item[xKey];
    const yValue = item[yKey];
    const key = `${xValue}-${yValue}`;
    dataMap.set(key, item[valueKey]);
  });

  for (let y = 1; y <= yAxis.length; y++) {
    for (let x = 1; x <= xAxis.length; x++) {
      const yValue = yAxis[y - 1];
      const xValue = xAxis[x - 1];
      const key = `${xValue}-${yValue}`;
      const value = dataMap.has(key) ? dataMap.get(key) : undefined;
      matrixData.push({ x, y, value });
    }
  }

  return matrixData;
};

const defaultOpacity = 0.8;

let isMatrixFullscreen = false;

export function setMatrixFullscreen(state) {
  isMatrixFullscreen = !!state;
}

function isFullScreen() {
  if (isMatrixFullscreen) {
    return true;
  }

  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullscreenElement ||
    document.msFullscreenElement
  );
}

function parseColor(hex) {
  if (
    !hex ||
    typeof hex !== 'string' ||
    !hex.startsWith('#') ||
    hex.length < 7
  ) {
    return { r: 0, g: 0, b: 0 };
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r: isNaN(r) ? 0 : r, g: isNaN(g) ? 0 : g, b: isNaN(b) ? 0 : b };
}

function getColorWithOpacity(color, opacity) {
  if (!color || typeof color !== 'string' || !color.startsWith('#')) {
    return `rgba(204, 204, 204, ${!isNaN(opacity) ? opacity : 0.7})`;
  }

  const finalOpacity = !isNaN(opacity) ? opacity : 0.7;
  const { r, g, b } = parseColor(color);
  return `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
}

function getPresetSymmetricColor(
  value,
  colors,
  neutral = 50,
  band = 15,
  opacity = 1,
  paletteKey
) {
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    return `rgba(204, 204, 204, ${opacity})`;
  }

  const key = paletteKey || '';
  if (key.toLowerCase().includes('divergent')) {
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
    if (!options || !options.display) return;
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

    function drawRoundedRect(xx, yy, w, h, radius) {
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
    }

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
  const legendEnabled = ctx.options?.plugins?.gradientLegend?.display;
  const legendPadding = legendEnabled ? { bottom: 35 } : { bottom: 0 };

  return {
    responsive: false,
    maintainAspectRatio: true,
    aspectRatio: 2,
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
            return [`${rowLabel} - ${colLabel}`, `Value: ${v.value ?? 'N/A'}`];
          },
        },
      },
      legend: { display: false },
      gradientLegend: {
        display: legendEnabled,
        position: 'bottom-left',
        title: ctx.options?.plugins?.gradientLegend?.title || '',
        margin: 0,
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
    scales: {
      x: {
        grid: { display: false },
        min: 1,
        max: ctx.labels.x?.length ?? ctx.labels?.length ?? 3,
        offset: true,
        ticks: {
          autoSkip: false,
          maxTicksLimit: 15,
          callback: (value) =>
            ctx.labels.x?.[value - 1] ?? ctx.labels?.[value - 1] ?? '',
          padding: function () {
            return isFullScreen() ? 30 : 20;
          },
        },
        afterFit(scale) {
          if (legendEnabled) {
            scale.height -= 10;
          }
        },
      },
      y: {
        grid: { display: false },
        min: 1,
        max: ctx.labels.y?.length ?? ctx.labels?.length ?? 3,
        ticks: {
          autoSkip: false,
          maxTicksLimit: 15,
          callback: (value) =>
            ctx.labels.y?.[value - 1] ?? ctx.labels?.[value - 1] ?? '',
          padding: function () {
            return isFullScreen() ? 15 : 8;
          },
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
    borderWidth: 0,
    borderColor: 'transparent',
    width({ chart }) {
      const gap = 2;
      const totalWidth = chart.chartArea?.width ?? 0;
      const cellWidth = totalWidth / numCols - gap;
      return cellWidth > 0 ? cellWidth : 1;
    },
    height({ chart }) {
      const gap = 0;
      const totalHeight = chart.chartArea?.height ?? 0;
      const cellHeight = totalHeight / numRows - gap;
      return isFullScreen() ? totalHeight / 11.75 : Math.min(cellHeight, 60);
    },
    backgroundColor({ raw }) {
      if (raw?.value !== undefined) {
        return getPresetSymmetricColor(
          raw.value,
          Colors,
          50,
          15,
          defaultOpacity,
          paletteKey
        );
      }
      return 'rgba(204, 204, 204, 0.8)';
    },
    hoverBackgroundColor({ raw }) {
      if (raw?.value !== undefined) {
        return getPresetSymmetricColor(
          raw.value,
          Colors,
          50,
          15,
          1,
          paletteKey
        );
      }
      return '#999';
    },
  };
};

export default {
  options,
  datasetOptions,
  plugins: [gradientLegendPlugin],
};
