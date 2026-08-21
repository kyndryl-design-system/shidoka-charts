import { describe, expect, it } from 'vitest';
import { tableViewToCsv, toSafeFileName } from './csv';
import { mergeNativeOverrides } from './merge';
import { paletteColor } from './palette';
import {
  buildSunburstTable,
  flattenHierarchy,
  hierarchyDepth,
  hierarchyTotal,
} from '../../components/chart-sunburst/sunburst-table';
import {
  buildChordTable,
  matrixTotal,
  normalizeMatrix,
} from '../../components/chart-chord/chord-table';
import type { SunburstModel } from '../../components/chart-sunburst/sunburst.types';
import type { ChordModel } from '../../components/chart-chord/chord.types';

const sunburst: SunburstModel = {
  nodes: [
    {
      label: 'Compute',
      children: [
        { label: 'VMs', value: 10 },
        { label: 'Serverless', value: 5 },
      ],
    },
    { label: 'Storage', value: 8 },
  ],
  categoryLabel: 'Service',
  valueLabel: 'Spend',
  showLabels: true,
  innerRadiusRatio: 0,
};

const chord: ChordModel = {
  nodes: [{ label: 'A' }, { label: 'B, Inc' }],
  matrix: [
    [0, 4],
    [7, 0],
  ],
  valueLabel: 'Flows',
  sourceLabel: 'From',
  targetLabel: 'To',
  showLabels: true,
  padAngle: 0.04,
};

describe('sunburst table mapping', () => {
  it('sums leaf values up the hierarchy', () => {
    expect(hierarchyTotal(sunburst.nodes)).toBe(23);
  });

  it('reports the depth of the deepest branch', () => {
    expect(hierarchyDepth(sunburst.nodes)).toBe(2);
    expect(hierarchyDepth([])).toBe(0);
  });

  it('flattens to leaf paths', () => {
    expect(flattenHierarchy(sunburst.nodes)).toEqual([
      { path: ['Compute', 'VMs'], value: 10 },
      { path: ['Compute', 'Serverless'], value: 5 },
      { path: ['Storage'], value: 8 },
    ]);
  });

  it('builds one column per level plus the value column', () => {
    const table = buildSunburstTable(sunburst);

    expect(table.columns).toEqual(['Service', 'Service level 2', 'Spend']);
    expect(table.rows).toEqual([
      ['Compute', 'VMs', 10],
      ['Compute', 'Serverless', 5],
      ['Storage', '', 8],
    ]);
  });

  it('collapses to two columns for a flat hierarchy', () => {
    const table = buildSunburstTable({
      ...sunburst,
      nodes: [{ label: 'Storage', value: 8 }],
    });

    expect(table.columns).toEqual(['Service', 'Spend']);
    expect(table.rows).toEqual([['Storage', 8]]);
  });
});

describe('chord table mapping', () => {
  it('squares a ragged matrix and drops non-positive cells', () => {
    expect(normalizeMatrix([[1, -2], [Number.NaN]], 2)).toEqual([
      [1, 0],
      [0, 0],
    ]);
  });

  it('emits one row per directed flow', () => {
    expect(buildChordTable(chord)).toEqual({
      columns: ['From', 'To', 'Flows'],
      rows: [
        ['A', 'B, Inc', 4],
        ['B, Inc', 'A', 7],
      ],
    });
  });

  it('totals every flow', () => {
    expect(matrixTotal(chord.matrix)).toBe(11);
  });
});

describe('csv serialization', () => {
  it('quotes cells containing the delimiter', () => {
    expect(tableViewToCsv(buildChordTable(chord))).toBe(
      'From,To,Flows\nA,"B, Inc",4\n"B, Inc",A,7\n'
    );
  });

  it('escapes embedded quotes', () => {
    expect(tableViewToCsv({ columns: ['a'], rows: [['say "hi"']] })).toBe(
      'a\n"say ""hi"""\n'
    );
  });

  it('returns nothing for an empty table', () => {
    expect(tableViewToCsv({ columns: ['a'], rows: [] })).toBe('');
  });

  it('sanitizes file names and falls back when empty', () => {
    expect(toSafeFileName('Q1/Q2: spend', 'chart')).toBe('Q1Q2 spend');
    expect(toSafeFileName('   ', 'chart')).toBe('chart');
  });
});

describe('native override merge', () => {
  it('merges arrays by index instead of concatenating', () => {
    expect(
      mergeNativeOverrides({ series: [{ a: 1, b: 2 }] }, { series: [{ b: 9 }] })
    ).toEqual({ series: [{ a: 1, b: 9 }] });
  });

  it('appends array entries beyond the generated length', () => {
    expect(mergeNativeOverrides({ list: [1] }, { list: [1, 2] })).toEqual({
      list: [1, 2],
    });
  });

  it('keeps the generated value for an explicit undefined override', () => {
    expect(mergeNativeOverrides({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
  });

  it('replaces scalars and functions', () => {
    const replacement = () => 'x';

    expect(mergeNativeOverrides({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
    expect(
      mergeNativeOverrides({ formatter: () => 'y' }, { formatter: replacement })
        .formatter
    ).toBe(replacement);
  });
});

describe('palette', () => {
  it('cycles when the palette is shorter than the data', () => {
    expect(paletteColor(['#a', '#b'], 3)).toBe('#b');
    expect(paletteColor(['#a', '#b'], 2)).toBe('#a');
  });

  it('falls back to the built in palette when empty', () => {
    expect(paletteColor([], 0)).toMatch(/^#/);
  });
});
