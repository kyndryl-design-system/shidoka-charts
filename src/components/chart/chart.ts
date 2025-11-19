import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { deepmerge, deepmergeCustom } from 'deepmerge-ts';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import {
  ChoroplethController,
  BubbleMapController,
  GeoFeature,
  ColorScale,
  SizeScale,
  ProjectionScale,
} from 'chartjs-chart-geo';
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import {
  BoxPlotController,
  BoxAndWiskers,
  ViolinController,
  Violin,
} from '@sgratzl/chartjs-chart-boxplot';
import {
  DendrogramController,
  TreeController,
  GraphController,
  ForceDirectedGraphController,
  EdgeLine,
} from 'chartjs-chart-graph';
import { SankeyController, Flow } from 'chartjs-chart-sankey';
import canvasBackgroundPlugin from '../../common/plugins/canvasBackground';
import doughnutLabelPlugin from '../../common/plugins/doughnutLabel';
import meterGaugePlugin from '../../common/plugins/meterGaugeNeedle';
import gradientLegendPlugin from '../../common/plugins/gradientLegend';
import { renderHTMLLegend } from '../../common/legend';
import { htmlLegendPlugin } from '../../common/plugins/htmlLegendPlugin';
import a11yPlugin from 'chartjs-plugin-a11y-legend';
import datalabelsPlugin from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import {
  convertChartDataToCSV,
  debounce,
  convertTreeDataToCSV,
} from '../../common/helpers/helpers';
import { renderBoxplotViolinTable } from '../../common/helpers/boxplotViolinTableRenderer';
import ChartScss from './chart.scss?inline';
import globalOptions from '../../common/config/globalOptions';
import globalOptionsNonRadial from '../../common/config/globalOptionsNonRadial';
import globalOptionsRadial from '../../common/config/globalOptionsRadial';
import chartIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/analytics.svg';
import tableIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/table-view.svg';
import downloadIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/download.svg';
import maximizeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/expand.svg';
import minimizeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/shrink.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';
import { renderGraphTreeTable } from '../../common/helpers/graphTreeTableRenderer';

Chart.register(
  ChoroplethController,
  BubbleMapController,
  GeoFeature,
  ColorScale,
  SizeScale,
  ProjectionScale,
  TreemapController,
  TreemapElement,
  MatrixController,
  MatrixElement,
  BoxPlotController,
  BoxAndWiskers,
  ViolinController,
  Violin,
  DendrogramController,
  TreeController,
  GraphController,
  ForceDirectedGraphController,
  EdgeLine,
  SankeyController,
  Flow,
  annotationPlugin,
  datalabelsPlugin
);

export interface LegendClickInfo {
  item: any;
  chart: Chart;
  isHidden: boolean;
  label: string;
  dataIndex?: number;
  datasetIndex?: number;
  element: HTMLElement;
  event?: MouseEvent;
}

export interface HtmlLegendOptions {
  boxWidth?: number;
  boxHeight?: number;
  borderRadius?: number;
  className?: string;
  itemClassName?: string;
  layout?: 'horizontal' | 'vertical';
  fontSize?: number;
  boxMargin?: number;
  adjustChartHeight?: boolean;
  reservedLegendHeight?: number;
  /**
   * Callback fired when a legend item is clicked.
   * This handler receives comprehensive information and can interact with external APIs.
   */
  onItemClick?: (info: LegendClickInfo) => void;
  columns?: number;
  labelFormatter?: (label: string, item: any) => string;
  itemClassResolver?: (item: any) => string | null;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Chart.js wrapper component.
 * @slot unnamed - Slot for custom content between header and chart.
 * @slot controls - Slot for custom controls such as an overflow menu.
 * @slot tooltip - Slot for tooltip in header.
 * @slot draghandle - Slot for widget drag handle.
 */
@customElement('kd-chart')
export class KDChart extends LitElement {
  static override styles = unsafeCSS(ChartScss);

  /** Chart title. */
  @property({ type: String })
  accessor chartTitle = '';

