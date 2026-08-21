import { describe, expect, it } from 'vitest';
import { selectionFromPlacement } from './sunburst-labels';
import type { SunburstLabelPlacement } from './sunburst.types';

describe('selectionFromPlacement', () => {
  it('maps a constrained overlay placement to a select interaction', () => {
    const placement: SunburstLabelPlacement = {
      path: ['Identity', 'Single sign-on session expiry'],
      label: 'Single sign-on session expiry',
      value: 184,
      display: 'truncated',
      text: 'Single sign…',
      chipCapacityPx: 72,
      angleDegrees: 12,
      radiusFraction: 0.76,
    };

    expect(selectionFromPlacement(placement)).toEqual({
      kind: 'select',
      label: 'Single sign-on session expiry',
      value: 184,
      path: ['Identity', 'Single sign-on session expiry'],
    });
  });
});
