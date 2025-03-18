import { getComputedColorPalette } from '../colorPalettes';

export const type = 'matrix';

export const options = (ctx) => {
  const gradeintLegendVisible = ctx.options.plugins.gradientLegend.display;
  const gradientLegendTitle = ctx.options.plugins.gradientLegend.title;
  const legendPadding = gradeintLegendVisible
    ? {
        bottom: 30,
      }
    : {
        bottom: 0,
      };

  const Colors = getComputedColorPalette(
    ctx.options.colorPalette || 'categorical'
  );

  return {
    layout: {
      padding: legendPadding,
    },
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

            if (!metadata)
              return [
                `${rowLabel} - ${colLabel}`,
                `Value: ${v.value || 'N/A'}`,
              ];

            const cellData = metadata.find(
              (item) => item.x === v.x && item.y === v.y
            );

            if (cellData) {
              return [
                `${rowLabel} - ${colLabel}`,
                ...Object.entries(cellData)
                  .filter(([key]) => key !== 'x' && key !== 'y')
                  .map(([key, value]) => `${key}: ${value}`),
              ];
            }

            return [`${rowLabel} - ${colLabel}`, `Value: ${v.value || 'N/A'}`];
          },
        },
      },
      legend: {
        display: false,
      },
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
    legend: {
      display: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
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
        grid: {
          display: false,
        },
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

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const datasetOptions = (ctx) => {
  const Colors = getComputedColorPalette(
    ctx.options.colorPalette || 'categorical'
  );

  const numCols = ctx.labels.x?.length || ctx.labels?.length || 3;
  const numRows = ctx.labels.y?.length || ctx.labels?.length || 3;

  return {
    borderColor: 'transparent',
    borderWidth: 0,
    width: ({ chart }) => (chart.chartArea || {}).width / numCols - 1,
    height: ({ chart }) => (chart.chartArea || {}).height / numRows - 1,
    hoverBackgroundColor: ({ raw }) => {
      if (raw.value !== undefined) {
        const negativeColor = Colors[0];
        const neutralColor = Colors[1];
        const positiveColor = Colors[2];
        const neutral = ctx.options.colorScale?.neutral || 0;
        if (raw.value < neutral) {
          return hexToRgba(negativeColor, 1);
        } else if (raw.value > neutral) {
          return hexToRgba(positiveColor, 1);
        } else {
          return hexToRgba(neutralColor, 1);
        }
      }
      return hexToRgba(Colors[0], 1);
    },
    backgroundColor: ({ raw }) => {
      if (raw.value !== undefined) {
        const negativeColor = Colors[0];
        const neutralColor = Colors[1];
        const positiveColor = Colors[2];
        const min = ctx.options.colorScale?.min || -10;
        const max = ctx.options.colorScale?.max || 10;
        const neutral = ctx.options.colorScale?.neutral || 0;

        if (raw.value < neutral) {
          const normalizedValue = Math.max(
            0,
            Math.min(1, (neutral - raw.value) / (neutral - min))
          );
          return hexToRgba(negativeColor, normalizedValue * 0.4 + 0.4);
        } else if (raw.value > neutral) {
          const normalizedValue = Math.max(
            0,
            Math.min(1, (raw.value - neutral) / (max - neutral))
          );
          return hexToRgba(positiveColor, normalizedValue * 0.4 + 0.4);
        } else {
          return hexToRgba(neutralColor, 0.8);
        }
      }

      return hexToRgba(Colors[0], 0.8);
    },
  };
};
