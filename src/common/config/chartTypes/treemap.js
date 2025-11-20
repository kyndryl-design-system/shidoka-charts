import { getComputedColorPalette } from '../colorPalettes';
import { getTextColor } from '../../helpers/helpers';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const type = 'treemap';

export const options = () => {
  const BorderColor = getTokenThemeVal('--kd-color-background-page-default');

  return {
    plugins: {
      legend: {
        display: false,
      },
    },
    spacing(context) {
      const Dataset = context.dataset;
      const Grouped = Dataset && Dataset.groups !== undefined;

      return Grouped ? 0 : 1;
    },
    borderWidth(context) {
      const Dataset = context.dataset;
      return Dataset && Dataset.groups ? 1 : 0;
    },
    borderColor: BorderColor,
    labels: {
      align: 'left',
      display: true,
      color(context) {
        return getTextColor(context.element.options.backgroundColor);
      },
      font: {
        size: 12,
        weight: 500,
      },
      position: 'top',
      overflow: 'hidden',
    },
    captions: {
      align: 'center',
      display: true,
      color(context) {
        return getTextColor(context.element.options.backgroundColor);
      },
      font: {
        size: 12,
        weight: 700,
      },
      padding: 2,
    },
  };
};

export const datasetOptions = (ctx, index) => {
  const palette = getComputedColorPalette(
    ctx.options?.colorPalette || 'categorical'
  );

  const defaultColor =
    palette[0] || getTokenThemeVal('--kd-color-data-viz-level-secondary');

  return {
    backgroundColor(context) {
      const Dataset = context.dataset;

      if (!Dataset) {
        return defaultColor;
      }

      const paletteLen = (palette && palette.length) || 1;

      if (Dataset.groups !== undefined) {
        const groupIndex = getGroupColorIndex(context);
        return palette[groupIndex % paletteLen] || defaultColor;
      }

      const nested =
        typeof Dataset.tree === 'object' && !Array.isArray(Dataset.tree);

      if (
        nested &&
        context.raw &&
        context.raw._data &&
        typeof context.raw._data.path === 'string'
      ) {
        const parent = String(context.raw._data.path).split('.')[0];
        const groups = Object.keys(Dataset.tree || {});
        const idx = Math.max(0, groups.indexOf(parent));
        return palette[idx % paletteLen] || defaultColor;
      }

      // simple / ungrouped treemap: one default color similar to bubbleMap Colors[0]
      return defaultColor;
    },
  };
};

/**
 * The function `getGroupColorIndex` returns the index of a group color based on the context provided.
 * Works for grouped charts, not nested data charts yet.
 * @param context - The `context` parameter is an object that contains information about the current
 * context or state of the program. It is used to determine the group color index based on the dataset
 * and data index.
 * @returns the index of the group color for a given context.
 */
const getGroupColorIndex = (context) => {
  const Dataset = context.dataset;
  let index = 0;

  if (Dataset && Dataset.groups !== undefined) {
    const DataIndex = context.dataIndex;
    const GroupKey = Dataset.groups ? Dataset.groups[0] : null;
    const Nested =
      typeof Dataset.tree === 'object' && !Array.isArray(Dataset.tree);
    let Groups = [];

    if (Nested) {
      Groups = Object.keys(Dataset.tree);

      if (context.raw && context.raw._data && context.raw._data.path) {
        const Path = context.raw._data.path;
        const Parent = Path.split('.')[0];

        index = Groups.indexOf(Parent);
      }
    } else {
      Dataset.tree.forEach((leaf) => {
        if (!Groups.includes(leaf[GroupKey])) {
          Groups.push(leaf[GroupKey]);
        }
      });

      const Leaf = Dataset.data && Dataset.data[DataIndex];

      if (Leaf && Leaf._data) {
        index = Groups.indexOf(Leaf._data[GroupKey]);
      }
    }
  }

  return index < 0 ? 0 : index;
};
