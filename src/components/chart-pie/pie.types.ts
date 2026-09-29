/**
 * Semantic data model for `kd-chart-pie`.
 *
 * These types describe part-to-whole slices, not an engine configuration.
 * Nothing here references ECharts.
 */

/** A single pie slice. */
export interface PieSlice {
  /** Slice label, shown in labels, legend, tooltip and the table fallback. */
  label: string;
  value: number;
  /** Explicit CSS color for this slice. Defaults to the active Shidoka palette. */
  color?: string;
}

/** Everything the pie renderer needs for one pass. */
export interface PieModel {
  slices: readonly PieSlice[];
  categoryLabel: string;
  valueLabel: string;
  showLabels: boolean;
  showLegend: boolean;
  /** Radius of the empty center as a fraction of the chart radius, 0 to 0.8. 0 is a full pie, >0 is a doughnut. */
  innerRadiusRatio: number;
}
