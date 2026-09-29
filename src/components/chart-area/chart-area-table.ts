import type { ChartTableView } from '../../internal/chart-frame/types';
import type { AreaModel } from './area.types';

/**
 * Pure mapping from the area model to flat rows. Safe to import without DOM
 * globals.
 */

/** Builds the table fallback: one row per category, one column per series. */
export function buildAreaTable(model: AreaModel): ChartTableView {
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
