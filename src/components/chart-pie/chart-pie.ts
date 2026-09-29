import { property } from 'lit/decorators.js';
import { ChartFrameElement } from '../../internal/chart-frame/chart-frame-element';
import type {
  ChartRenderer,
  ChartTableView,
} from '../../internal/chart-frame/types';
import { formatValue } from '../../internal/chart-frame/format';
import { EChartsPieRenderer } from '../../internal/renderers/echarts/pie-renderer';
import { buildPieTable, sliceTotal } from './chart-pie-table';
import type { PieModel, PieSlice } from './pie.types';

const DATA_PROPERTIES = [
  'slices',
  'categoryLabel',
  'valueLabel',
  'showLabels',
  'showLegend',
  'innerRadiusRatio',
] as const;

/**
 * Pie chart for part-to-whole data.
 *
 * The component takes a semantic list of slices and owns its renderer. It
 * exposes no engine selector and no universal native configuration; the
 * rendering engine is an implementation detail apart from the documented
 * unsafe escape hatch.
 *
 * @slot controls - Slot for custom controls beside the built in controls.
 * @fires on-chart-interaction - Normalized selection, detail: `{ kind, label, value, path }`.
 * @fires on-view-toggle - Table view toggled, detail: `{ tableView }`.
 */
export class KDChartPie extends ChartFrameElement<PieModel> {
  /** Slices of the pie. */
  @property({ type: Array })
  accessor slices: PieSlice[] = [];

  /** Column header used for the category in the table fallback. */
  @property({ type: String })
  accessor categoryLabel = 'Category';

  /** Column header and tooltip suffix used for values. */
  @property({ type: String })
  accessor valueLabel = 'Value';

  /** Draws labels on slices. */
  @property({ type: Boolean })
  accessor showLabels = true;

  /** Shows the slice legend. */
  @property({ type: Boolean })
  accessor showLegend = true;

  /** Radius of the empty center as a fraction of the chart radius. */
  @property({ type: Number })
  accessor innerRadiusRatio = 0;

  protected override get dataProperties(): readonly string[] {
    return DATA_PROPERTIES;
  }

  protected override get fileNameFallback(): string {
    return 'pie';
  }

  protected override get captionText(): string {
    if (!this.slices.length) return '';

    return `${this.valueLabel} total: ${formatValue(sliceTotal(this.slices))}`;
  }

  protected override createRenderer(): ChartRenderer<PieModel> {
    return new EChartsPieRenderer();
  }

  protected override buildModel(): PieModel | null {
    if (!this.slices.length) return null;

    return {
      slices: this.slices,
      categoryLabel: this.categoryLabel,
      valueLabel: this.valueLabel,
      showLabels: this.showLabels,
      showLegend: this.showLegend,
      innerRadiusRatio: this.innerRadiusRatio,
    };
  }

  protected override buildTableView(model: PieModel): ChartTableView {
    return buildPieTable(model);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kd-chart-pie': KDChartPie;
  }
}
