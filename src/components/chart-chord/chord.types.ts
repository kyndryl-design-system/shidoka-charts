/**
 * Semantic data model for `kd-chart-chord`.
 *
 * These types describe relationships between named entities, not an engine
 * configuration. Nothing here references D3.
 */

/** One endpoint around the circumference. */
export interface ChordNode {
  /** Endpoint label, shown in labels, tooltips and the table fallback. */
  label: string;
  /** Explicit CSS color. Defaults to the active Shidoka palette. */
  color?: string;
}

/** Everything the chord renderer needs for one pass. */
export interface ChordModel {
  /** Endpoints, in the order they appear around the circle. */
  nodes: readonly ChordNode[];
  /**
   * Square flow matrix. `matrix[i][j]` is the flow from node `i` to node `j`
   * and must be the same length as `nodes`.
   */
  matrix: readonly (readonly number[])[];
  /** Column header and tooltip suffix used for flow values. */
  valueLabel: string;
  /** Column header used for the source endpoint in the table fallback. */
  sourceLabel: string;
  /** Column header used for the target endpoint in the table fallback. */
  targetLabel: string;
  /** Draws endpoint labels around the circumference. */
  showLabels: boolean;
  /** Gap between endpoints in radians, 0 to 0.2. */
  padAngle: number;
}
