import colorPalettes from '../colorPalettes';

export const type = 'bubble';

export const options = (ctx) => {
  return {};
};

export const datasetOptions = (ctx, index) => {
  const Colors = colorPalettes[ctx.options.colorPalette || 'default'];
  const ColorCycles = Math.floor(index / (Colors.length - 1));
  const Index =
    index > Colors.length - 1
      ? index - (Colors.length - 1) * ColorCycles
      : index;

  return {
    backgroundColor: Colors[Index] + '80', // 50% opacity
    borderColor: Colors[index],
  };
};
