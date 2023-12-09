import colorPalettes from '../colorPalettes';
import { getTextColor } from '../../helpers/helpers';

const BorderColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-border-primary'
  ) || '#3d3c3c';

const InverseBorderColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-border-inverse'
  ) || '#ffffff';

export const type = 'treemap';

export const options = (ctx) => {
  return {
    plugins: {
      legend: {
        display: false,
      },
    },
    spacing: 1,
    borderWidth: function (context) {
      const Dataset = context.dataset;
      return Dataset.groups ? 1 : 0;
    },
    labels: {
      align: 'left',
      display: true,
      // color: LabelColor,
      // color: 'white',
      // hoverColor: 'white',
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
      // color: LabelColor,
      // color: 'white',
      // hoverColor: 'white',
      font: {
        size: 14,
        weight: 500,
      },
      padding: 0,
    },
  };
};

export const datasetOptions = (ctx, index) => {
  // console.log(Groups);

  return {
    // backgroundColor:
    //   colorPalettes[ctx.options.colorPalette || 'categorical'][0] + '90',
    // borderColor: colorPalettes[ctx.options.colorPalette || 'categorical'][0],
    borderColor: function (context) {
      // return colorPalettes[ctx.options.colorPalette || 'categorical'][
      //   getGroupColorIndex(context)
      // ];
      return InverseBorderColor;
    },
    backgroundColor: function (context) {
      return colorPalettes[ctx.options.colorPalette || 'categorical'][
        getGroupColorIndex(context)
      ]; // + '80'
    },
    labels: {
      color: function (context) {
        console.log(context.element.options);
        return getTextColor(context.element.options.backgroundColor);
      },
    },
    captions: {
      color: function (context) {
        return getTextColor(context.element.options.backgroundColor);
      },
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
  const DataIndex = context.dataIndex;
  const GroupKey = Dataset.groups ? Dataset.groups[0] : null;
  const Groups = [];

  if (GroupKey && !Dataset.treeLeafKey) {
    Dataset.tree.forEach((leaf) => {
      if (!Groups.includes(leaf[GroupKey])) {
        Groups.push(leaf[GroupKey]);
      }
    });
  }

  const Leaf = Dataset.data[DataIndex];
  let index = 0;
  if (Leaf) {
    index = Groups.indexOf(Leaf._data[GroupKey]);
  }

  return index < 0 ? 0 : index;
};
