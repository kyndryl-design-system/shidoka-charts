import type { ChartTableView } from '../../internal/chart-frame/types';
import type { BarModel } from './bar.types';

/**
 * Pure mapping from the bar model to flat rows. Safe to import without DOM
 * globals.
 */

/**
 * Builds the table fallback: one row per category, one column per series.
 *
 * A `[min, max]` floating-bar tuple renders as a single cell formatted
 * `"min – max"` (en dash), keeping one column per series rather than
 * doubling the column count only for series that use tuples.
 */
export function buildBarTable(model: BarModel): ChartTableView {
  const columns = [
    model.categoryLabel,
    ...model.series.map((series) => series.name),
  ];

  const rows = model.categories.map((category, index) => [
    category,
    ...model.series.map((series) => formatCell(series.values[index])),
  ]);

  return { columns, rows };
}

/** Formats one series value for the table/CSV fallback. */
function formatCell(
  value: number | null | readonly [number, number] | undefined
): string | number {
  if (value === null || value === undefined) return '';
  // `Array.isArray` does not narrow a readonly tuple, so discriminate on the
  // scalar branch instead.
  if (typeof value === 'number') return value;
  return `${value[0]} – ${value[1]}`;
}
