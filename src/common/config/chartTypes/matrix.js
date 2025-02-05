import { getComputedColorPalette } from '../colorPalettes';

export const type = 'matrix';

export const options = (ctx) => {
  return {
    plugins: {
      tooltip: {
        callbacks: {
          title() {
            return '';
          },
          label(context) {
            const v = context.dataset.data[context.dataIndex];
            const item1 = ctx.labels[v.y - 1];
            const item2 = ctx.labels[v.x - 1];
            const relationships = context.dataset.relationships;

            if (!relationships) return [`${item1} - ${item2}`];

            const isAlly = relationships.allies.some(
              ([x, y]) => x === v.x && y === v.y
            );
            const isNeutral = relationships.friends.some(
              ([x, y]) => x === v.x && y === v.y
            );

            if (isAlly) return [`${item1}`, 'Allied'];
            if (isNeutral) return [`${item1} - ${item2}`, 'Neutral'];
            return [`${item1} - ${item2}`, 'Opposed'];
          },
        },
      },
    },
    scales: {
      x: {
        min: 0.5,
        max: 3.5,
        offset: false,
        ticks: {
          callback: (value) => ctx.labels[value - 1] || '',
        },
      },
      y: {
        min: 0.5,
        max: 3.5,
        ticks: {
          callback: (value) => ctx.labels[value - 1] || '',
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

  return {
    borderColor: Colors[Index],
    width: ({ chart }) => (chart.chartArea || {}).width / 3 - 1,
    height: ({ chart }) => (chart.chartArea || {}).height / 3 - 1,
    backgroundColor: ({ raw }) => {
      const relationships = ctx.datasets[0].relationships;
      if (!relationships) return Colors[0] + '90';

      const isAlly = relationships.allies.some(
        ([x, y]) => x === raw.x && y === raw.y
      );
      const isFriend = relationships.friends.some(
        ([x, y]) => x === raw.x && y === raw.y
      );

      if (isAlly) return Colors[0] + '90';
      if (isFriend) return Colors[1] + '90';
      return Colors[2] + '90';
    },
  };
};
