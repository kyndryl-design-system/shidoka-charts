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

/**
 * Measured geometry that label fitting depends on. Whether a label fits is a
 * question about pixels, so the planner needs to know how big the chart
 * actually is.
 */
export interface SunburstLabelMetrics {
  /** Chart radius in CSS pixels, that is half of the shorter host side. */
  radiusPx: number;
  /** Font size the chart draws segment labels with, in CSS pixels. */
  fontSizePx: number;
}

/** How one segment's label resolved against the space its sector offers. */
export interface SunburstLabelPlacement {
  /** Labels from the outermost ancestor to this segment. */
  path: readonly string[];
  /** Full, untruncated label. */
  label: string;
  value: number;
  /**
   * `inline` when the chart can draw the label itself, `truncated` when the
   * overlay has to show it instead, and `marker` when no direction has room
   * for readable text.
   */
  display: 'inline' | 'truncated' | 'marker';
  /**
   * Text that can actually be shown, cut to what a level overlay pill holds
   * without leaving the sector. Sometimes roomy enough to keep the label whole
   * even where the chart could not draw it.
   */
  text: string;
  /**
   * Room a level pill has along its text, in pixels. Its own padding and
   * borders come out of this.
   */
  chipCapacityPx: number;
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
  /**
   * Measured geometry for label fitting. The component fills this in from the
   * host it has measured, so the renderer and the component's own label overlay
   * always decide from the same numbers. It is not part of the element's public
   * API, and it falls back to a documented default before the first
   * measurement.
   */
  labelMetrics?: SunburstLabelMetrics;
}

/** Flattened representation of a hierarchy path, used by the table fallback. */
export interface SunburstLeaf {
  /** Labels from the outermost ancestor to the leaf. */
  path: readonly string[];
  value: number;
}
