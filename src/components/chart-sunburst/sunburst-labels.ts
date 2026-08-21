import type {
  SunburstModel,
  SunburstNode,
  SunburstLabelPlacement,
} from './sunburst.types';
import { hierarchyDepth, nodeTotal } from './sunburst-table';

/**
 * Pure label placement planning for the sunburst.
 *
 * A sector's angular span is a property of the data, not of the engine: it is
 * the node's share of its parent's span. That makes it possible to decide
 * whether a label fits, and where a replacement anchor belongs, without asking
 * the renderer anything. Safe to import without DOM globals.
 */

/**
 * Angular budget per character. Text is not measured here, so this is a
 * deliberate heuristic: it is the angle a 12px character needs at the middle
 * of a typical ring. Sectors narrower than `MIN_CHARS` characters get a marker
 * instead of text.
 */
const RADIANS_PER_CHAR = 0.055;
const MIN_CHARS = 4;
const ELLIPSIS = '…';

/** Sunburst starts at 12 o'clock and sweeps clockwise. */
const START_ANGLE_DEG = 90;
/** Outer radius used by the generated option, as a fraction of the radius box. */
export const OUTER_RADIUS_FRACTION = 0.92;

interface Walked {
  node: SunburstNode;
  depth: number;
  /** Cumulative share of the full circle where this sector starts. */
  startFraction: number;
  /** Share of the full circle this sector covers. */
  spanFraction: number;
  path: string[];
}

function walk(
  nodes: readonly SunburstNode[],
  depth: number,
  startFraction: number,
  spanFraction: number,
  parentPath: readonly string[],
  out: Walked[]
): void {
  const total = nodes.reduce((sum, node) => sum + nodeTotal(node), 0);
  if (total <= 0) return;

  let cursor = startFraction;

  for (const node of nodes) {
    const share = (nodeTotal(node) / total) * spanFraction;
    const path = [...parentPath, node.label];

    out.push({
      node,
      depth,
      startFraction: cursor,
      spanFraction: share,
      path,
    });

    if (node.children?.length) {
      walk(node.children, depth + 1, cursor, share, path, out);
    }

    cursor += share;
  }
}

function truncateTo(label: string, budget: number): string {
  if (budget >= label.length) return label;
  if (budget < MIN_CHARS) return ELLIPSIS;

  return label.slice(0, budget - 1).trimEnd() + ELLIPSIS;
}

/**
 * Plans one placement per node. `display` is `inline` when the full label fits
 * the sector, `truncated` when a shortened label still carries meaning, and
 * `marker` when nothing readable fits.
 */
export function planSunburstLabels(
  model: SunburstModel
): SunburstLabelPlacement[] {
  const walked: Walked[] = [];
  walk(model.nodes, 0, 0, 1, [], walked);

  const levels = Math.max(hierarchyDepth(model.nodes), 1);
  const innerFraction = Math.min(Math.max(model.innerRadiusRatio, 0), 0.8);
  const ringWidth = (OUTER_RADIUS_FRACTION - innerFraction) / levels;

  return walked.map((entry) => {
    const angle = entry.spanFraction * Math.PI * 2;
    const budget = Math.floor(angle / RADIANS_PER_CHAR);
    const label = entry.node.label;

    const display =
      budget >= label.length
        ? 'inline'
        : budget >= MIN_CHARS
        ? 'truncated'
        : 'marker';

    const midFraction = entry.startFraction + entry.spanFraction / 2;

    return {
      path: entry.path,
      label,
      value: nodeTotal(entry.node),
      display,
      text: display === 'inline' ? label : truncateTo(label, budget),
      angleDegrees: START_ANGLE_DEG - midFraction * 360,
      radiusFraction: innerFraction + ringWidth * (entry.depth + 0.5),
    };
  });
}

/** Placements whose label does not fit and therefore need a tooltip anchor. */
export function constrainedPlacements(
  placements: readonly SunburstLabelPlacement[]
): SunburstLabelPlacement[] {
  return placements.filter((placement) => placement.display !== 'inline');
}

/**
 * Position of a placement inside a square overlay that matches the chart's
 * radius box, expressed in percent so no pixel measurement is needed.
 */
export function placementPosition(placement: SunburstLabelPlacement): {
  leftPercent: number;
  topPercent: number;
} {
  const radians = (placement.angleDegrees * Math.PI) / 180;
  const offset = placement.radiusFraction * 50;

  return {
    leftPercent: 50 + Math.cos(radians) * offset,
    topPercent: 50 - Math.sin(radians) * offset,
  };
}

/**
 * Lookup key for a node path. Uses a unit separator so labels containing
 * ordinary punctuation cannot collide.
 */
export function labelPathKey(path: readonly string[]): string {
  return path.join('\u001f');
}

/** Paths whose chart-drawn label must be suppressed. */
export function suppressedLabelKeys(
  placements: readonly SunburstLabelPlacement[]
): Set<string> {
  return new Set(
    constrainedPlacements(placements).map((placement) =>
      labelPathKey(placement.path)
    )
  );
}
