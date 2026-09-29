import { describe, expect, it } from 'vitest';
import { buildAreaTable } from './chart-area-table';
import type { AreaModel } from './area.types';

const baseModel: AreaModel = {
  categories: ['Q1', 'Q2', 'Q3'],
  series: [
    { name: 'Platform', values: [12.4, 13.1, 14.0] },
    { name: 'Services', values: [6.2, 6.8, 7.1] },
  ],
  categoryLabel: 'Quarter',
  valueLabel: 'Revenue',
  showLegend: true,
  stacked: false,
  smooth: false,
  showPoints: false,
};

describe('buildAreaTable', () => {
  it('maps categories and series into columns and rows', () => {
    const table = buildAreaTable(baseModel);

    expect(table.columns).toEqual(['Quarter', 'Platform', 'Services']);
    expect(table.rows).toEqual([
      ['Q1', 12.4, 6.2],
      ['Q2', 13.1, 6.8],
      ['Q3', 14.0, 7.1],
    ]);
  });

  it('renders a missing value as an empty string', () => {
    const model: AreaModel = {
      ...baseModel,
      series: [
        { name: 'Platform', values: [12.4, null, 14.0] },
        { name: 'Services', values: [6.2, 6.8, 7.1] },
      ],
    };

    const table = buildAreaTable(model);

    expect(table.rows[1]).toEqual(['Q2', '', 6.8]);
  });

  it('builds a single column table for a single series', () => {
    const model: AreaModel = {
      ...baseModel,
      series: [{ name: 'Platform', values: [12.4, 13.1, 14.0] }],
    };

    const table = buildAreaTable(model);

    expect(table.columns).toEqual(['Quarter', 'Platform']);
    expect(table.rows).toEqual([
      ['Q1', 12.4],
      ['Q2', 13.1],
      ['Q3', 14.0],
    ]);
  });

  it('builds a wide table for many series', () => {
    const model: AreaModel = {
      ...baseModel,
      series: [
        { name: 'Platform', values: [12.4, 13.1, 14.0] },
        { name: 'Services', values: [6.2, 6.8, 7.1] },
        { name: 'Add-ons', values: [2.1, 2.4, 2.6] },
      ],
    };

    const table = buildAreaTable(model);

    expect(table.columns).toEqual([
      'Quarter',
      'Platform',
      'Services',
      'Add-ons',
    ]);
    expect(table.rows[0]).toEqual(['Q1', 12.4, 6.2, 2.1]);
  });

  it('returns an empty rows list when there are no categories', () => {
    const model: AreaModel = { ...baseModel, categories: [] };

    const table = buildAreaTable(model);

    expect(table.rows).toEqual([]);
    expect(table.columns).toEqual(['Quarter', 'Platform', 'Services']);
  });
});
