import { describe, expect, it } from 'vitest';
import { buildLineTable } from './chart-line-table';
import type { LineModel } from './line.types';

const baseModel: LineModel = {
  categories: ['Jan', 'Feb', 'Mar'],
  series: [
    { name: 'Web', values: [10, 20, 30] },
    { name: 'Mobile', values: [5, 15, 25] },
  ],
  categoryLabel: 'Month',
  valueLabel: 'Users',
  showLegend: true,
  stacked: false,
  smooth: false,
  showPoints: true,
};

describe('buildLineTable', () => {
  it('maps categories and series into columns and rows', () => {
    const table = buildLineTable(baseModel);

    expect(table.columns).toEqual(['Month', 'Web', 'Mobile']);
    expect(table.rows).toEqual([
      ['Jan', 10, 5],
      ['Feb', 20, 15],
      ['Mar', 30, 25],
    ]);
  });

  it('renders a missing value as an empty string', () => {
    const model: LineModel = {
      ...baseModel,
      series: [
        { name: 'Web', values: [10, null, 30] },
        { name: 'Mobile', values: [5, 15, 25] },
      ],
    };

    const table = buildLineTable(model);

    expect(table.rows[1]).toEqual(['Feb', '', 15]);
  });

  it('builds a single column table for a single series', () => {
    const model: LineModel = {
      ...baseModel,
      series: [{ name: 'Web', values: [10, 20, 30] }],
    };

    const table = buildLineTable(model);

    expect(table.columns).toEqual(['Month', 'Web']);
    expect(table.rows).toEqual([
      ['Jan', 10],
      ['Feb', 20],
      ['Mar', 30],
    ]);
  });

  it('builds a wide table for many series', () => {
    const model: LineModel = {
      ...baseModel,
      series: [
        { name: 'Web', values: [10, 20, 30] },
        { name: 'Mobile', values: [5, 15, 25] },
        { name: 'Desktop', values: [1, 2, 3] },
      ],
    };

    const table = buildLineTable(model);

    expect(table.columns).toEqual(['Month', 'Web', 'Mobile', 'Desktop']);
    expect(table.rows[0]).toEqual(['Jan', 10, 5, 1]);
  });

  it('returns an empty rows list when there are no categories', () => {
    const model: LineModel = { ...baseModel, categories: [] };

    const table = buildLineTable(model);

    expect(table.rows).toEqual([]);
    expect(table.columns).toEqual(['Month', 'Web', 'Mobile']);
  });
});
