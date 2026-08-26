import type { ChartTableView } from '../../internal/chart-frame/types';
import type { ChordModel } from './chord.types';

/**
 * Pure mapping from the chord matrix to flat rows. Safe to import without DOM
 * globals.
 */

/** Total outbound flow for one endpoint. */
export function nodeOutflow(
  matrix: readonly (readonly number[])[],
  index: number
): number {
  const row = matrix[index] ?? [];

  return row.reduce(
    (sum, value) => sum + (Number.isFinite(value) ? value : 0),
    0
  );
}

/** Total flow described by the matrix. */
export function matrixTotal(matrix: readonly (readonly number[])[]): number {
  return matrix.reduce(
    (sum, _row, index) => sum + nodeOutflow(matrix, index),
    0
  );
}

/**
 * Normalizes a possibly ragged matrix into a square matrix matching the node
 * count, so a malformed input cannot throw inside the layout.
 */
export function normalizeMatrix(
  matrix: readonly (readonly number[])[],
  size: number
): number[][] {
  return Array.from({ length: size }, (_row, i) =>
    Array.from({ length: size }, (_cell, j) => {
      const value = matrix[i]?.[j];
      return Number.isFinite(value) && (value as number) > 0
        ? (value as number)
        : 0;
    })
  );
}

/** Builds the table fallback with one row per non-zero flow. */
export function buildChordTable(model: ChordModel): ChartTableView {
  const size = model.nodes.length;
  const matrix = normalizeMatrix(model.matrix, size);
  const rows: (string | number)[][] = [];

  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      if (!matrix[i][j]) continue;

      rows.push([
        model.nodes[i]?.label ?? String(i),
        model.nodes[j]?.label ?? String(j),
        matrix[i][j],
      ]);
    }
  }

  return {
    columns: [model.sourceLabel, model.targetLabel, model.valueLabel],
    rows,
  };
}
