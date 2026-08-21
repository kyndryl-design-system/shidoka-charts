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

/**
 * How segment labels are presented.
 *
 * - `inline`: the chart draws labels and drops the ones below a minimum angle.
 * - `constrained`: labels that do not fit their sector are truncated or
 *   replaced by a marker, and the full label and value stay reachable from a
 *   tooltip.
 *
 * This is a presentation choice about labels, not engine configuration.
 */
export type SunburstLabelStrategy = 'inline' | 'constrained';

/** How one segment's label resolved against the space its sector offers. */
export interface SunburstLabelPlacement {
  /** Labels from the outermost ancestor to this segment. */
  path: readonly string[];
  /** Full, untruncated label. */
  label: string;
  value: number;
  /** `inline` fits, `truncated` is shortened, `marker` has no room for text. */
  display: 'inline' | 'truncated' | 'marker';
  /** Text that can actually be shown for this segment. */
  text: string;
  /** Mid-angle of the sector in degrees, measured counter-clockwise from east. */
  angleDegrees: number;
  /** Distance from the center as a fraction of the chart radius box. */
  radiusFraction: number;
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
  /** How labels behave when a sector is too narrow to hold them. */
  labelStrategy: SunburstLabelStrategy;
  /** Radius of the empty center as a fraction of the chart radius, 0 to 0.8. */
  innerRadiusRatio: number;
}

/** Flattened representation of a hierarchy path, used by the table fallback. */
export interface SunburstLeaf {
  /** Labels from the outermost ancestor to the leaf. */
  path: readonly string[];
  value: number;
}
