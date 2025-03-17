import { getComputedColorPalette } from '../colorPalettes';

export const type = 'matrix';

export const options = (ctx) => {
  const legendPadding = {
    bottom: 50,
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
      colorLegend: {
        display: true,
        position: 'bottom-left',
        title: 'Value',
        margin: 15,
        height: 15,
        width: 280,
        colors: Colors,
      },
    },
    scales: {
      x: {
        min: 0.5,
        max: ctx.labels.x?.length + 0.5 || ctx.labels?.length + 0.5 || 3.5,
        offset: false,
        ticks: {
          callback: (value) =>
            ctx.labels.x?.[value - 1] || ctx.labels[value - 1] || '',
        },
      },
      y: {
        min: 0.5,
        max: ctx.labels.y?.length + 0.5 || ctx.labels?.length + 0.5 || 3.5,
        ticks: {
          callback: (value) =>
            ctx.labels.y?.[value - 1] || ctx.labels[value - 1] || '',
        },
      },
    },
  };
};

export const datasetOptions = (ctx, index) => {
  const Colors = getComputedColorPalette(
    ctx.options.colorPalette || 'categorical'
  );
  const ColorCycles = Math.floor(index / (Colors.length - 1));
  const Index =
    index > Colors.length - 1
      ? index - (Colors.length - 1) * ColorCycles
      : index;

  const numCols = ctx.labels.x?.length || ctx.labels?.length || 3;
  const numRows = ctx.labels.y?.length || ctx.labels?.length || 3;

  return {
    borderColor: Colors[Index],
    width: ({ chart }) => (chart.chartArea || {}).width / numCols - 1,
    height: ({ chart }) => (chart.chartArea || {}).height / numRows - 1,
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

      return Colors[0] + '30';
    },
  };
};
