import { describe, expect, it } from 'vitest';
import {
  constrainedPlacements,
  DEFAULT_LABEL_METRICS,
  estimateChipWidthPx,
  labelPathKey,
  placementClearancePx,
  placementPosition,
  planSunburstLabels,
  suppressedLabelKeys,
} from './sunburst-labels';
import type {
  SunburstLabelMetrics,
  SunburstLabelPlacement,
  SunburstModel,
} from './sunburst.types';

function model(overrides: Partial<SunburstModel> = {}): SunburstModel {
  return {
    // 'Data' is short and takes most of the circle, so it is drawn as it is,
    // while the branch beside it is long enough to truncate and its smallest
    // child has no room for text at all.
    nodes: [
      {
        label: 'Identity and access management',
        children: [
          { label: 'Single sign-on session expiry', value: 58 },
          { label: 'Role assignment propagation', value: 2 },
        ],
      },
      { label: 'Data', value: 100 },
    ],
    categoryLabel: 'Cause',
    valueLabel: 'Tickets',
    showLabels: true,
    labelStrategy: 'constrained',
    innerRadiusRatio: 0,
    ...overrides,
  };
}

/** The data and geometry behind the constrained Storybook example. */
const constrainedStory = model({
  nodes: [
    {
      label: 'Identity and access management',
      children: [
        { label: 'Single sign-on session expiry', value: 184 },
        { label: 'Multi-factor enrollment failure', value: 96 },
        { label: 'Directory synchronization lag', value: 41 },
        { label: 'Role assignment propagation', value: 22 },
      ],
    },
    {
      label: 'Data platform',
      children: [
        { label: 'Warehouse query timeout', value: 133 },
        { label: 'Ingestion schema drift', value: 78 },
        { label: 'Replication checkpoint reset', value: 27 },
        { label: 'Retention policy conflict', value: 14 },
      ],
    },
    {
      label: 'Observability',
      children: [
        { label: 'Alert routing misconfiguration', value: 89 },
        { label: 'Dashboard permission scope', value: 35 },
        { label: 'Trace sampling gap', value: 18 },
      ],
    },
    {
      label: 'Networking',
      children: [
        { label: 'Egress rate limiting', value: 64 },
        { label: 'Certificate rotation', value: 31 },
        { label: 'Private endpoint resolution', value: 12 },
      ],
    },
  ],
  innerRadiusRatio: 0.2,
});

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