  /** Chart description. */
  @property({ type: String })
  accessor description = '';

  /** Chart.js chart type. */
  @property({ type: String })
  accessor type: any = '';

  /** Chart.js data.labels. */
  @property({ type: Array })
  accessor labels!: Array<string>;

  /** Chart.js data.datasets. */
  @property({ type: Array })
  accessor datasets!: Array<any>;

  /** Chart.js options. Can override Shidoka defaults. */
  @property({ type: Object })
  accessor options: any = {};

  /** Chart.js additional plugins. Must be registerable inline via Chart.plugins array, not globally via Chart.register. */
  @property({ type: Array })
  accessor plugins: any = [];

  /** Chart.js canvas height (px). Disables maintainAspectRatio option. */
  @property({ type: Number })
  accessor height: any = null;

  /** Chart.js canvas width (px). Disables maintainAspectRatio option. */
  @property({ type: Number })
  accessor width: any = null;

  /** Hides the description visually. */
  @property({ type: Boolean })
  accessor hideDescription = false;

  /** Hides the closed captions visually. */
  @property({ type: Boolean })
  accessor hideCaptions = false;

  /** Hides the title & description. */
  @property({ type: Boolean })
  accessor hideHeader = false;

  /** Hides all the controls. */
  @property({ type: Boolean })
  accessor hideControls = false;

  /** Hides the table view control. */
  @property({ type: Boolean })
  accessor hideTableControl = false;

  /** Hides the fullscreen control. */
  @property({ type: Boolean })
  accessor hideFullscreenControl = false;

  /** Hides the download control. */
  @property({ type: Boolean })
  accessor hideDownloadControl = false;

  /** Removes the outer border and padding. */
  @property({ type: Boolean })
  accessor noBorder = false;

  /** Customizable text labels. */
  @property({ type: Object })
  accessor customLabels = {
    toggleView: 'Toggle View Mode',
    toggleFullscreen: 'Toggle Fullscreen',
    downloadMenu: 'Download Menu',
    downloadCsv: 'Download as CSV',
    downloadPng: 'Download as PNG',
    downloadJpg: 'Download as JPG',
  };

  /** Fullscreen state.
   * @ignore
   */
  @state()
  accessor fullscreen = false;

  /** Use HTML legend instead of Chart.js built-in canvas legend.
   * @public
   */
  @property({ type: Boolean })
  accessor useHtmlLegend = false;

  /** Max height for HTML legend scroll container (px). */
  @property({ type: Number, reflect: true })
  accessor htmlLegendMaxHeight = 100;

  /** Full set of legend customization options */
  @property({ type: Object })
  accessor htmlLegendOptions: HtmlLegendOptions = {};

  /**
   * Queries the container element.
   * @ignore
   */
  @query('.container')
  accessor container!: HTMLCanvasElement;

  /**
   * Queries the canvas element.
   * @ignore
   */
  @query('canvas')
  accessor canvas!: HTMLCanvasElement;

  /**
   * Queries the closed caption div.
   * @ignore
   */
  @query('.closed-caption')
  accessor ccDiv!: HTMLDivElement;

  /** The chart instance.
   * @ignore
   */
  @state()
  accessor chart: any = null;

  /** Table view mode.
   * @ignore
   */
  @state()
  accessor tableView = false;

  /** Disable table view feature.
   * @ignore
   */
  @state()
  accessor tableDisabled = false;

  /** Merged options.
   * @ignore
   */
  @state()
  accessor mergedOptions: any = {};

  /** Merged datasets.
   * @ignore
   */
  @state()
  accessor mergedDatasets: any = {};

  /** Is Widget. Inherited from kyn-widget.
   * @internal
   */
  @state()
  accessor _widget = false;

  /** Resize observer for canvas-container.
   * @internal
   */
  _resizeObserver: any = new ResizeObserver(
    debounce(() => {
      this._resizeChart();
    })
  );

