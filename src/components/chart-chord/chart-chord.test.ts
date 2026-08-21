import { describe, expect, it } from 'vitest';
import { matrixTotal, normalizeMatrix } from './chord-table';
import type { ChordNode } from './chord.types';

/**
 * Mirrors `KDChartChord.buildModel()` so caption gating can be tested without
 * reaching into protected members.
 */
function hasRenderableChordModel(
  nodes: ChordNode[],
  matrix: number[][]
): boolean {
  if (!Array.isArray(nodes) || nodes.length < 2) return false;
  if (!Array.isArray(matrix) || !matrix.length) return false;
  return true;
}

describe('KDChartChord caption gating', () => {
  it('treats a single node as empty even when a matrix is present', () => {
    const nodes = [{ label: 'Only' }];
    const matrix = [[0]];

    expect(hasRenderableChordModel(nodes, matrix)).toBe(false);
    expect(matrixTotal(matrix)).toBe(0);
  });

  it('treats a missing matrix as empty even when nodes are present', () => {
    const nodes = [{ label: 'A' }, { label: 'B' }];
    const matrix: number[][] = [];

    expect(hasRenderableChordModel(nodes, matrix)).toBe(false);
  });

  it('allows a caption only when the model would render', () => {
    const nodes = [{ label: 'A' }, { label: 'B' }];
    const matrix = [
      [0, 4],
      [2, 0],
    ];

    expect(hasRenderableChordModel(nodes, matrix)).toBe(true);
    expect(matrixTotal(normalizeMatrix(matrix, nodes.length))).toBe(6);
  });

  it('totals the normalized matrix so caption matches renderer and table', () => {
    const nodes = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
    const matrix = [[0, 10], [5], [1, 2, 3, 50], [9, 9, 9]];

    expect(matrixTotal(matrix)).toBe(98);
    expect(matrixTotal(normalizeMatrix(matrix, nodes.length))).toBe(21);
  });
});
