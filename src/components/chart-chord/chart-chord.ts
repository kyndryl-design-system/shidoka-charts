import { property } from 'lit/decorators.js';
import { ChartFrameElement } from '../../internal/chart-frame/chart-frame-element';
import type {
  ChartInteraction,
  ChartRenderer,
  ChartTableView,
  TooltipContent,
} from '../../internal/chart-frame/types';
import { formatValue } from '../../internal/chart-frame/format';
import { D3ChordRenderer } from '../../internal/renderers/d3/chord-renderer';
import { buildChordTable, matrixTotal, normalizeMatrix } from './chord-table';
import { formatChordInteractionTooltip } from './chord-tooltip';
import type { ChordModel, ChordNode } from './chord.types';

const DATA_PROPERTIES = [
  'nodes',
  'matrix',
  'valueLabel',
  'sourceLabel',
  'targetLabel',
  'showLabels',
  'padAngle',
] as const;

/**
 * Chord diagram for directed flows between a small set of entities.
 *
 * The component takes a semantic node list and flow matrix and owns its
 * renderer. It exposes no engine selector and no universal native
 * configuration; the rendering engine is an implementation detail apart from
 * the documented unsafe escape hatch.
 *
 * @slot controls - Slot for custom controls beside the built in controls.
 * @fires on-chart-interaction - Normalized selection, detail: `{ kind, label, value, path }`.
 * @fires on-view-toggle - Table view toggled, detail: `{ tableView }`.
 */
export class KDChartChord extends ChartFrameElement<ChordModel> {
  /** Endpoints, in the order they appear around the circle. */
  @property({ type: Array })
  accessor nodes: ChordNode[] = [];

  /** Square flow matrix, the same length as `nodes`. */
  @property({ type: Array })
  accessor matrix: number[][] = [];

  /** Column header and tooltip suffix used for flow values. */
  @property({ type: String })
  accessor valueLabel = 'Value';

  /** Column header used for the source endpoint in the table fallback. */
  @property({ type: String })
  accessor sourceLabel = 'From';

  /** Column header used for the target endpoint in the table fallback. */
  @property({ type: String })
  accessor targetLabel = 'To';

  /** Draws endpoint labels around the circumference. */
  @property({ type: Boolean })
  accessor showLabels = true;

  /** Gap between endpoints in radians. */
  @property({ type: Number })
  accessor padAngle = 0.04;

  protected override get dataProperties(): readonly string[] {
    return DATA_PROPERTIES;
  }

  protected override get fileNameFallback(): string {
    return 'chord';
  }

  protected override get captionText(): string {
    const model = this.buildModel();
    if (!model) return '';

    const matrix = normalizeMatrix(model.matrix, model.nodes.length);
    return `${this.valueLabel} total: ${formatValue(matrixTotal(matrix))}`;
  }

  protected override createRenderer(): ChartRenderer<ChordModel> {
    return new D3ChordRenderer();
  }

  protected override formatInteractionTooltip(
    interaction: ChartInteraction,
    model: ChordModel
  ): TooltipContent | null {
    return formatChordInteractionTooltip(interaction, model);
  }

  protected override buildModel(): ChordModel | null {
    if (!Array.isArray(this.nodes) || this.nodes.length < 2) return null;
    if (!Array.isArray(this.matrix) || !this.matrix.length) return null;

    return {
      nodes: this.nodes,
      matrix: this.matrix,
      valueLabel: this.valueLabel,
      sourceLabel: this.sourceLabel,
      targetLabel: this.targetLabel,
      showLabels: this.showLabels,
      padAngle: this.padAngle,
    };
  }

  protected override buildTableView(model: ChordModel): ChartTableView {
    return buildChordTable(model);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kd-chart-chord': KDChartChord;
  }
}