  /** Theme observer to watch for meta color-scheme changes.
   * @internal
   */
  _themeObserver: any = new MutationObserver(() => {
    if (this.chart) {
      this.mergeOptions().then(() => {
        this.initChart();
      });
    }
  });

  override render() {
    const Classes = {
      container: true,
      fullscreen: this.fullscreen,
      'no-border': this.noBorder || this._widget,
      widget: this._widget,
    };

    return html`
      <div
        class=${classMap(Classes)}
        @fullscreenchange=${() => this.handleFullscreenChange()}
      >
        ${!this.hideHeader || !this.hideControls
          ? html`
              <div class="header">
                ${!this.hideHeader
                  ? html`
                      <slot name="draghandle"></slot>

                      <div id="titleDesc">
                        <div class="title">
                          ${this.chartTitle}
                          <slot name="tooltip"></slot>
                        </div>
                        <div
                          class="description ${this.hideDescription
                            ? 'hidden-visually'
                            : ''}"
                        >
                          ${this.description}
                        </div>
                      </div>
                    `
                  : null}
                ${!this.hideControls
                  ? html`
                      <div class="controls">
                        ${!this.tableDisabled && !this.hideTableControl
                          ? html`
                              <button
                                class="control-button"
                                @click=${() => this.handleViewToggle()}
                                aria-label=${this.customLabels.toggleView}
                                title=${this.customLabels.toggleView}
                              >
                                <span slot="icon">
                                  ${this.tableView
                                    ? unsafeSVG(chartIcon)
                                    : unsafeSVG(tableIcon)}
                                </span>
                              </button>
                            `
                          : null}
                        ${!this.hideFullscreenControl
                          ? html`
                              <button
                                class="control-button"
                                @click=${() => this.handleFullscreen()}
                                aria-label=${this.customLabels.toggleFullscreen}
                                title=${this.customLabels.toggleFullscreen}
                              >
                                <span slot="icon">
                                  ${this.fullscreen
                                    ? unsafeSVG(minimizeIcon)
                                    : unsafeSVG(maximizeIcon)}
                                </span>
                              </button>
                            `
                          : null}
                        ${!this.hideDownloadControl
                          ? html`
                              <div class="download">
                                <button
                                  tabindex="0"
                                  class="control-button"
                                  aria-label=${this.customLabels.downloadMenu}
                                  title=${this.customLabels.downloadMenu}
                                >
                                  <span slot="icon">
                                    ${unsafeSVG(downloadIcon)}
                                  </span>
                                </button>

                                <div class="download-menu">
                                  ${!this.tableDisabled
                                    ? html`
                                        <button
                                          tabindex="0"
                                          @click=${(e: Event) =>
                                            this.handleDownloadCsv(e)}
                                        >
                                          ${this.customLabels.downloadCsv}
                                        </button>
                                      `
                                    : null}
                                  <button
                                    tabindex="0"
                                    @click=${(e: Event) =>
                                      this.handleDownloadImage(e, false)}
                                  >
                                    ${this.customLabels.downloadPng}
                                  </button>
                                  <button
                                    tabindex="0"
                                    @click=${(e: Event) =>
                                      this.handleDownloadImage(e, true)}
                                  >
                                    ${this.customLabels.downloadJpg}
                                  </button>
                                </div>
                              </div>
                            `
                          : null}

                        <slot name="controls"></slot>
                      </div>
                    `
                  : null}
              </div>
            `
          : null}

        <div>
          <slot></slot>
        </div>

        <figure class="${this.tableView ? 'hidden' : ''}">
          <div
            class="canvas-container"
            style="${this.width ? `width: ${this.width}px;` : ''}
            ${this.height ? `height: ${this.height}px;` : ''}"
          >
            <canvas role="img" aria-labelledby="titleDesc"></canvas>
          </div>
          <figcaption>
            <div
              class="closed-caption ${this.hideCaptions
                ? 'hidden-visually'
                : ''}"
            ></div>
          </figcaption>

          <div
            class="html-legend-container"
            ?hidden=${!this.useHtmlLegend}
          ></div>
        </figure>

        ${!this.tableDisabled && this.tableView
          ? html`
              <div class="table">
                <table>
                  ${['pie', 'doughnut', 'polarArea'].includes(this.type)
                    ? html`
                        <thead>
                          <tr>
                            <th>Label</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${this.labels.map(
                            (label, i) => html`
                              <tr>
                                <td>${label}</td>
                                <td>${this.datasets[0].data[i]}</td>
                              </tr>
                            `
                          )}
                        </tbody>
                      `
                    : this.type === 'matrix'
                    ? html`
                        <thead>
                          <tr>
                            <th>
                              ${this.options?.scales?.y?.title?.text ||
                              'Y Axis'}
                            </th>
                            <th>
                              ${this.options?.scales?.x?.title?.text ||
                              'X Axis'}
                            </th>
                            ${this.datasets.map(
                              (dataset) => html`<th>${dataset.label}</th>`
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          ${this.datasets[0].data.map((cell: any) => {
                            const xLabel = Array.isArray(this.labels)
                              ? this.labels[cell.x - 1] || ''
                              : (this.labels as any).x?.[cell.x - 1] || '';
                            const yLabel = Array.isArray(this.labels)
                              ? this.labels[cell.y - 1] || ''
                              : (this.labels as any).y?.[cell.y - 1] || '';
                            return html`
                              <tr>
                                <td>${yLabel}</td>
                                <td>${xLabel}</td>
                                ${this.datasets.map(
                                  () => html`<td>${cell.value}</td>`
                                )}
                              </tr>
                            `;
                          })}
                        </tbody>
                      `
                    : ['boxplot', 'violin'].includes(this.type)
                    ? renderBoxplotViolinTable(
                        this.labels,
                        this.datasets,
                        this.getTableAxisLabel()
                      )
                    : this.type === 'tree'
                    ? renderGraphTreeTable(this.datasets)
                    : html`
                        <thead>
                          <tr>
                            ${this.labels?.length || this.type === 'treemap'
                              ? html`<th>${this.getTableAxisLabel()}</th>`
                              : null}
                            ${this.datasets.map(
                              (dataset) => html`<th>${dataset.label}</th>`
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          ${this.type === 'treemap'
                            ? Array.isArray(this.datasets[0].tree)
                              ? this.datasets[0].tree.map(
                                  (_value: any) => html`
                                    <tr>
                                      <td>
                                        ${_value[this.datasets[0].labelKey]}
                                      </td>
                                      <td>${_value[this.datasets[0].key]}</td>
                                    </tr>
                                  `
                                )
                              : Object.entries(this.datasets[0].tree).map(
                                  (_value: any) => {
                                    const HtmlStrings = [];
                                    if (_value[1].value) {
                                      HtmlStrings.push(html`
                                        <tr>
                                          <td>${_value[0]}</td>
                                          <td>${_value[1].value}</td>
                                        </tr>
                                      `);
                                    } else {
                                      Object.entries(_value[1]).map(
                                        (_subValue: any) => {
                                          if (_subValue[1].value) {
                                            HtmlStrings.push(html`
                                              <tr>
                                                <td>${_subValue[0]}</td>
                                                <td>${_subValue[1].value}</td>
                                              </tr>
                                            `);
                                          } else {
                                            Object.entries(_subValue[1]).map(
                                              (_subSubValue: any) => {
                                                HtmlStrings.push(html`
                                                  <tr>
                                                    <td>${_subSubValue[0]}</td>
                                                    <td>
                                                      ${_subSubValue[1].value}
                                                    </td>
                                                  </tr>
                                                `);
                                              }
                                            );
                                          }
                                        }
                                      );
                                    }
                                    return HtmlStrings;
                                  }
                                )
                            : this.datasets[0].data.map(
                                (_value: any, i: number) => {
                                  const IndexAxis =
                                    this.options.indexAxis || 'x';
                                  const NonIndexAxis =
                                    IndexAxis === 'x' ? 'y' : 'x';
                                  return html`
                                    <tr>
                                      ${this.labels?.length
                                        ? html`
                                            ${this.options?.scales?.[IndexAxis]
                                              ?.type === 'time'
                                              ? html`
                                                  <td>
                                                    ${new Date(
                                                      this.labels[i]
                                                    ).toLocaleString()}
                                                  </td>
                                                `
                                              : html`
                                                  <td>${this.labels[i]}</td>
                                                `}
                                          `
                                        : null}
                                      ${this.datasets.map((dataset) => {
                                        if (i >= dataset.data.length)
                                          return html`<td></td>`;

                                        const dataPoint = dataset.data[i];
                                        if (
                                          this.type === 'bubbleMap' ||
                                          this.type === 'choropleth'
                                        ) {
                                          return html`
                                            <td>${dataset.data[i].value}</td>
                                          `;
                                        } else if (
                                          this.options?.scales[NonIndexAxis]
                                            ?.type === 'time'
                                        ) {
                                          return html`
                                            <td>
                                              ${new Date(
                                                dataPoint
                                              ).toLocaleString()}
                                            </td>
                                          `;
                                        } else if (Array.isArray(dataPoint)) {
                                          return html`
                                            <td>
                                              ${dataPoint[0]}, ${dataPoint[1]}
                                            </td>
                                          `;
                                        } else if (
                                          [
                                            'pie',
                                            'doughnut',
                                            'polarArea',
                                          ].includes(this.type)
                                        ) {
                                          return html` <td>${dataPoint}</td> `;
                                        } else if (
                                          typeof dataPoint === 'object' &&
                                          !Array.isArray(dataPoint) &&
                                          dataPoint !== null
                                        ) {
                                          return html`
                                            <td>
                                              ${Object.keys(dataPoint).map(
                                                (key) => {
                                                  const Label =
                                                    this.options?.scales?.[key]
                                                      ?.title?.text || key;
                                                  const DisplayData =
                                                    this.options?.scales?.[key]
                                                      ?.type === 'time' &&
                                                    dataPoint[key]
                                                      ? new Date(
                                                          dataPoint[key]
                                                        ).toLocaleString()
                                                      : dataPoint[key];
                                                  return html`
                                                    <div>
                                                      <strong>
                                                        ${Label}:
                                                      </strong>
                                                      ${DisplayData}
                                                    </div>
                                                  `;
                                                }
                                              )}
                                            </td>
                                          `;
                                        } else {
                                          return html`
                                            <td>${dataset.data[i]}</td>
                                          `;
                                        }
                                      })}
                                    </tr>
                                  `;
                                }
                              )}
                        </tbody>
                      `}
                </table>
              </div>
            `
          : null}
      </div>
    `;
  }

