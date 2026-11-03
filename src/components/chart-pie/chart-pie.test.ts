import { describe, expect, it } from 'vitest';
import { buildPieTable, sliceTotal } from './chart-pie-table';
import type { PieModel } from './pie.types';

const baseModel: PieModel = {
  slices: [
    { label: 'Web', value: 40 },
    { label: 'Mobile', value: 35 },
    { label: 'Desktop', value: 25 },
  ],
  categoryLabel: 'Platform',
  valueLabel: 'Share',
  showLabels: true,
  showLegend: true,
  innerRadiusRatio: 0,
};

describe('buildPieTable', () => {
  it('maps each slice into a row', () => {
    const table = buildPieTable(baseModel);

    expect(table.columns).toEqual(['Platform', 'Share']);
    expect(table.rows).toEqual([
      ['Web', 40],
      ['Mobile', 35],
      ['Desktop', 25],
    ]);
  });

  it('returns an empty rows list when there are no slices', () => {
    const table = buildPieTable({ ...baseModel, slices: [] });

    expect(table.rows).toEqual([]);
    expect(table.columns).toEqual(['Platform', 'Share']);
  });

  it('builds a single row table for a single slice', () => {
    const model: PieModel = {
      ...baseModel,
      slices: [{ label: 'Web', value: 100 }],
    };

    const table = buildPieTable(model);

    expect(table.rows).toEqual([['Web', 100]]);
  });
});

describe('sliceTotal', () => {
  it('sums the value of every slice', () => {
    expect(sliceTotal(baseModel.slices)).toBe(100);
  });

  it('returns 0 for an empty slice list', () => {
    expect(sliceTotal([])).toBe(0);
  });

  it('ignores non-finite values', () => {
    expect(
      sliceTotal([
        { label: 'A', value: 10 },
        { label: 'B', value: Number.NaN },
      ])
    ).toBe(10);
  });
});
