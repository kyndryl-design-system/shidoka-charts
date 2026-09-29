import { describe, expect, it } from 'vitest';
import { formatChordInteractionTooltip } from './chord-tooltip';
import type { ChartInteraction } from '../../internal/chart-frame/types';
import type { ChordModel } from './chord.types';

const model: ChordModel = {
  nodes: [{ label: 'Americas' }, { label: 'EMEA' }],
  matrix: [
    [0, 2840],
    [2210, 0],
  ],
  valueLabel: 'Calls per minute',
  sourceLabel: 'From',
  targetLabel: 'To',
  showLabels: true,
  padAngle: 0.04,
};

describe('formatChordInteractionTooltip', () => {
  it('formats ribbon hover detail with the semantic value label', () => {
    const interaction: ChartInteraction = {
      kind: 'hover',
      label: 'Americas',
      value: 2840,
      path: ['Americas', 'EMEA'],
      pointer: { clientX: 10, clientY: 20 },
    };

    expect(formatChordInteractionTooltip(interaction, model)).toEqual({
      lines: ['Americas → EMEA', 'Calls per minute: 2,840'],
    });
  });

  it('formats arc hover detail as a segment total', () => {
    const interaction: ChartInteraction = {
      kind: 'hover',
      label: 'Americas',
      value: 5050,
      path: ['Americas'],
      pointer: { clientX: 10, clientY: 20 },
    };

    expect(formatChordInteractionTooltip(interaction, model)).toEqual({
      lines: ['Americas', 'Calls per minute: 5,050'],
    });
  });
});