  private _resizeChart() {
    if (this.chart) {
      this.chart.resize();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    try {
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta instanceof Node) {
        this._themeObserver.observe(meta, { attributes: true });
      }
    } catch (error) {
      console.warn('Failed to set up theme observer:', error);
    }
  }

  override disconnectedCallback() {
    this._resizeObserver.disconnect();
    this._themeObserver.disconnect();

    super.disconnectedCallback();
  }

  override firstUpdated() {
    const el = this.shadowRoot?.querySelector('.canvas-container');
    this._resizeObserver.observe(el);
  }

  private generateScrollableLegend(): void {
    if (!this.chart || !this.useHtmlLegend) return;

    const legendContainer = this.shadowRoot!.querySelector<HTMLElement>(
      '.html-legend-container'
    )!;
    legendContainer.innerHTML = '';

    const opts = {
      maxHeight: this.htmlLegendMaxHeight,
      ...this.htmlLegendOptions,
      onItemClick: (info: LegendClickInfo) => {
        if (this.htmlLegendOptions.onItemClick) {
          this.htmlLegendOptions.onItemClick(info);
        }

        this.dispatchEvent(
          new CustomEvent('on-click', {
            detail: info,
            bubbles: true,
            composed: true,
          })
        );
      },
    };

    renderHTMLLegend(this.chart, legendContainer, opts);
  }

