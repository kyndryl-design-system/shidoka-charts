import type { ChartTableView } from '../../internal/chart-frame/types';
import type { TreeLeaf, TreeModel, TreeNode } from './tree.types';

/**
 * Pure mapping from the tree hierarchy to flat rows. Safe to import without DOM
 * globals.
 */

/** Sum of a node's own value or of its descendants. */
export function nodeTotal(node: TreeNode): number {
  if (node.children?.length) {
    return node.children.reduce((sum, child) => sum + nodeTotal(child), 0);
  }

  return Number.isFinite(node.value) ? Number(node.value) : 0;
}

/** Sum across every top level node. */
export function hierarchyTotal(nodes: readonly TreeNode[]): number {
  return nodes.reduce((sum, node) => sum + nodeTotal(node), 0);
}

/** Depth of the deepest branch, where a flat list of nodes has depth 1. */
export function hierarchyDepth(nodes: readonly TreeNode[]): number {
  if (!nodes.length) return 0;

  return (
    1 +
    nodes.reduce(
      (deepest, node) => Math.max(deepest, hierarchyDepth(node.children ?? [])),
      0
    )
  );
}

/** Flattens the hierarchy into leaf paths, outermost ancestor first. */
export function flattenHierarchy(
  nodes: readonly TreeNode[],
  parentPath: readonly string[] = []
): TreeLeaf[] {
  const leaves: TreeLeaf[] = [];

  for (const node of nodes) {
    const path = [...parentPath, node.label];

    if (node.children?.length) {
      leaves.push(...flattenHierarchy(node.children, path));
    } else {
      leaves.push({ path, value: nodeTotal(node) });
    }
  }

  return leaves;
}

/** Stable key for a hierarchy path used to track collapsed state. */
export function treePathKey(path: readonly string[]): string {
  return path.join('\0');
}

/**
 * Builds the table fallback. One column per hierarchy level plus a value column,
 * so the CSV export mirrors what is on screen.
 */
export function buildTreeTable(model: TreeModel): ChartTableView {
  const depth = Math.max(hierarchyDepth(model.nodes), 1);
  const leaves = flattenHierarchy(model.nodes);

  const columns =
    depth === 1
      ? [model.categoryLabel, model.valueLabel]
      : [
          ...Array.from({ length: depth }, (_unused, level) =>
            level === 0
              ? model.categoryLabel
              : `${model.categoryLabel} level ${level + 1}`
          ),
          model.valueLabel,
        ];

  const rows = leaves.map((leaf) => [
    ...Array.from(
      { length: depth },
      (_unused, level) => leaf.path[level] ?? ''
    ),
    leaf.value,
  ]);

  return { columns, rows };
}
