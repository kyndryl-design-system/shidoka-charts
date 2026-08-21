import { describe, expect, it } from 'vitest';
import {
  constrainedPlacements,
  labelPathKey,
  placementPosition,
  planSunburstLabels,
  suppressedLabelKeys,
} from './sunburst-labels';
import type { SunburstModel } from './sunburst.types';

function model(overrides: Partial<SunburstModel> = {}): SunburstModel {
  return {
    // 'Data' takes most of the circle, so the branch beside it is narrow
    // enough to truncate and its smallest child has no room for text at all.
    nodes: [
      {
        label: 'Identity and access management',
        children: [
          { label: 'Single sign-on session expiry', value: 58 },
          { label: 'Role assignment propagation', value: 2 },
        ],
      },
      { label: 'Data', value: 440 },
    ],
    categoryLabel: 'Cause',
    valueLabel: 'Tickets',
    showLabels: true,
    labelStrategy: 'constrained',
    innerRadiusRatio: 0,
    ...overrides,
  };
}

describe('planSunburstLabels', () => {
  it('plans one placement per node in the hierarchy', () => {
    const placements = planSunburstLabels(model());

    expect(placements.map((placement) => placement.path)).toEqual([
      ['Identity and access management'],
      ['Identity and access management', 'Single sign-on session expiry'],
      ['Identity and access management', 'Role assignment propagation'],
      ['Data'],
    ]);
  });

  it('keeps a label inline when its sector is wide enough', () => {
    const [placement] = planSunburstLabels(
      model({ nodes: [{ label: 'Data', value: 100 }] })
    );

    expect(placement.display).toBe('inline');
    expect(placement.text).toBe('Data');
  });

  it('truncates a label that does not fit and keeps the full label', () => {
    const placements = planSunburstLabels(model());
    const branch = placements[0];

    expect(branch.display).toBe('truncated');
    expect(branch.text.endsWith('…')).toBe(true);
    expect(branch.text.length).toBeLessThan(branch.label.length);
    expect(branch.label).toBe('Identity and access management');
  });

  it('falls back to a marker when no readable text fits', () => {
    const sliver = planSunburstLabels(model()).find(
      (placement) => placement.label === 'Role assignment propagation'
    );

    expect(sliver?.display).toBe('marker');
    expect(sliver?.text).toBe('…');
    expect(sliver?.value).toBe(2);
  });

  it('reports value as the rolled up total for branch nodes', () => {
    const branch = planSunburstLabels(model())[0];

    expect(branch.value).toBe(60);
  });

  it('places deeper nodes farther from the center', () => {
    const placements = planSunburstLabels(model());

    expect(placements[1].radiusFraction).toBeGreaterThan(
      placements[0].radiusFraction
    );
  });

  it('starts the first sector at the top and sweeps clockwise', () => {
    const placements = planSunburstLabels(
      model({
        nodes: [
          { label: 'A', value: 25 },
          { label: 'B', value: 25 },
          { label: 'C', value: 25 },
          { label: 'D', value: 25 },
        ],
      })
    );

    expect(placements.map((placement) => placement.angleDegrees)).toEqual([
      45, -45, -135, -225,
    ]);
  });

  it('offsets placements from the center by the ring radius', () => {
    const [top] = planSunburstLabels(
      model({ nodes: [{ label: 'A', value: 1 }] })
    );
    const { leftPercent, topPercent } = placementPosition(top);

    // One sector covering the whole circle: it starts at 12 o'clock, so its
    // mid angle is 6 o'clock, half of the 46% outer radius from the center.
    expect(leftPercent).toBeCloseTo(50, 6);
    expect(topPercent).toBeCloseTo(73, 6);
  });
});

describe('constrained label suppression', () => {
  it('selects only the placements that cannot show their full label', () => {
    const constrained = constrainedPlacements(planSunburstLabels(model()));

    expect(constrained.map((placement) => placement.label)).toEqual([
      'Identity and access management',
      'Single sign-on session expiry',
      'Role assignment propagation',
    ]);
  });

  it('keys suppressed labels by full path so repeated labels stay distinct', () => {
    const keys = suppressedLabelKeys(
      planSunburstLabels(
        model({
          nodes: [
            {
              label: 'Region one',
              children: [
                { label: 'Unresolved escalation', value: 1 },
                { label: 'Resolved', value: 99 },
              ],
            },
            {
              label: 'Region two',
              children: [
                { label: 'Unresolved escalation', value: 1 },
                { label: 'Resolved', value: 99 },
              ],
            },
          ],
        })
      )
    );

    expect(
      keys.has(labelPathKey(['Region one', 'Unresolved escalation']))
    ).toBe(true);
    expect(
      keys.has(labelPathKey(['Region two', 'Unresolved escalation']))
    ).toBe(true);
  });

  it('suppresses nothing when every label fits', () => {
    const keys = suppressedLabelKeys(
      planSunburstLabels(
        model({
          nodes: [
            { label: 'A', value: 50 },
            { label: 'B', value: 50 },
          ],
        })
      )
    );

    expect(keys.size).toBe(0);
  });
});