  override updated(changedProps: any) {
    if (
      this.chart &&
      (changedProps.has('labels') ||
        changedProps.has('datasets') ||
        changedProps.has('options'))
    ) {
      this.mergeOptions().then(() => {
        this.chart.data.labels = this.labels;
        this.chart.options = this.mergedOptions;

        this.chart.data.datasets.forEach((dataset: any, index: number) => {
          const NewDataset = this.mergedDatasets.find(
            (newDataset: any) => newDataset.label === dataset.label
          );

          if (!NewDataset) {
            this.chart.data.datasets.splice(index, 1);
          }
        });

        this.mergedDatasets.forEach((dataset: any) => {
          const prevDataset = this.chart.data.datasets.find(
            (prevDataset: any) => prevDataset.label === dataset.label
          );

          if (!prevDataset) {
            this.chart.data.datasets.push(dataset);
          } else {
            Object.keys(dataset).forEach((key) => {
              prevDataset[key] = dataset[key];
            });
          }
        });

        this.chart.update();

        this.generateScrollableLegend();
      });
    }

    // init chart
    // check to make sure initial datasets + data have been provided
    let hasData = false;
    if (this.datasets && this.datasets.length) {
      for (const dataset of this.datasets) {
        hasData =
          dataset.data?.length > 0 ||
          dataset.tree?.length > 0 ||
          (dataset.tree && Object.keys(dataset.tree).length > 0);

        if (!hasData) {
          console.error('Missing data for one or more chart datasets.');
          break;
        }
      }
    }

    if (!this.chart && this.type && changedProps.has('datasets') && hasData) {
      this.mergeOptions().then(() => {
        this.initChart();
      });

      this.checkType();
    }

    // Re-init chart instance when type, plugins, width, height, or useHtmlLegend change.
    if (
      this.chart &&
      (changedProps.has('type') ||
        changedProps.has('plugins') ||
        changedProps.has('width') ||
        changedProps.has('height') ||
        changedProps.has('useHtmlLegend'))
    ) {
      this.mergeOptions().then(() => {
        this.initChart();
      });

      this.checkType();
    }

    if (this.chart && changedProps.has('noBorder')) {
      this.chart.resize();
    }
  }