describe('label fitting geometry', () => {
  const metrics = (radiusPx: number): SunburstLabelMetrics => ({
    radiusPx,
    fontSizePx: 12,
  });

  /** A wide sector on the inner ring: plenty of angle, little ring depth. */
  const wideAndLong = model({
    nodes: [
      {
        label: 'Identity and access management',
        children: [{ label: 'A', value: 1 }],
      },
      { label: 'B', value: 1 },
    ],
  });

  it('constrains a wide inner-ring label that is longer than its ring is thick', () => {
    const [inner] = planSunburstLabels(wideAndLong, metrics(210));

    // Half the circle of angle, so an angle-only rule would call this inline.
    expect(inner.display).toBe('truncated');
    expect(inner.text.length).toBeLessThan(inner.label.length);
  });

  it('lets the same label go inline once the rings are thick enough', () => {
    const [inner] = planSunburstLabels(wideAndLong, metrics(900));

    expect(inner.display).toBe('inline');
    expect(inner.text).toBe('Identity and access management');
  });

  it('tightens the budget as the host shrinks', () => {
    const budgets = [900, 210, 120, 20].map(
      (radiusPx) => planSunburstLabels(wideAndLong, metrics(radiusPx))[0]
    );

    expect(budgets.map((placement) => placement.display)).toEqual([
      'inline',
      'truncated',
      'truncated',
      'marker',
    ]);
    expect(budgets[1].text.length).toBeGreaterThan(budgets[2].text.length);
  });

  it('allows a label to overhang its ring by up to half a ring width', () => {
    // One ring across a 210px radius is 193.2px thick, which is 32 characters
    // at half of a 12px font. The overhang allowance stretches that to 48.
    const single = (label: string) =>
      planSunburstLabels(
        model({ nodes: [{ label, value: 1 }] }),
        metrics(210)
      )[0].display;

    expect(single('x'.repeat(32))).toBe('inline');
    expect(single('x'.repeat(48))).toBe('inline');
    expect(single('x'.repeat(49))).toBe('truncated');
  });

  it('keeps ordinary labels inline while constraining the ones that spill', () => {
    // Widths measured in Roboto at 12px, as ring width multiples: these sit at
    // 0.83, 1.23 and 2.14.
    const displays = planSunburstLabels(
      model({
        nodes: [
          {
            label: 'Observability',
            children: [{ label: 'Egress rate limiting', value: 1 }],
          },
          { label: 'Identity and access management', value: 1 },
        ],
        innerRadiusRatio: 0.2,
      }),
      metrics(230)
    ).map((placement) => placement.display);

    expect(displays).toEqual(['inline', 'inline', 'truncated']);
  });

  it('keeps every planned pill inside the sector it labels', () => {
    const pills = planSunburstLabels(constrainedStory, metrics(230)).filter(
      (placement) => placement.display === 'truncated'
    );

    // The marker is a circle sized to itself, so only text pills are bounded.
    expect(pills.length).toBeGreaterThan(4);

    for (const pill of pills) {
      expect(estimateChipWidthPx(pill.text)).toBeLessThanOrEqual(
        pill.chipCapacityPx
      );
    }
  });

  it('cuts pills well short of what a drawn label is allowed to overhang', () => {
    const placements = planSunburstLabels(constrainedStory, metrics(230));
    const shown = (label: string) =>
      placements.find((placement) => placement.label === label)?.text ?? '';

    // A ring is 82.8px here, so a drawn label may run to 20 characters. Pills
    // get no such allowance, and the broad outer band with the most room of any
    // of them still stops well inside it.
    expect(shown('Single sign-on session expiry')).toBe('Single sign-on…');
    expect(shown('Identity and access management')).toBe('Identity a…');
    expect(shown('Multi-factor enrollment failure')).toBe('Multi-fact…');
  });

  it('holds a label to the drawn allowance but its pill to the strict fit', () => {
    // One ring across a 210px radius is 193.2px, which is 32 characters at half
    // of a 12px font. The drawn allowance stretches that to 48; a pill lying
    // across the same ring, paying for its own chrome, gets 29.
    const single = (label: string) =>
      planSunburstLabels(
        model({ nodes: [{ label, value: 1 }] }),
        metrics(210)
      )[0];

    expect(single('x'.repeat(48)).display).toBe('inline');
    expect(single('x'.repeat(48)).text.length).toBe(48);

    const overrun = single('x'.repeat(49));

    expect(overrun.display).toBe('truncated');
    expect(overrun.text.length).toBe(29);
    expect(estimateChipWidthPx(overrun.text)).toBeLessThanOrEqual(
      overrun.chipCapacityPx
    );
  });

  it('marks a sector too narrow to hold a level pill', () => {
    // Its ring is thick, but 27 tickets out of 844 leave it barely wider than
    // the pill's own padding at that radius.
    const narrow = planSunburstLabels(constrainedStory, metrics(230)).find(
      (candidate) => candidate.label === 'Replication checkpoint reset'
    );

    expect(narrow?.display).toBe('marker');
    expect(narrow?.text).toBe('…');
  });

  it('constrains a label that fits one ring but not three', () => {
    const label = 'Directory sync lag';
    const oneLevel = model({ nodes: [{ label, value: 100 }] });
    const threeLevels = model({
      nodes: [
        {
          label,
          children: [{ label: 'x', children: [{ label: 'y', value: 100 }] }],
        },
      ],
    });

    expect(planSunburstLabels(oneLevel, metrics(210))[0].display).toBe(
      'inline'
    );
    expect(planSunburstLabels(threeLevels, metrics(210))[0].display).toBe(
      'truncated'
    );
  });

  it('uses a marker for a thin sector even when the ring is thick', () => {
    const placements = planSunburstLabels(
      model({
        nodes: [
          { label: 'Sliver', value: 1 },
          { label: 'Rest', value: 999 },
        ],
      }),
      metrics(210)
    );

    // One ring across the whole radius, so length is not the problem here.
    expect(placements[0].display).toBe('marker');
    expect(placements[1].display).toBe('inline');
  });

  it('takes the inner radius into account when sizing rings', () => {
    const nodes = [
      { label: 'Directory', children: [{ label: 'x', value: 1 }] },
    ];

    expect(
      planSunburstLabels(model({ nodes, innerRadiusRatio: 0 }), metrics(210))[0]
        .display
    ).toBe('inline');
    expect(
      planSunburstLabels(
        model({ nodes, innerRadiusRatio: 0.7 }),
        metrics(210)
      )[0].display
    ).toBe('truncated');
  });

  it('reads metrics off the model so every caller plans the same way', () => {
    const small = model({ labelMetrics: metrics(120) });
    const large = model({ labelMetrics: metrics(900) });

    expect(planSunburstLabels(small)).toEqual(
      planSunburstLabels(small, metrics(120))
    );
    expect(planSunburstLabels(large)[0].display).toBe('inline');
    expect(planSunburstLabels(small)[0].display).toBe('truncated');
  });

  it('falls back to the documented default before anything is measured', () => {
    const unmeasured = model();

    expect(planSunburstLabels(unmeasured)).toEqual(
      planSunburstLabels(unmeasured, DEFAULT_LABEL_METRICS)
    );
  });
});

