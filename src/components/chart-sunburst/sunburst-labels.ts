import type { ChartInteraction } from '../../internal/chart-frame/types';
import type {
  SunburstLabelMetrics,
  SunburstModel,
  SunburstNode,
  SunburstLabelPlacement,
} from './sunburst.types';
import { hierarchyDepth, nodeTotal } from './sunburst-table';

/**
 * Pure label placement planning for the sunburst.
 *
 * Near its midpoint a sector is close enough to a rectangle: as thick as its
 * ring in the radial direction and as long as its chord across the arc. Text
 * laid over it therefore has two constraints, a length and a height, and which
 * of them binds depends on the direction the text runs. Judging a label on its
 * angular span alone lets a long label in a wide but shallow sector claim to
 * fit and then spill over the ring boundary.
 *
 * Two questions come out of that, and they are deliberately not judged to the
 * same standard. Whether the chart may draw a label itself is a generous test:
 * a drawn label is bare text centred along its ring, so overhanging the ring a
 * little reads fine, and a strict rule there would replace labels that read
 * perfectly well. Whether an overlay pill can show a label is a strict one: a
 * pill lies flat across its sector with visible edges and its own padding, so a
 * pill that overruns its sector is plainly wrong. The generous budget therefore
 * only ever decides `display`, and the strict one alone sizes the text a pill
 * shows.
 *
 * Both are pixel questions, so the caller supplies measured geometry.
 * Everything here is arithmetic on that geometry and the model, with no DOM
 * access, so it is safe to import anywhere and cheap to test.
 */

/** Font size the renderer draws segment labels with. */
export const LABEL_FONT_SIZE_PX = 12;

/**
 * Metrics used until the host has been measured, for example on a server or
 * during the first paint. This is the radius of a square the size of the
 * frame's default height, and the first resize observation replaces it.
 */
export const DEFAULT_LABEL_METRICS: SunburstLabelMetrics = {
  radiusPx: 210,
  fontSizePx: LABEL_FONT_SIZE_PX,
};

/**
 * Average glyph advance as a fraction of the font size. Measuring the sunburst
 * story's labels in Roboto at 12px gives advances between 0.415 and 0.509 of
 * the font size, averaging 0.458, so half the font size is a fair estimate
 * with a little room for label-heavy uppercase.
 */
const CHAR_WIDTH_RATIO = 0.5;
/** A label needs this much of the arc to have room for one line of text. */
const LINE_HEIGHT_RATIO = 1.25;
/**
 * How far a label the chart draws itself may run past its ring before it counts
 * as not fitting.
 *
 * Drawn labels are bare text centred in their ring, so a little overhang reads
 * fine and demanding a strict fit turns almost every ordinary label into an
 * anchor. The measured labels in the sunburst story sit between 0.74 and 1.45
 * ring widths, while the ones that visibly spilled across the middle of the
 * chart start at 1.65, so the line is drawn at one and a half ring widths.
 *
 * This tolerance applies to that decision only. Overlay pills get no overhang.
 */
const RADIAL_OVERHANG = 1.5;
/** The pill's padding and border along its text, both ends together. */
const CHIP_CHROME_PX = 14;
/** The pill's padding and border across its text, both edges together. */
const CHIP_EDGE_CHROME_PX = 4;
/** Below this many characters a truncation carries no meaning, so use a marker. */
const MIN_CHARS = 4;
/** Rendered width of the ellipsis marker, which is round and text sized. */
const MARKER_DIAMETER_PX = 18;
/**
 * Clear space two neighbouring labels keep between them. Wide enough that
 * labels read as separate rather than merely not touching, which is what the
 * crowded outer band of the sunburst story needs: its `Trace sampling gap` and
 * `Dashboard permission scope` sectors leave 34px between their midpoints for
 * 30px of label.
 */
const LABEL_GAP_PX = 8;
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

/**
 * Longest pill that fits inside a sector, with the sector treated as a
 * rectangle `ringPx` deep and `chordPx` wide near the label's radius and the
 * pill as a level box `heightPx` tall whose text runs `across` the ring and
 * `along` the arc.
 *
 * Pills stay level while their sectors sit at every angle, so most of them meet
 * their sector's rectangle turned. A turned box spends both of its sides
 * against each boundary, and that is what keeps its corners out of the
 * neighbouring sectors. It also explains why pills at the sides of the chart
 * end up bounded by the ring and ones at the top and bottom by the chord,
 * without any rule about quadrants.
 */
function chipExtentPx(
  ringPx: number,
  chordPx: number,
  across: number,
  along: number,
  heightPx: number
): number {
  const alongRing = Math.abs(across);
  const alongArc = Math.abs(along);
  const radialRoom = ringPx - heightPx * alongArc;
  const tangentialRoom = chordPx - heightPx * alongRing;

  // The pill is taller than the sector in one direction or the other.
  if (radialRoom <= 0 || tangentialRoom <= 0) return 0;

  const radial = alongRing === 0 ? Infinity : radialRoom / alongRing;
  const tangential = alongArc === 0 ? Infinity : tangentialRoom / alongArc;

  return Math.min(radial, tangential);
}