  /**
   * Initializes a bar chart using the Chart.js library with provided labels, datasets,
   * and options.
   */
  private initChart() {
    const pluginSelect =
      this.type === 'meter' ? meterGaugePlugin : doughnutLabelPlugin;

    const chartPlugins = [
      canvasBackgroundPlugin,
      pluginSelect,
      gradientLegendPlugin,
      ...this.plugins,
      a11yPlugin,
    ];

    // add htmlLegendPlugin if useHtmlLegend is enabled
    if (this.useHtmlLegend) {
      chartPlugins.push(htmlLegendPlugin);
    }

    if (this.chart) this.chart.destroy();
    this.chart = new Chart(this.canvas, {
      type: this.type === 'meter' ? 'doughnut' : this.type,
      data: { labels: this.labels, datasets: this.mergedDatasets },
      options: this.mergedOptions,
      plugins: chartPlugins,
    });

    this.generateScrollableLegend();
  }

  /**
   * Merges various chart type options and dataset options to create a
   * final set of options for a chart.
   */
  private async mergeOptions() {
    const radialTypes = ['pie', 'doughnut', 'radar', 'polarArea', 'meter'];
    const ignoredTypes = [
      'choropleth',
      'treemap',
      'bubbleMap',
      'dendrogram',
      'tree',
    ];

    // dynamically import type-specific configs
    const additionalTypeImports: any[] = [];
    this.datasets.forEach((dataset) => {
      if (dataset.type) {
        additionalTypeImports.push(
          import(`../../common/config/chartTypes/${dataset.type}.js`)
        );
      }
    });
    const chartTypeConfigs = await Promise.all([
      import(`../../common/config/chartTypes/${this.type}.js`),
      ...additionalTypeImports,
    ]);

    let mergedOptions: any = globalOptions(this);
    mergedOptions.plugins = mergedOptions.plugins || {};

    if (this.useHtmlLegend) {
      mergedOptions.plugins.legend = { display: false };
      mergedOptions.plugins.htmlLegend = mergedOptions.plugins.htmlLegend || {};
    } else {
      mergedOptions.plugins.legend = mergedOptions.plugins.legend || {};
      mergedOptions.plugins.legend.display = true;
    }

    // merge radial vs non-radial defaults
    if (radialTypes.includes(this.type)) {
      mergedOptions = deepmerge(mergedOptions, globalOptionsRadial(this));
    } else if (!ignoredTypes.includes(this.type)) {
      mergedOptions = deepmerge(mergedOptions, globalOptionsNonRadial(this));
    }

    const mergedDatasets: any[] = JSON.parse(JSON.stringify(this.datasets));

    chartTypeConfigs.forEach((cfg: any) => {
      mergedOptions = deepmerge(mergedOptions, cfg.options(this));
      mergedDatasets.forEach((ds: any, i: number) => {
        if ((!ds.type && cfg.type === this.type) || ds.type === cfg.type) {
          mergedDatasets[i] = deepmerge(ds, cfg.datasetOptions(this, i));
        }
      });
    });

    if (this.options) {
      mergedOptions = deepmerge(mergedOptions, this.options);
    }
    this.mergedOptions = mergedOptions;

    mergedDatasets.forEach((ds: object, i: number) => {
      const customDeep = deepmergeCustom({ mergeArrays: false });
      mergedDatasets[i] = customDeep(ds, this.datasets[i]);
    });
    this.mergedDatasets = mergedDatasets;
  }