describe('crowded rings', () => {
  const metrics = (radiusPx: number): SunburstLabelMetrics => ({
    radiusPx,
    fontSizePx: 12,
  });

  /** Adjacent placements on one ring, in the order they are drawn. */
  const neighbours = (placements: readonly SunburstLabelPlacement[]) =>
    [0, 1].flatMap((depth) => {
      const ring = placements.filter(
        (placement) => placement.path.length === depth + 1
      );

      return ring.map(
        (placement, index) =>
          [placement, ring[(index + 1) % ring.length]] as const
      );
    });

  it('keeps the bigger of two crowded neighbours and marks the other', () => {
    const placements = planSunburstLabels(constrainedStory, metrics(230));
    const shown = (label: string) =>
      placements.find((placement) => placement.label === label);

    // 34px between their midpoints for 30px of label, so one has to give. The
    // sectors are 35 and 18 tickets, and the smaller one gives.
    expect(shown('Dashboard permission scope')?.text).toBe('Dashbo…');
    expect(shown('Trace sampling gap')?.display).toBe('marker');
  });

  it('suppresses a drawn label that loses to a neighbour', () => {
    const placements = planSunburstLabels(constrainedStory, metrics(230));
    const trace = placements.find(
      (placement) => placement.label === 'Trace sampling gap'
    );

    // Its own sector had room for the chart to draw it, so without the
    // collision pass it would still be painted underneath the marker.
    expect(trace?.display).toBe('marker');
    expect(
      suppressedLabelKeys(placements).has(
        labelPathKey(['Observability', 'Trace sampling gap'])
      )
    ).toBe(true);
  });

  it('leaves no text label touching its neighbour at any size', () => {
    for (const radiusPx of [150, 230, 350]) {
      const placements = planSunburstLabels(
        constrainedStory,
        metrics(radiusPx)
      );

      for (const [first, second] of neighbours(placements)) {
        // Markers are the end of the line: two of them side by side in a small
        // chart have nothing left to give up, so they are allowed to touch.
        if (first.display === 'marker' && second.display === 'marker') continue;

        expect(
          placementClearancePx(first, second, radiusPx),
          `${first.label} beside ${second.label} at radius ${radiusPx}`
        ).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('gives the room to the larger sector of a crowded pair', () => {
    // Two sectors at the foot of the chart, where a level pill lies along the
    // arc and so spends its whole width on it. Each fits its own sector, but
    // not with its neighbour's pill beside it.
    const ring = planSunburstLabels(
      model({
        nodes: [
          {
            label: 'Region',
            children: [
              { label: 'Before', value: 475 },
              { label: 'Unresolved escalation', value: 60 },
              { label: 'Deferred escalation notice', value: 50 },
              { label: 'After', value: 415 },
            ],
          },
        ],
        innerRadiusRatio: 0.2,
      }),
      metrics(230)
    ).filter((placement) => placement.path.length === 2);

    const bigger = ring[1];
    const smaller = ring[2];

    expect(bigger.display).toBe('truncated');
    expect(smaller.display).toBe('marker');
  });

  it('needs no resolution once the chart is large enough', () => {
    const roomy = planSunburstLabels(constrainedStory, metrics(900));

    expect(roomy.every((placement) => placement.display === 'inline')).toBe(
      true
    );
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
