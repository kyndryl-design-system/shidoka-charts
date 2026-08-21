/**
 * Semantic data model for `kd-chart-sunburst`.
 *
 * These types describe a hierarchy, not an engine configuration. Nothing here
 * references ECharts.
 */

/** A single segment in the sunburst hierarchy. */
export interface SunburstNode {
  /** Segment label, shown in labels, tooltips and the table fallback. */
  label: string;
  /**
   * Segment value. Ignored when `children` is provided, in which case the
   * value is the sum of the children.
   */
  value?: number;
  /**
   * Explicit CSS color for this segment and, unless overridden, its
   * descendants. Defaults to the active Shidoka palette.
   */
  color?: string;
  /** Nested segments, ordered from the center outwards. */
  children?: SunburstNode[];
}

/** Everything the sunburst renderer needs for one pass. */
export interface SunburstModel {
  /** Top level segments. */
  nodes: readonly SunburstNode[];
  /** Column header used for the category in the table fallback. */
  categoryLabel: string;
  /** Column header and tooltip suffix used for values. */
  valueLabel: string;
  /** Draws labels inside segments that are wide enough. */
  showLabels: boolean;
  /** Radius of the empty center as a fraction of the chart radius, 0 to 0.8. */
  innerRadiusRatio: number;
}

/** Flattened representation of a hierarchy path, used by the table fallback. */
export interface SunburstLeaf {
  /** Labels from the outermost ancestor to the leaf. */
  path: readonly string[];
  value: number;
}
