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
          return negativeColor + 'FF';
        } else if (raw.value > neutral) {
          return positiveColor + 'FF';
        } else {
          return neutralColor + 'FF';
        }
      }

      return Colors[0] + 'FF';
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
          return (
            negativeColor +
            Math.round(normalizedValue * 90 + 10)
              .toString(16)
              .padStart(2, '0')
          );
        } else if (raw.value > neutral) {
          const normalizedValue = Math.max(
            0,
            Math.min(1, (raw.value - neutral) / (max - neutral))
          );
          return (
            positiveColor +
            Math.round(normalizedValue * 90 + 10)
              .toString(16)
              .padStart(2, '0')
          );
        } else {
          return neutralColor + '50';
        }
      }

      const metadata = ctx.datasets[0].metadata;
      const relationships = ctx.datasets[0].relationships;

      if (metadata) {
        const cellData = metadata.find(
          (item) => item.x === raw.x && item.y === raw.y
        );
        if (cellData && cellData.color) {
          return cellData.color;
        }
      }

      if (relationships) {
        const category1 = relationships.category1?.some(
          ([x, y]) => x === raw.x && y === raw.y
        );
        const category2 = relationships.category2?.some(
          ([x, y]) => x === raw.x && y === raw.y
        );
        const category3 = relationships.category3?.some(
          ([x, y]) => x === raw.x && y === raw.y
        );

        if (category1) return Colors[0] + '90';
        if (category2) return Colors[1] + '90';
        if (category3) return Colors[2] + '90';
      }

      return Colors[0] + '60';
    },
  };
};