  private getTableAxisLabel() {
    let label = '';

    if (this.options?.indexAxis === 'y') {
      if (this.options?.scales?.y?.title?.text) {
        label = this.options?.scales.y.title.text;
      } else {
        label = 'Y Axis';
      }
    } else {
      if (this.options?.scales?.x?.title?.text) {
        label = this.options?.scales.x.title.text;
      } else {
        label = 'X Axis';
      }
    }

    return label;
  }

  private handleViewToggle() {
    this.tableView = !this.tableView;
  }

  private checkType() {
    // chart types that can't have a data table view
    const blacklist: any = ['dendrogram', 'forceDirectedGraph', 'tree'];
    this.tableDisabled = blacklist.includes(this.type);
  }

  private handleDownloadImage(e: Event, jpeg: boolean) {
    e.preventDefault();

    const imgFormat = jpeg ? 'image/jpeg' : 'image/png';
    const fileExt = jpeg ? 'jpg' : 'png';

    if (this.useHtmlLegend && this.chart) {
      if (['doughnut', 'pie'].includes(this.type)) {
        this.exportSimpleCanvasOnly(imgFormat, fileExt);
        return;
      }

      const originalConfig = {
        options: JSON.parse(JSON.stringify(this.chart.options)),
        data: JSON.parse(JSON.stringify(this.chart.data)),
        type: this.chart.config.type,
      };

      const originalHidden = this.chart.data.datasets.map(
        (_: unknown, i: number) => this.chart.getDatasetMeta(i).hidden
      );

      try {
        if (!this.chart.options.plugins) {
          this.chart.options.plugins = {};
        }

        if (!this.chart.options.plugins.legend) {
          this.chart.options.plugins.legend = {};
        }

        this.chart.options.plugins.legend.display = true;
        this.chart.options.plugins.legend.position = 'bottom';
        this.chart.options.plugins.legend.labels = {
          boxWidth: 12,
          boxHeight: 12,
          padding: 10,
          font: {
            size: 12,
          },
        };

        if (!this.chart.options.layout) {
          this.chart.options.layout = { padding: { bottom: 40 } };
        } else if (!this.chart.options.layout.padding) {
          this.chart.options.layout.padding = { bottom: 40 };
        } else if (typeof this.chart.options.layout.padding === 'number') {
          this.chart.options.layout.padding = {
            top: this.chart.options.layout.padding,
            right: this.chart.options.layout.padding,
            bottom: Math.max(this.chart.options.layout.padding, 40),
            left: this.chart.options.layout.padding,
          };
        } else if (this.chart.options.layout.padding) {
          this.chart.options.layout.padding.bottom = Math.max(
            this.chart.options.layout.padding.bottom || 0,
            40
          );
        }

        this.chart.update('none');

        const context = this.canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');

        const color = getTokenThemeVal('--kd-color-background-page-default');
        context.save();
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = color;
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const imgData = this.chart.toBase64Image(imgFormat, 1);

        const a = document.createElement('a');
        a.href = imgData;
        a.download = this.chartTitle + '.' + fileExt;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        context.restore();
        this.chart.options = originalConfig.options;
        originalHidden.forEach((hidden: boolean, i: number) => {
          this.chart.getDatasetMeta(i).hidden = hidden;
        });
        this.chart.update();
      } catch (error) {
        console.error('Error exporting chart with legend:', error);
        this.exportCanvasOnly(imgFormat, fileExt);
      }
    } else {
      this.exportCanvasOnly(imgFormat, fileExt);
    }
  }

