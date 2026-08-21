import { html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '@kyndryl-design-system/shidoka-applications/components/reusable/tooltip';
import { ChartFrameElement } from '../../internal/chart-frame/chart-frame-element';
import type {
  ChartRenderer,
  ChartTableView,
} from '../../internal/chart-frame/types';
import { formatValue } from '../../internal/chart-frame/format';
import { EChartsSunburstRenderer } from '../../internal/renderers/echarts/sunburst-renderer';
import { buildSunburstTable, hierarchyTotal } from './sunburst-table';
import {
  constrainedPlacements,
  placementPosition,
  planSunburstLabels,
} from './sunburst-labels';
import SunburstScss from './chart-sunburst.scss?inline';
import type {
  SunburstLabelStrategy,
  SunburstModel,
  SunburstNode,
} from './sunburst.types';

const DATA_PROPERTIES = [
  'nodes',
  'categoryLabel',
  'valueLabel',
  'showLabels',
  'labelStrategy',
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
  static override styles = [ChartFrameElement.styles, unsafeCSS(SunburstScss)];

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

  /**
   * How labels behave when a sector is too narrow to hold them. With
   * `constrained`, labels that do not fit are truncated or replaced by a
   * marker and the full label and value move into a tooltip.
   */
  @property({ type: String })
  accessor labelStrategy: SunburstLabelStrategy = 'inline';

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
      labelStrategy: this.labelStrategy,
      innerRadiusRatio: this.innerRadiusRatio,
    };
  }

  protected override buildTableView(model: SunburstModel): ChartTableView {
    return buildSunburstTable(model);
  }

  /**
   * Labels that do not fit their sector are not painted by the chart. They are
   * drawn here instead, as Lit owned anchors that reveal the full label and
   * value through the Shidoka tooltip. The chart never sees this DOM and the
   * anchors disappear with the template, so there is nothing to unbind.
   *
   * The chart's own tooltip is switched off in this mode, so these anchors are
   * the single source of hover detail.
   *
   * `assistiveText` is deliberately emptied. The tooltip puts it on both the
   * `aria-label` and the native `title` of its anchor button, and it defaults
   * to `'Tooltip'`, so leaving it alone paints a second browser-rendered
   * tooltip and hides the real label from assistive technology. With it empty,
   * the anchor takes its name from the slotted content and the tooltip's own
   * `aria-describedby` still points at the visible text.
   */
  protected override renderHostOverlay(model: SunburstModel) {
    if (!model.showLabels || model.labelStrategy !== 'constrained') {
      return html``;
    }

    const placements = constrainedPlacements(planSunburstLabels(model));

    return html`
      <div class="label-box">
        ${placements.map((placement) => {
          const { leftPercent, topPercent } = placementPosition(placement);
          const value = `${model.valueLabel}: ${formatValue(placement.value)}`;

          return html`
            <div
              class="label-anchor"
              style="left: ${leftPercent.toFixed(
                2
              )}%; top: ${topPercent.toFixed(2)}%"
            >
              <kyn-tooltip class="label-tooltip" compact>
                <span
                  slot="anchor"
                  class=${classMap({
                    'label-chip': true,
                    'label-chip-marker': placement.display === 'marker',
                  })}
                >
                  <span aria-hidden="true">${placement.text}</span>
                  <span class="label-chip-name"
                    >${placement.label}, ${value}</span
                  >
                </span>
                <span class="label-tip-name">${placement.label}</span>
                <span class="label-tip-value">${value}</span>
              </kyn-tooltip>
            </div>
          `;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kd-chart-sunburst': KDChartSunburst;
  }
}
