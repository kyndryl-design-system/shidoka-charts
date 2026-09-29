import { chartSource } from './chart-source.js';

/**
 * Builds a `docs.source.transform` for `tag`.
 *
 * Storybook resolves `docs.source.code` before anything else, so a story that
 * sets it can never react to a Controls change. Combining
 * `docs.source.type: 'dynamic'` with this transform instead regenerates the
 * snippet from the story's *current* args every time they change, while still
 * printing real Lit property and boolean bindings via `chartSource`.
 *
 * The dynamic source Storybook hands in is discarded: the web-components
 * source decorator renders into a detached element, so its `innerHTML` has
 * already lost every property binding.
 *
 * `ctx.args` also carries the spy functions injected by
 * `actions: { argTypesRegex: '^on.*' }` and by the custom-elements manifest's
 * declared events. Those are not authorable properties, so they are dropped.
 *
 * @param {string} tag custom element tag name, e.g. `kd-chart-area`
 * @returns {(source: string, ctx: { args: Record<string, unknown> }) => string}
 */
export function chartSourceTransform(tag) {
  return (_source, ctx) =>
    chartSource(
      tag,
      Object.fromEntries(
        Object.entries(ctx.args ?? {}).filter(
          ([, value]) => typeof value !== 'function'
        )
      )
    );
}
