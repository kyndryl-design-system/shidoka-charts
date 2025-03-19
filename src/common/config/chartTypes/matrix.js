import { getComputedColorPalette } from '../colorPalettes';

export const type = 'matrix';
export const defaultOpacity = 0.9;

export const options = (ctx) => {
  const gradientLegendVisible = ctx.options.plugins.gradientLegend.display;
  const gradientLegendTitle = ctx.options.plugins.gradientLegend.title;
  const legendPadding = gradientLegendVisible ? { bottom: 30 } : { bottom: 0 };
  const paletteKey = ctx.options.colorPalette || 'sequential02';

  const Colors = getComputedColorPalette(paletteKey);

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
            return metadata
              ? (() => {
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
                    : [
                        `${rowLabel} - ${colLabel}`,
                        `Value: ${v.value || 'N/A'}`,
                      ];
                })()
              : [`${rowLabel} - ${colLabel}`, `Value: ${v.value || 'N/A'}`];
          },
        },
      },
      legend: { display: false },
      gradientLegend: {
        display: gradientLegendVisible,
        position: 'bottom-left',
        title: gradientLegendTitle || '',
        margin: 15,
        height: 15,
        width: 280,
        opacity: defaultOpacity,
        colors: Colors,
        paletteKey,
      },
    },
    colorPalette: Colors,
    colorScale: {
      min: ctx.options.colorScale?.min ?? 0,
      max: ctx.options.colorScale?.max ?? 100,
      neutral: ctx.options.colorScale?.neutral ?? 50,
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
          if (gradientLegendVisible) {
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

function parseColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function linearInterpolationColor(hex1, hex2, t) {
  const c1 = parseColor(hex1);
  const c2 = parseColor(hex2);
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
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
  if (paletteKey && paletteKey.toLowerCase().includes('divergent')) {
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

export const datasetOptions = (ctx) => {
  const paletteKey = ctx.options.colorPalette || 'categorical';
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
