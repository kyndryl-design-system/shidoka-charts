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
  /**
   * Shaded bands drawn behind this series, e.g. confidence intervals around
   * a forecast. Each band is independent of the others.
   */
  bands?: readonly SeriesBand[];
}

/** A horizontal reference band boundary on the value axis. */
export interface ReferenceBand {
  /** Value-axis position of this boundary. */
  value: number;
  /** CSS color for the boundary line and the fill above it. */
  color: string;
  /** Optional label drawn on the boundary line. */
  label?: string;
}

/** A shaded band around a series, e.g. one confidence interval. */
export interface SeriesBand {
  /** Lower bound, one value per category. `null` leaves a gap at that point. */
  lower: readonly (number | null)[];
  /** Upper bound, one value per category. `null` leaves a gap at that point. */
  upper: readonly (number | null)[];
  /** Fill opacity, 0-1. Defaults to 0.2. */
  opacity?: number;
  /** CSS fill color. Defaults to the parent series color. */
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
  /**
   * Treats `categories` as ISO date strings plotted on a real time axis,
   * so points are spaced by elapsed time instead of evenly by index.
   */
  timeAxis?: boolean;
  /** Hides both axes entirely, including their lines, ticks and labels. */
  hideAxes?: boolean;
  /** Horizontal threshold bands drawn across the full plot width. */
  referenceBands?: readonly ReferenceBand[];
  /**
   * Category label, or index into `categories`, where a forecast region
   * begins. Renders a divider and a faint tint from that point to the end
   * of the plot. A string that does not match any category is a no-op.
   */
  forecastFrom?: string | number;
}
