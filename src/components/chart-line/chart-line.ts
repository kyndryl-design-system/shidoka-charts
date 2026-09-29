import { property } from 'lit/decorators.js';
import { ChartFrameElement } from '../../internal/chart-frame/chart-frame-element';
import type {
  ChartRenderer,
  ChartTableView,
} from '../../internal/chart-frame/types';
import { EChartsLineRenderer } from '../../internal/renderers/echarts/line-renderer';
import { buildLineTable } from './chart-line-table';
import type { CartesianSeries, LineModel } from './line.types';

const DATA_PROPERTIES = [
  'categories',
  'series',
  'categoryLabel',
  'valueLabel',
  'showLegend',
  'stacked',
  'smooth',
  'showPoints',
] as const;

/**
 * Line chart for series plotted against shared categories.
 *
 * The component takes semantic categories and series and owns its renderer.
 * It exposes no engine selector and no universal native configuration; the
 * rendering engine is an implementation detail apart from the documented
 * unsafe escape hatch.
 *
 * @slot controls - Slot for custom controls beside the built in controls.
 * @fires on-chart-interaction - Normalized selection, detail: `{ kind, label, value, path }`.
 * @fires on-view-toggle - Table view toggled, detail: `{ tableView }`.
 */
export class KDChartLine extends ChartFrameElement<LineModel> {
  /** Category labels along the shared axis. */
  @property({ type: Array })
  accessor categories: string[] = [];

  /** Series plotted against `categories`. */
  @property({ type: Array })
  accessor series: CartesianSeries[] = [];

  /** Column header and axis label used for the category. */
  @property({ type: String })
  accessor categoryLabel = 'Category';

  /** Axis label used for values. */
  @property({ type: String })
  accessor valueLabel = 'Value';

  /** Shows the series legend. */
  @property({ type: Boolean })
  accessor showLegend = true;

  /** Stacks series values instead of overlaying them. */
  @property({ type: Boolean })
  accessor stacked = false;

  /** Draws smoothed curves instead of straight segments. */
  @property({ type: Boolean })
  accessor smooth = false;

  /** Draws a marker symbol at each data point. */
  @property({ type: Boolean })
  accessor showPoints = true;

  protected override get dataProperties(): readonly string[] {
    return DATA_PROPERTIES;
  }

  protected override get fileNameFallback(): string {
    return 'line';
  }

  protected override createRenderer(): ChartRenderer<LineModel> {
    return new EChartsLineRenderer();
  }

  protected override buildModel(): LineModel | null {
    if (!this.categories.length || !this.series.length) return null;

    return {
      categories: this.categories,
      series: this.series,
      categoryLabel: this.categoryLabel,
      valueLabel: this.valueLabel,
      showLegend: this.showLegend,
      stacked: this.stacked,
      smooth: this.smooth,
      showPoints: this.showPoints,
    };
  }

  protected override buildTableView(model: LineModel): ChartTableView {
    return buildLineTable(model);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kd-chart-line': KDChartLine;
  }
}
