import type { ChartTableView } from '../../internal/chart-frame/types';
import type { PieModel, PieSlice } from './pie.types';

/**
 * Pure mapping from the pie model to flat rows. Safe to import without DOM
 * globals.
 */

/** Sum of every slice's value. */
export function sliceTotal(slices: readonly PieSlice[]): number {
  return slices.reduce(
    (sum, slice) => sum + (Number.isFinite(slice.value) ? slice.value : 0),
    0
  );
}

/** Builds the table fallback: one row per slice. */
export function buildPieTable(model: PieModel): ChartTableView {
  const columns = [model.categoryLabel, model.valueLabel];
  const rows = model.slices.map((slice) => [slice.label, slice.value]);

  return { columns, rows };
}
