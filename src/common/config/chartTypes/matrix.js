import { getComputedColorPalette } from '../colorPalettes';

export const type = 'matrix';

export const options = (ctx) => {
  const gradeintLegendVisible = ctx.options.plugins.gradientLegend.display;
  const gradientLegendTitle = ctx.options.plugins.gradientLegend.title;
  const legendPadding = gradeintLegendVisible ? { bottom: 30 } : { bottom: 0 };

  const Colors = getComputedColorPalette(
    ctx.options.colorPalette || 'categorical'
  );

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
        display: gradeintLegendVisible || true,
        position: 'bottom-left',
        title: gradientLegendTitle || 'Value',
        margin: 15,
        height: 15,
        width: 280,
        colors: Colors,
      },
    },
    colorPalette: ctx.options.colorPalette || 'categorical',
    scaleShowValues: true,
    colorScale: {
      min:
        ctx.options.colorScale?.min !== undefined
          ? ctx.options.colorScale.min
          : 0,
      max:
        ctx.options.colorScale?.max !== undefined
          ? ctx.options.colorScale.max
          : 100,
      neutral:
        ctx.options.colorScale?.neutral !== undefined
          ? ctx.options.colorScale.neutral
          : 50,
    },
    legend: { display: false },
    scales: {
      x: {
        grid: { display: false },
        maxTicksLimit: 15,
        min: 1,
        max: ctx.labels.x?.length || ctx.labels?.length || 3,
        offset: true,
        ticks: {
          autoSkip: false,
          maxTicksLimit: 15,
          callback: (value) =>
            ctx.labels.x?.[value - 1] ?? ctx.labels?.[value - 1] ?? '',
          padding: 20,
        },
        afterFit(scale) {
          gradeintLegendVisible ? (scale.height -= 10) : (scale.height -= 0);
        },
      },
      y: {
        grid: { display: false },
        maxTicksLimit: 15,
        min: 1,
        max: ctx.labels.y?.length || ctx.labels?.length || 3,
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

function lerpColor(hex1, hex2, t) {
  const c1 = parseColor(hex1);
  const c2 = parseColor(hex2);
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function getPresetSymmetricColor(value, colors, neutral = 50, band = 15) {
  const negativeColor = colors[0];
  const neutralColor = colors[1];
  const positiveColor = colors[2];
  if (value <= neutral - band) {
    return negativeColor;
  } else if (value >= neutral + band) {
    return positiveColor;
  } else if (value < neutral) {
    const t = (value - (neutral - band)) / band;
    return lerpColor(negativeColor, neutralColor, t);
  } else {
    const t = (value - neutral) / band;
    return lerpColor(neutralColor, positiveColor, t);
  }
}

export const datasetOptions = (ctx) => {
  const Colors = getComputedColorPalette(
    ctx.options.colorPalette || 'categorical'
  );
  const numCols = ctx.labels.x?.length || ctx.labels?.length || 3;
  const numRows = ctx.labels.y?.length || ctx.labels?.length || 3;
  return {
    borderColor: 'transparent',
    borderWidth: 0,
    width: ({ chart }) => (chart.chartArea?.width ?? 0) / numCols - 1,
    height: ({ chart }) => (chart.chartArea?.height ?? 0) / numRows - 1,
    backgroundColor: ({ raw }) =>
      raw.value !== undefined
        ? getPresetSymmetricColor(raw.value, Colors)
        : '#ccc',
    hoverBackgroundColor: ({ raw }) =>
      raw.value !== undefined
        ? getPresetSymmetricColor(raw.value, Colors)
        : '#999',
  };
};
