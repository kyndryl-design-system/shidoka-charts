import { property } from 'lit/decorators.js';
import { ChartFrameElement } from '../../internal/chart-frame/chart-frame-element';
import type {
  ChartRenderer,
  ChartTableView,
} from '../../internal/chart-frame/types';
import { formatValue } from '../../internal/chart-frame/format';
import { EChartsSunburstRenderer } from '../../internal/renderers/echarts/sunburst-renderer';
import { buildSunburstTable, hierarchyTotal } from './sunburst-table';
import type { SunburstModel, SunburstNode } from './sunburst.types';

const DATA_PROPERTIES = [
  'nodes',
  'categoryLabel',
  'valueLabel',
  'showLabels',
  'innerRadiusRatio',
] as const;

/**
 * Sunburst chart for hierarchical part-to-whole data.
 *
 * The component takes a semantic hierarchy and owns its renderer. It exposes no
 * engine selector and no universal native configuration; the rendering engine
 * is an implementation detail apart from the documented unsafe escape hatch.
 *
 * @slot controls - Slot for custom controls beside the built in controls.
 * @fires on-chart-interaction - Normalized selection, detail: `{ kind, label, value, path }`.
 * @fires on-view-toggle - Table view toggled, detail: `{ tableView }`.
 */
export class KDChartSunburst extends ChartFrameElement<SunburstModel> {
  /** Top level segments of the hierarchy. */
  @property({ type: Array })
  accessor nodes: SunburstNode[] = [];

  /** Column header used for the category in the table fallback. */
  @property({ type: String })
  accessor categoryLabel = 'Category';

  /** Column header and tooltip suffix used for values. */
  @property({ type: String })
  accessor valueLabel = 'Value';

  /** Draws labels inside segments that are wide enough to hold them. */
  @property({ type: Boolean })
  accessor showLabels = true;

  /** Radius of the empty center as a fraction of the chart radius. */
  @property({ type: Number })
  accessor innerRadiusRatio = 0;

  protected override get dataProperties(): readonly string[] {
    return DATA_PROPERTIES;
  }

  protected override get fileNameFallback(): string {
    return 'sunburst';
  }

  protected override get captionText(): string {
    if (!this.nodes.length) return '';

    return `${this.valueLabel} total: ${formatValue(
      hierarchyTotal(this.nodes)
    )}`;
  }

  protected override createRenderer(): ChartRenderer<SunburstModel> {
    return new EChartsSunburstRenderer();
  }

  protected override buildModel(): SunburstModel | null {
    if (!Array.isArray(this.nodes) || !this.nodes.length) return null;

    return {
      nodes: this.nodes,
      categoryLabel: this.categoryLabel,
      valueLabel: this.valueLabel,
      showLabels: this.showLabels,
      innerRadiusRatio: this.innerRadiusRatio,
    };
  }

  protected override buildTableView(model: SunburstModel): ChartTableView {
    return buildSunburstTable(model);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kd-chart-sunburst': KDChartSunburst;
  }
}
