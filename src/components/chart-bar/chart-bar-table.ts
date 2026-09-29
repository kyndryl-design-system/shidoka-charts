import type { ChartTableView } from '../../internal/chart-frame/types';
import type { BarModel } from './bar.types';

/**
 * Pure mapping from the bar model to flat rows. Safe to import without DOM
 * globals.
 */

/** Builds the table fallback: one row per category, one column per series. */
export function buildBarTable(model: BarModel): ChartTableView {
  const columns = [
    model.categoryLabel,
    ...model.series.map((series) => series.name),
  ];

  const rows = model.categories.map((category, index) => [
    category,
    ...model.series.map((series) => series.values[index] ?? ''),
  ]);

  return { columns, rows };
}
