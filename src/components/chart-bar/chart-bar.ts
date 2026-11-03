import { property } from 'lit/decorators.js';
import { ChartFrameElement } from '../../internal/chart-frame/chart-frame-element';
import type {
  ChartRenderer,
  ChartTableView,
} from '../../internal/chart-frame/types';
import { EChartsBarRenderer } from '../../internal/renderers/echarts/bar-renderer';
import { buildBarTable } from './chart-bar-table';
import type { CartesianSeries, BarModel } from './bar.types';

const DATA_PROPERTIES = [
  'categories',
  'series',
  'categoryLabel',
  'valueLabel',
  'showLegend',
  'stacked',
  'horizontal',
  'barThickness',
  'valueMax',
  'hideAxes',
  'hideTooltip',
  'showSeriesLabels',
  'indicator',
] as const;

/**
 * Bar chart for series plotted against shared categories.
 *
 * The component takes semantic categories and series and owns its renderer.
 * It exposes no engine selector and no universal native configuration; the
 * rendering engine is an implementation detail apart from the documented
 * unsafe escape hatch.
 *
 * @slot controls - Slot for custom controls beside the built in controls.
 * @fires on-chart-interaction - Normalized selection, detail: `{ kind, label, value, path }`.
 * @fires on-view-toggle - Table view toggled, detail: `{ tableView }`.
 * @tagname kd-chart-bar
 */
export class KDChartBar extends ChartFrameElement<BarModel> {
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

  /** Stacks series values instead of grouping them side by side. */
  @property({ type: Boolean })
  accessor stacked = false;

  /** Draws horizontal bars instead of vertical columns. */
  @property({ type: Boolean })
  accessor horizontal = false;

  /** Fixed bar thickness in px. Overrides the responsive `barMaxWidth` cap. */
  @property({ type: Number })
  accessor barThickness: number | undefined = undefined;

  /** Upper bound for the value axis. Defaults to data-driven auto scaling. */
  @property({ type: Number })
  accessor valueMax: number | undefined = undefined;

  /** Hides both axes entirely, including their lines, ticks and labels. */
  @property({ type: Boolean })
  accessor hideAxes = false;

  /** Suppresses the chart tooltip. */
  @property({ type: Boolean })
  accessor hideTooltip = false;

  /** Draws each series name inside its own bar segment. */
  @property({ type: Boolean })
  accessor showSeriesLabels = false;

  /** Marker drawn at a fixed value on the value axis, e.g. a threshold or target. */
  @property({ type: Object })
  accessor indicator: { value: number; label?: string } | undefined = undefined;

  protected override get dataProperties(): readonly string[] {
    return DATA_PROPERTIES;
  }

  protected override get fileNameFallback(): string {
    return 'bar';
  }

  protected override createRenderer(): ChartRenderer<BarModel> {
    return new EChartsBarRenderer();
  }

  protected override buildModel(): BarModel | null {
    if (!this.categories.length || !this.series.length) return null;

    return {
      categories: this.categories,
      series: this.series,
      categoryLabel: this.categoryLabel,
      valueLabel: this.valueLabel,
      showLegend: this.showLegend,
      stacked: this.stacked,
      horizontal: this.horizontal,
      barThickness: this.barThickness,
      valueMax: this.valueMax,
      hideAxes: this.hideAxes,
      hideTooltip: this.hideTooltip,
      showSeriesLabels: this.showSeriesLabels,
      indicator: this.indicator,
    };
  }

  protected override buildTableView(model: BarModel): ChartTableView {
    return buildBarTable(model);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kd-chart-bar': KDChartBar;
  }
}
