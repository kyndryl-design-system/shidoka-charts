import { describe, expect, it } from 'vitest';
import { buildChordGeometry } from './chord-layout';
import type { ChartTheme } from '../../chart-frame/types';
import type { ChordModel } from '../../../components/chart-chord/chord.types';

const theme: ChartTheme = {
  colorScheme: 'light',
  backgroundColor: '#ffffff',
  textColor: '#111111',
  secondaryTextColor: '#555555',
  borderColor: '#dddddd',
  tooltipBackgroundColor: '#222222',
  tooltipTextColor: '#fafafa',
  palette: ['#aa0000', '#00aa00', '#0000aa'],
};

const model: ChordModel = {
  nodes: [{ label: 'A' }, { label: 'B' }, { label: 'C', color: '#654321' }],
  matrix: [
    [0, 5, 2],
    [3, 0, 0],
    [1, 4, 0],
  ],
  valueLabel: 'Flows',
  sourceLabel: 'From',
  targetLabel: 'To',
  showLabels: true,
  padAngle: 0.05,
};

describe('buildChordGeometry', () => {
  it('produces one arc per node with a drawable path', () => {
    const geometry = buildChordGeometry(model, theme, 600);

    expect(geometry.arcs).toHaveLength(3);
    expect(geometry.arcs.map((arc) => arc.label)).toEqual(['A', 'B', 'C']);
    for (const arc of geometry.arcs) {
      expect(arc.path.startsWith('M')).toBe(true);
    }
  });

  it('produces one ribbon per non-zero flow pair', () => {
    const geometry = buildChordGeometry(model, theme, 600);

    // A-B, A-C and B-C are all connected in at least one direction.
    expect(geometry.ribbons).toHaveLength(3);
    for (const ribbon of geometry.ribbons) {
      expect(ribbon.path.startsWith('M')).toBe(true);
      expect(ribbon.value).toBeGreaterThan(0);
    }
  });

  it('colors from the palette unless the node overrides it', () => {
    const geometry = buildChordGeometry(model, theme, 600);

    expect(geometry.arcs[0].color).toBe('#aa0000');
    expect(geometry.arcs[1].color).toBe('#00aa00');
    expect(geometry.arcs[2].color).toBe('#654321');
  });

  it('flips labels on the left half so text stays readable', () => {
    const geometry = buildChordGeometry(model, theme, 600);
    const anchors = new Set(geometry.arcs.map((arc) => arc.labelAnchor));

    expect(anchors.size).toBeGreaterThan(1);
    for (const arc of geometry.arcs) {
      expect(arc.labelTransform).toMatch(
        /^rotate\(-?\d+(\.\d+)?\) translate\(/
      );
      if (arc.labelAnchor === 'end') {
        expect(arc.labelTransform.endsWith('rotate(180)')).toBe(true);
      }
    }
  });

  it('scales the radius with the requested size and enforces a floor', () => {
    const small = buildChordGeometry(model, theme, 320);
    const large = buildChordGeometry(model, theme, 800);
    const degenerate = buildChordGeometry(model, theme, 0);

    expect(large.outerRadius).toBeGreaterThan(small.outerRadius);
    expect(degenerate.size).toBeGreaterThan(0);
    expect(degenerate.outerRadius).toBeGreaterThan(0);
  });

  it('reserves less room when labels are hidden', () => {
    const withLabels = buildChordGeometry(model, theme, 600);
    const withoutLabels = buildChordGeometry(
      { ...model, showLabels: false },
      theme,
      600
    );

    expect(withoutLabels.outerRadius).toBeGreaterThan(withLabels.outerRadius);
  });

  it('tolerates a ragged matrix and an out of range pad angle', () => {
    const ragged = buildChordGeometry(
      {
        ...model,
        matrix: [[0, 1], [2], []],
        padAngle: 99,
      },
      theme,
      600
    );

    expect(ragged.arcs).toHaveLength(3);
    expect(ragged.ribbons.length).toBeGreaterThan(0);
  });

  it('does not touch the DOM', () => {
    expect(typeof globalThis.document).toBe('undefined');
  });
});
