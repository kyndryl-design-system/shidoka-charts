/**
 * Semantic data model for `kd-chart-tree`.
 *
 * These types describe a hierarchy, not an engine configuration. Nothing here
 * references ECharts.
 */

/** A single node in the tree hierarchy. */
export interface TreeNode {
  /** Node label, shown in labels, tooltips and the table fallback. */
  label: string;
  /**
   * Leaf value. Ignored when `children` is provided, in which case the value is
   * the sum of the children.
   */
  value?: number;
  /**
   * Explicit CSS color for this node and, unless overridden, its descendants.
   * Defaults to the active Shidoka palette.
   */
  color?: string;
  /** Nested nodes. */
  children?: TreeNode[];
  /**
   * Initial collapsed state. After mount, user expand/collapse interactions are
   * preserved across data updates until the hierarchy structure changes.
   */
  collapsed?: boolean;
}

/** Tree growth direction relative to the root. */
export type TreeOrientation = 'LR' | 'RL' | 'TB' | 'BT';

/** Layout style for the tree edges. */
export type TreeLayout = 'orthogonal' | 'radial';

/** Everything the tree renderer needs for one pass. */
export interface TreeModel {
  /** Top level nodes. */
  nodes: readonly TreeNode[];
  /** Column header used for the category in the table fallback. */
  categoryLabel: string;
  /** Column header and tooltip suffix used for values. */
  valueLabel: string;
  /** Draws labels beside nodes. */
  showLabels: boolean;
  /** Growth direction relative to the root. */
  orientation: TreeOrientation;
  /** Orthogonal or radial edge routing. */
  layout: TreeLayout;
  /**
   * Depth to expand on first render. `-1` expands every level. `1` shows only
   * the root until a node is expanded.
   */
  initialTreeDepth: number;
  /** Lets users expand and collapse branches by clicking nodes. */
  expandAndCollapse: boolean;
  /**
   * Collapsed state keyed by hierarchy path segments joined with `\0`. Populated
   * by the renderer from user interaction and replayed on updates.
   */
  collapsedByPath?: Readonly<Record<string, boolean>>;
}

/** Flattened representation of a hierarchy path, used by the table fallback. */
export interface TreeLeaf {
  /** Labels from the outermost ancestor to the leaf. */
  path: readonly string[];
  value: number;
}
