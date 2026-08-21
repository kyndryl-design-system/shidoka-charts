import { chord as chordLayout, ribbon as ribbonGenerator } from 'd3-chord';
import type { Chord, ChordSubgroup } from 'd3-chord';
import { arc as arcGenerator } from 'd3-shape';
import { paletteColor } from '../../chart-frame/palette';
import type { ChartTheme } from '../../chart-frame/types';
import type { ChordModel } from '../../../components/chart-chord/chord.types';
import { normalizeMatrix } from '../../../components/chart-chord/chord-table';

/**
 * Pure chord layout and path geometry.
 *
 * Uses only `d3-chord` and `d3-shape`, both of which are DOM free, so this
 * module can be unit tested in Node. Turning the geometry into elements is the
 * renderer's job.
 */

/** One endpoint arc around the circumference. */
export interface ChordArcGeometry {
  index: number;
  label: string;
  color: string;
  path: string;
  value: number;
  labelTransform: string;
  labelAnchor: 'start' | 'end';
}

/** One flow ribbon between two endpoints. */
export interface ChordRibbonGeometry {
  path: string;
  color: string;
  sourceIndex: number;
  targetIndex: number;
  sourceLabel: string;
  targetLabel: string;
  value: number;
}

export interface ChordGeometry {
  /** Square extent of the drawn chart in user units. */
  size: number;
  outerRadius: number;
  arcs: ChordArcGeometry[];
  ribbons: ChordRibbonGeometry[];
}

const RING_WIDTH = 14;
const LABEL_GUTTER = 96;
const LABEL_OFFSET = 8;
const MIN_SIZE = 160;
const MAX_PAD_ANGLE = 0.2;

function clampPadAngle(padAngle: number): number {
  if (!Number.isFinite(padAngle)) return 0;
  return Math.min(Math.max(padAngle, 0), MAX_PAD_ANGLE);
}

function labelPlacement(
  startAngle: number,
  endAngle: number,
  radius: number
): Pick<ChordArcGeometry, 'labelTransform' | 'labelAnchor'> {
  const degrees = ((startAngle + endAngle) / 2) * (180 / Math.PI) - 90;
  const flipped = degrees > 90;

  return {
    labelTransform: `rotate(${degrees.toFixed(3)}) translate(${(
      radius + LABEL_OFFSET
    ).toFixed(3)},0)${flipped ? ' rotate(180)' : ''}`,
    labelAnchor: flipped ? 'end' : 'start',
  };
}

/**
 * Builds arc and ribbon path geometry for a chord model at a given square
 * size. Recomputed on resize so labels keep a readable gutter.
 */
export function buildChordGeometry(
  model: ChordModel,
  theme: ChartTheme,
  requestedSize: number
): ChordGeometry {
  const size = Math.max(
    Number.isFinite(requestedSize) ? requestedSize : MIN_SIZE,
    MIN_SIZE
  );
  const gutter = model.showLabels ? LABEL_GUTTER : RING_WIDTH * 2;
  const outerRadius = Math.max(size / 2 - gutter, RING_WIDTH * 2);
  const innerRadius = Math.max(outerRadius - RING_WIDTH, 1);

  const nodeCount = model.nodes.length;
  const matrix = normalizeMatrix(model.matrix, nodeCount);

  const chords = chordLayout()
    .padAngle(clampPadAngle(model.padAngle))
    .sortSubgroups((a, b) => b - a)(matrix);

  const arcPath = arcGenerator<unknown, { startAngle: number; endAngle: number }>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const ribbonPath = ribbonGenerator<Chord, ChordSubgroup>().radius(
    innerRadius
  );

  const colorOf = (index: number): string =>
    model.nodes[index]?.color ?? paletteColor(theme.palette, index);

  const arcs: ChordArcGeometry[] = chords.groups.map((group) => ({
    index: group.index,
    label: model.nodes[group.index]?.label ?? String(group.index),
    color: colorOf(group.index),
    path:
      arcPath({ startAngle: group.startAngle, endAngle: group.endAngle }) ?? '',
    value: group.value,
    ...labelPlacement(group.startAngle, group.endAngle, outerRadius),
  }));

  const ribbons: ChordRibbonGeometry[] = chords.map((link) => {
    const sourceIndex = link.source.index;
    const targetIndex = link.target.index;

    return {
      path: ribbonPath(link) ?? '',
      color: colorOf(sourceIndex),
      sourceIndex,
      targetIndex,
      sourceLabel: model.nodes[sourceIndex]?.label ?? String(sourceIndex),
      targetLabel: model.nodes[targetIndex]?.label ?? String(targetIndex),
      value: link.source.value,
    };
  });

  return { size, outerRadius, arcs, ribbons };
}
