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
  /**
   * One value per category, in the same order as `categories`. `null`
   * renders a gap. A `[min, max]` tuple renders a floating bar spanning
   * `min` to `max` instead of a bar from zero; `min` may be greater than
   * `max` and either may be negative, and the renderer preserves the pair
   * exactly as given.
   */
  values: readonly (number | null | readonly [number, number])[];
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
  /** Fixed bar thickness in px. Overrides the responsive `barMaxWidth` cap. */
  barThickness?: number;
  /** Upper bound for the value axis. Defaults to data-driven auto scaling. */
  valueMax?: number;
  /** Hides both axes entirely, including their lines, ticks and labels. */
  hideAxes?: boolean;
  /** Suppresses the chart tooltip. */
  hideTooltip?: boolean;
  /** Draws each series name inside its own bar segment. */
  showSeriesLabels?: boolean;
  /** Marker drawn at a fixed value on the value axis, e.g. a threshold or target. */
  indicator?: { value: number; label?: string };
}
