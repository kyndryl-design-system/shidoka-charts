import { getComputedColorPalette } from '../colorPalettes';

export const type = 'matrix';
export const defaultOpacity = 0.7;

export const options = (ctx) => {
  const gradientLegendVisible = ctx.options.plugins.gradientLegend.display;
  const gradientLegendTitle = ctx.options.plugins.gradientLegend.title;
  const legendPadding = gradientLegendVisible ? { bottom: 30 } : { bottom: 0 };

  const Colors = getComputedColorPalette(
    ctx.options.colorPalette || 'sequential02'
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
        display: gradientLegendVisible,
        position: 'bottom-left',
        title: gradientLegendTitle || 'Value',
        margin: 15,
        height: 15,
        width: 280,
        opacity: defaultOpacity,
        colors: Colors,
      },
    },
    colorPalette: Colors,
    scaleShowValues: true,
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

function getPresetSymmetricColor(
  value,
  colors,
  neutral = 50,
  band = 15,
  opacity = 1
) {
  const negativeColor = colors[0];
  const neutralColor = colors[1];
  const positiveColor = colors[2];
  let color;

  if (value <= neutral - band) {
    color = negativeColor;
  } else if (value >= neutral + band) {
    color = positiveColor;
  } else if (value < neutral) {
    const t = (value - (neutral - band)) / band;
    color = linearInterpolationColor(negativeColor, neutralColor, t);
  } else {
    const t = (value - neutral) / band;
    color = linearInterpolationColor(neutralColor, positiveColor, t);
  }

  if (opacity < 1 && color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  } else if (opacity < 1 && color.startsWith('#')) {
    const { r, g, b } = parseColor(color);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
}

export const datasetOptions = (ctx) => {
  const Colors = getComputedColorPalette(
    ctx.options.colorPalette || 'categorical'
  );
  const numCols = ctx.labels.x?.length ?? ctx.labels?.length ?? 3;
  const numRows = ctx.labels.y?.length ?? ctx.labels?.length ?? 3;

  return {
    borderColor: 'transparent',
    borderWidth: 0,
    width: ({ chart }) => (chart.chartArea?.width ?? 0) / numCols - 2,
    height: ({ chart }) => (chart.chartArea?.height ?? 0) / numRows - 1,
    backgroundColor: ({ raw }) =>
      raw.value !== undefined
        ? getPresetSymmetricColor(raw.value, Colors, 50, 15, defaultOpacity)
        : 'rgba(204, 204, 204, 0.8)',
    hoverBackgroundColor: ({ raw }) =>
      raw.value !== undefined
        ? getPresetSymmetricColor(raw.value, Colors)
        : '#999',
  };
};