  private exportCanvasOnly(imgFormat: string, fileExt: string) {
    const context = this.canvas.getContext('2d');
    if (!context || !this.chart) return;

    const color = getTokenThemeVal('--kd-color-background-page-default');
    context.save();
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = color;
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const a = document.createElement('a');
    a.href = this.chart.toBase64Image(imgFormat, 1);
    a.download = this.chartTitle + '.' + fileExt;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    context.restore();
  }

  private exportSimpleCanvasOnly(imgFormat: string, fileExt: string) {
    const context = this.canvas.getContext('2d');
    if (!context || !this.chart) return;

    try {
      const originalOptions = JSON.parse(JSON.stringify(this.chart.options));

      context.save();
      const color = getTokenThemeVal('--kd-color-background-page-default');
      context.globalCompositeOperation = 'destination-over';
      context.fillStyle = color;
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.chart.options = {
        ...this.chart.options,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              padding: 10,
              font: { size: 12 },
            },
          },
          datalabels: { display: false, formatter: null },
          tooltip: { enabled: false },
          doughnutLabel: { enabled: false },
        },
        layout: {
          padding: { bottom: 40 },
        },
      };

      this.chart.update('none');

      const imgData = this.chart.toBase64Image(imgFormat, 1);

      const a = document.createElement('a');
      a.href = imgData;
      a.download = this.chartTitle + '.' + fileExt;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      context.restore();
      this.chart.options = originalOptions;
      this.chart.update();
    } catch (error) {
      console.error('Error in exportSimpleCanvasOnly:', error);
      this.exportCanvasOnly(imgFormat, fileExt);
    }
  }

  private handleDownloadCsv(e: Event) {
    e.preventDefault();
    let csv = '';

    // Special handling for tree and dendrogram charts
    if (this.type === 'tree' || this.type === 'dendrogram') {
      csv += convertTreeDataToCSV(this.datasets);
    } else {
      // Standard CSV handling for other chart types
      for (let i = 0; i < this.chart.data.datasets.length; i++) {
        csv += convertChartDataToCSV({
          data: this.chart.data.datasets[i],
          labels: this.labels,
        });
      }
    }

    if (csv == null || csv === '') return;

    const filename = this.chartTitle + '.csv';
    if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
    }

    // not sure if anything below this comment works
    const data = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  }

  private handleFullscreen() {
    if (this.shadowRoot?.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.container.requestFullscreen();
    }
  }

  private handleFullscreenChange() {
    this.fullscreen = this.shadowRoot?.fullscreenElement !== null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kd-chart': KDChart;
  }
}
