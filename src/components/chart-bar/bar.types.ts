/**
 * Semantic data model for `kd-chart-bar`.
 *
 * These types describe series plotted against shared categories, not an
 * engine configuration. Nothing here references ECharts.
 */

/** One data series plotted against the shared categories. */
export interface CartesianSeries {
  /** Series name, shown in the legend, tooltip and table header. */
  name: string;
  /** One value per category, in the same order as `categories`. `null` renders a gap. */
  values: readonly (number | null)[];
  /** Explicit CSS color for this series. Defaults to the active Shidoka palette. */
  color?: string;
}

/** Everything the bar renderer needs for one pass. */
export interface BarModel {
  /** Category labels along the shared axis. */
  categories: readonly string[];
  /** Series plotted against `categories`. */
  series: readonly CartesianSeries[];
  /** Column header and axis label used for the category. */
  categoryLabel: string;
  /** Axis label used for values. */
  valueLabel: string;
  /** Shows the series legend. */
  showLegend: boolean;
  /** Stacks series values instead of grouping them side by side. */
  stacked: boolean;
  /** Draws horizontal bars instead of vertical columns. */
  horizontal: boolean;
}
