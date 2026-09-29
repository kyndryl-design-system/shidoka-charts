import { describe, expect, it } from 'vitest';
import {
  buildTreeTable,
  flattenHierarchy,
  hierarchyDepth,
  hierarchyTotal,
  nodeTotal,
} from './tree-table';
import type { TreeNode } from './tree.types';

const nodes: TreeNode[] = [
  {
    label: 'Runtime',
    children: [
      { label: 'Kubernetes', value: 10 },
      { label: 'Service mesh', value: 5 },
    ],
  },
  { label: 'Storage', value: 8 },
];

describe('tree table mapping', () => {
  it('sums node and hierarchy totals', () => {
    expect(nodeTotal(nodes[0])).toBe(15);
    expect(hierarchyTotal(nodes)).toBe(23);
    expect(hierarchyDepth(nodes)).toBe(2);
  });

  it('flattens leaves with full paths', () => {
    expect(flattenHierarchy(nodes)).toEqual([
      { path: ['Runtime', 'Kubernetes'], value: 10 },
      { path: ['Runtime', 'Service mesh'], value: 5 },
      { path: ['Storage'], value: 8 },
    ]);
  });

  it('builds a leveled table view', () => {
    expect(
      buildTreeTable({
        nodes,
        categoryLabel: 'Team',
        valueLabel: 'Headcount',
        showLabels: true,
        orientation: 'LR',
        layout: 'orthogonal',
        initialTreeDepth: -1,
        expandAndCollapse: true,
      })
    ).toEqual({
      columns: ['Team', 'Team level 2', 'Headcount'],
      rows: [
        ['Runtime', 'Kubernetes', 10],
        ['Runtime', 'Service mesh', 5],
        ['Storage', '', 8],
      ],
    });
  });
});