/** Characters a pill of this length holds once its own chrome is paid for. */
function chipChars(lengthPx: number, charWidthPx: number): number {
  return Math.floor(Math.max(lengthPx - CHIP_CHROME_PX, 0) / charWidthPx);
}

/**
 * Rendered width of an overlay pill, estimated the way the planner budgets for
 * it. Exposed so callers and tests can check a planned pill against the room
 * its sector reported.
 */
export function estimateChipWidthPx(
  text: string,
  fontSizePx: number = LABEL_FONT_SIZE_PX
): number {
  return text.length * fontSizePx * CHAR_WIDTH_RATIO + CHIP_CHROME_PX;
}

function truncateTo(label: string, budget: number): string {
  if (budget >= label.length) return label;
  if (budget < MIN_CHARS) return ELLIPSIS;

  return label.slice(0, budget - 1).trimEnd() + ELLIPSIS;
}

/** A placement plus the geometry the collision pass needs to reason about it. */
interface Candidate {
  placement: SunburstLabelPlacement;
  depth: number;
  startFraction: number;
  /** Radius the label sits at, which is shared by everything on its ring. */
  midRadiusPx: number;
}

/**
 * How much of its ring's arc a label takes up, in pixels.
 *
 * A drawn label runs outwards along its radius, so what it spends on the arc is
 * one line of text. A pill lies level, so it spends its width where it lies
 * along the arc and its height where it lies across the ring, the same
 * projection that sized it in the first place. A marker is a circle, so it
 * spends its diameter whichever way it is approached.
 */
export function placementFootprintPx(
  placement: SunburstLabelPlacement,
  fontSizePx: number = LABEL_FONT_SIZE_PX
): number {
  if (placement.display === 'marker') return MARKER_DIAMETER_PX;

  const lineThicknessPx = fontSizePx * LINE_HEIGHT_RATIO;
  if (placement.display === 'inline') return lineThicknessPx;

  const radians = (placement.angleDegrees * Math.PI) / 180;

  return (
    estimateChipWidthPx(placement.text, fontSizePx) *
      Math.abs(Math.sin(radians)) +
    (lineThicknessPx + CHIP_EDGE_CHROME_PX) * Math.abs(Math.cos(radians))
  );
}

/**
 * Clear space between two labels on the same ring, in pixels along the arc.
 * Negative once they overlap.
 */
export function placementClearancePx(
  first: SunburstLabelPlacement,
  second: SunburstLabelPlacement,
  radiusPx: number,
  fontSizePx: number = LABEL_FONT_SIZE_PX
): number {
  const turn = Math.abs(first.angleDegrees - second.angleDegrees) % 360;
  const separation = Math.min(turn, 360 - turn);
  const gapPx =
    ((separation * Math.PI) / 180) * first.radiusFraction * radiusPx;

  return (
    gapPx -
    (placementFootprintPx(first, fontSizePx) +
      placementFootprintPx(second, fontSizePx)) /
      2
  );
}

/**
 * Which of two colliding labels keeps its text. Sector spans are proportional
 * to value at every depth, so the larger share of the total wins; a label the
 * chart draws itself wins an exact tie, and sector order settles the rest so
 * the outcome never depends on where the scan started.
 */
function outranks(first: Candidate, second: Candidate): boolean {
  if (first.placement.value !== second.placement.value) {
    return first.placement.value > second.placement.value;
  }

  const firstDrawn = first.placement.display === 'inline';
  if (firstDrawn !== (second.placement.display === 'inline')) return firstDrawn;

  return first.startFraction < second.startFraction;
}

/**
 * Reduces the lower-priority label of each colliding neighbouring pair to a
 * marker, ring by ring, until the ring is clear.
 *
 * Sectors are fixed, so a label cannot move: the only way to make room is to
 * give up text. Shortening every label instead would pay for a handful of
 * crowded neighbours across the whole chart, so the smaller of the two
 * neighbours gives up its text entirely and keeps its position and its tooltip.
 * A label that loses here reads as a marker even if the chart could have drawn
 * it, and `suppressedLabelKeys` then keeps the chart from drawing it underneath.
 */
function resolveRingCollisions(
  candidates: readonly Candidate[],
  radiusPx: number,
  fontSizePx: number
): void {
  const rings = new Map<number, Candidate[]>();

  for (const candidate of candidates) {
    const ring = rings.get(candidate.depth);
    if (ring) ring.push(candidate);
    else rings.set(candidate.depth, [candidate]);
  }

  for (const ring of rings.values()) {
    if (ring.length < 2) continue;

    ring.sort((a, b) => a.startFraction - b.startFraction);

    // Each pass can only ever demote, and a demoted label is a marker that
    // cannot be demoted again, so this settles in at most one pass per label.
    for (let pass = 0; pass < ring.length; pass++) {
      let demoted = false;

      for (let index = 0; index < ring.length; index++) {
        // The last pair wraps, since a full ring's ends are neighbours too.
        const here = ring[index];
        const next = ring[(index + 1) % ring.length];
        const clearance = placementClearancePx(
          here.placement,
          next.placement,
          radiusPx,
          fontSizePx
        );

        if (clearance >= LABEL_GAP_PX) continue;

        const loser = outranks(here, next) ? next : here;
        if (loser.placement.display === 'marker') continue;

        loser.placement.display = 'marker';
        loser.placement.text = ELLIPSIS;
        demoted = true;
      }

      if (!demoted) break;
    }
  }
}

