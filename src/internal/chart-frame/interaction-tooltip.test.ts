import { describe, expect, it } from 'vitest';
import { formatDefaultInteractionTooltip } from './interaction-tooltip';
import type { ChartInteraction } from './types';

describe('formatDefaultInteractionTooltip', () => {
  it('returns null for non-hover interactions', () => {
    const interaction: ChartInteraction = {
      kind: 'select',
      label: 'A',
      value: 4,
      path: ['A', 'B'],
    };

    expect(formatDefaultInteractionTooltip(interaction)).toBeNull();
  });

  it('formats a multi-step path as a directed flow', () => {
    const interaction: ChartInteraction = {
      kind: 'hover',
      label: 'Americas',
      value: 2840,
      path: ['Americas', 'EMEA'],
    };

    expect(formatDefaultInteractionTooltip(interaction)).toEqual({
      lines: ['Americas → EMEA', '2,840'],
    });
  });

  it('falls back to the label when the path is empty', () => {
    const interaction: ChartInteraction = {
      kind: 'hover',
      label: 'Americas',
      value: null,
      path: [],
    };

    expect(formatDefaultInteractionTooltip(interaction)).toEqual({
      lines: ['Americas'],
    });
  });
});
