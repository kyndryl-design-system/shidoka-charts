import colorPalettes from '../colorPalettes';

const LabelColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-neutral-white'
  ) || '#3d3c3c';

export const type = 'treemap';

export const options = (ctx) => {
  return {
    plugins: {
      legend: {
        display: false,
      },
    },
    spacing: 1,
    borderWidth: 1,
    labels: {
      align: 'left',
      display: true,
      color: LabelColor,
      // color: 'white',
      // hoverColor: 'white',
      font: { size: 12 },
      position: 'top',
      overflow: 'hidden',
    },
    captions: {
      align: 'center',
      display: true,
      color: LabelColor,
      // color: 'white',
      // hoverColor: 'white',
      font: {
        size: 14,
      },
      padding: 0,
    },
  };
};

export const datasetOptions = (ctx, index) => {
  // console.log(Groups);

  return {
    backgroundColor:
      colorPalettes[ctx.options.colorPalette || 'divergent01'][0] + '90',
    borderColor: colorPalettes[ctx.options.colorPalette || 'divergent01'][0],
    // borderColor: function (context) {
    //   return colorPalettes[ctx.options.colorPalette || 'divergent01'][
    //     getGroupColorIndex(context)
    //   ];
    // },
    // backgroundColor: function (context) {
    //   return (
    //     colorPalettes[ctx.options.colorPalette || 'divergent01'][
    //       getGroupColorIndex(context)
    //     ] + '80'
    //   );
    // },
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
