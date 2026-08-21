/**
 * Palette helpers with no DOM or design-token dependency so option and layout
 * mapping stays pure and unit testable.
 */

/** Used when design tokens cannot be resolved, e.g. a detached test root. */
export const DEFAULT_PALETTE: readonly string[] = [
  '#3d70b2',
  '#29a3a3',
  '#8cd211',
  '#e3bc13',
  '#f19534',
  '#ff7832',
  '#e71d32',
  '#ba4e00',
  '#8e6a00',
  '#5aaafa',
];

/** Picks a palette color for an index, cycling when the palette runs out. */
export function paletteColor(colors: readonly string[], index: number): string {
  const source = colors.length ? colors : DEFAULT_PALETTE;
  const safeIndex = Math.trunc(index);
  return source[((safeIndex % source.length) + source.length) % source.length];
}
