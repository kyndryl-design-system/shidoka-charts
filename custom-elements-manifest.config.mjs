/**
 * Custom Elements Manifest configuration.
 *
 * `globs` and `--litelement` are still passed on the command line by the
 * `analyze` npm script; this file only adds manifest post-processing.
 */

/** Property hoisted to the top of every element's member list. */
const HOISTED_PROPERTY = 'colorPalette';

/**
 * Moves `colorPalette` to the front of every element's members.
 *
 * Storybook derives its controls order from this manifest, not from the
 * `argTypes` in a story file: the docgen-inferred argTypes are spread first
 * and a story's own `argTypes` can only merge onto an existing key, never
 * reposition it. The analyzer emits each subclass's own fields before the
 * ones it inherits from `ChartFrameElement`, so `colorPalette` would
 * otherwise sit below every data property on every chart. Hoisting it here
 * keeps it the first control for all chart types, on both the ECharts and
 * the D3 renderers, without redeclaring the property in each component.
 */
function hoistColorPalette() {
  return {
    name: 'hoist-color-palette',
    packageLinkPhase({ customElementsManifest }) {
      for (const module of customElementsManifest.modules ?? []) {
        for (const declaration of module.declarations ?? []) {
          const members = declaration.members;
          if (!Array.isArray(members)) continue;

          const index = members.findIndex(
            (member) => member.name === HOISTED_PROPERTY
          );
          if (index <= 0) continue;

          // Stable move: pull the one member out and unshift it, leaving
          // every other member in its original relative order.
          const [hoisted] = members.splice(index, 1);
          members.unshift(hoisted);
        }
      }
    },
  };
}

export default {
  plugins: [hoistColorPalette()],
};
