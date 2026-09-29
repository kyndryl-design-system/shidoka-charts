/**
 * Semantic data model for `kd-chart-line`.
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

/** Everything the line renderer needs for one pass. */
export interface LineModel {
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
  /** Stacks series values instead of overlaying them. */
  stacked: boolean;
  /** Draws smoothed curves instead of straight segments. */
  smooth: boolean;
  /** Draws a marker symbol at each data point. */
  showPoints: boolean;
}