/**
 * Plans one placement per node.
 *
 * `display` answers whether the chart can draw the label itself, which it only
 * does along the ring and with the overhang drawn text tolerates: `inline` when
 * the full label fits that way, `truncated` when the overlay has to take over,
 * and `marker` when not even a level pill has room for readable text.
 *
 * For the placements the overlay takes over, `text` and `chipCapacityPx` come
 * from the strict pill measurement instead, so the text is cut to room the pill
 * really has. A pill is sometimes roomy enough to show a label in full even
 * though the chart could not draw it.
 *
 * A label sized against its own sector can still land on top of its neighbour,
 * so a second pass walks each ring and reduces the smaller of any two colliding
 * labels to a marker. That runs last, which is why `display` here is the final
 * answer for both the overlay and the chart's own suppression.
 *
 * `metrics` describes the drawn size of the chart. Callers that have not
 * measured the host yet can omit it and get the documented default.
 */
export function planSunburstLabels(
  model: SunburstModel,
  metrics: SunburstLabelMetrics = model.labelMetrics ?? DEFAULT_LABEL_METRICS
): SunburstLabelPlacement[] {
  const walked: Walked[] = [];
  walk(model.nodes, 0, 0, 1, [], walked);

  const levels = Math.max(hierarchyDepth(model.nodes), 1);
  const innerFraction = Math.min(Math.max(model.innerRadiusRatio, 0), 0.8);
  const ringWidth = (OUTER_RADIUS_FRACTION - innerFraction) / levels;

  const radiusPx = Math.max(metrics.radiusPx, 0);
  const fontSizePx = Math.max(metrics.fontSizePx, 1);
  const charWidthPx = fontSizePx * CHAR_WIDTH_RATIO;
  const minLineThicknessPx = fontSizePx * LINE_HEIGHT_RATIO;

  const chipHeightPx = minLineThicknessPx + CHIP_EDGE_CHROME_PX;

  const ringPx = ringWidth * radiusPx;
  // Rings are all equally thick, so the room a drawn label has is one number
  // for the whole chart: its ring, plus the overhang that ring tolerates.
  const drawnLengthPx = ringPx * RADIAL_OVERHANG;

  const candidates = walked.map((entry): Candidate => {
    const label = entry.node.label;
    const radiusFraction = innerFraction + ringWidth * (entry.depth + 0.5);
    const midRadiusPx = radiusFraction * radiusPx;
    const spanRadians = entry.spanFraction * Math.PI * 2;
    const angleDegrees =
      START_ANGLE_DEG - (entry.startFraction + entry.spanFraction / 2) * 360;

    // Straight-line room across the sector where the label sits. Capped at half
    // a turn so a sector wider than that does not report a shrinking chord.
    const chordPx =
      2 * midRadiusPx * Math.sin(Math.min(spanRadians, Math.PI) / 2);
    const arcThicknessPx = spanRadians * midRadiusPx;

    // What the chart may draw itself. It writes along the ring, so the arc has
    // to be deep enough for one line of text.
    const drawnBudget =
      arcThicknessPx >= minLineThicknessPx
        ? Math.floor(drawnLengthPx / charWidthPx)
        : 0;

    // What a level pill can hold, measured strictly against the sector at
    // whatever angle it sits at.
    const radians = (angleDegrees * Math.PI) / 180;
    const across = Math.cos(radians);
    const along = Math.sin(radians);
    const chipCapacityPx = chipExtentPx(
      ringPx,
      chordPx,
      across,
      along,
      chipHeightPx
    );
    const chipBudget = chipChars(chipCapacityPx, charWidthPx);

    const display =
      drawnBudget >= label.length
        ? 'inline'
        : chipBudget >= MIN_CHARS
        ? 'truncated'
        : 'marker';

    return {
      placement: {
        path: entry.path,
        label,
        value: nodeTotal(entry.node),
        display,
        text: display === 'inline' ? label : truncateTo(label, chipBudget),
        chipCapacityPx,
        angleDegrees,
        radiusFraction,
      },
      depth: entry.depth,
      startFraction: entry.startFraction,
      midRadiusPx,
    };
  });

  // Sizing a label against its own sector says nothing about its neighbours, so
  // crowded rings are settled afterwards.
  resolveRingCollisions(candidates, radiusPx, fontSizePx);

  return candidates.map((candidate) => candidate.placement);
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

/** Normalized selection payload for a constrained overlay anchor. */
export function selectionFromPlacement(
  placement: SunburstLabelPlacement
): ChartInteraction {
  return {
    kind: 'select',
    label: placement.label,
    value: placement.value,
    path: [...placement.path],
  };
}
