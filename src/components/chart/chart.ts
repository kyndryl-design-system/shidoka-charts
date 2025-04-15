import { LitElement, html } from 'lit';
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
import canvasBackgroundPlugin from '../../common/plugins/canvasBackground';
import doughnutLabelPlugin from '../../common/plugins/doughnutLabel';
import meterGaugePlugin from '../../common/plugins/meterGaugeNeedle';
import gradientLegendPlugin from '../../common/plugins/gradientLegend';
import { renderHTMLLegend } from '../../common/legend';
import a11yPlugin from 'chartjs-plugin-a11y-legend';
import datalabelsPlugin from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import { convertChartDataToCSV, debounce } from '../../common/helpers/helpers';
import ChartScss from './chart.scss';
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
  annotationPlugin,
  datalabelsPlugin
);

/**
 * Chart.js wrapper component.
 * @slot unnamed - Slot for custom content between header and chart.
 * @slot controls - Slot for custom controls such as an overflow menu.
 * @slot tooltip - Slot for tooltip in header.
 * @slot draghandle - Slot for widget drag handle.
 */
@customElement('kd-chart')
export class KDChart extends LitElement {
  static override styles = ChartScss;

  /** Chart title. */
  @property({ type: String })
  chartTitle = '';

  /** Chart description. */
  @property({ type: String })
  description = '';

  /** Chart.js chart type. */
  @property({ type: String })
  type: any = '';

  /** Chart.js data.labels. */
  @property({ type: Array })
  labels!: Array<string>;

  /** Chart.js data.datasets. */
  @property({ type: Array })
  datasets!: Array<any>;

  /** Chart.js options. Can override Shidoka defaults. */
  @property({ type: Object })
  options: any = {};

  /** Chart.js additional plugins. Must be registerable inline via Chart.plugins array, not globally via Chart.register. */
  @property({ type: Array })
  plugins: any = [];

  /** Chart.js canvas height (px). Disables maintainAspectRatio option. */
  @property({ type: Number })
  height: any = null;

  /** Chart.js canvas width (px). Disables maintainAspectRatio option. */
  @property({ type: Number })
  width: any = null;

  /** Hides the description visually. */
  @property({ type: Boolean })
  hideDescription = false;

  /** Hides the closed captions visually. */
  @property({ type: Boolean })
  hideCaptions = false;

  /** Hides the title & description. */
  @property({ type: Boolean })
  hideHeader = false;

  /** Hides the controls. */
  @property({ type: Boolean })
  hideControls = false;

  /** Removes the outer border and padding. */
  @property({ type: Boolean })
  noBorder = false;

  /** Customizable text labels. */
  @property({ type: Object })
  customLabels = {
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
  fullscreen = false;

  /**
   * Queries the container element.
   * @ignore
   */
  @query('.container')
  container!: HTMLCanvasElement;

  /**
   * Queries the canvas element.
   * @ignore
   */
  @query('canvas')
  canvas!: HTMLCanvasElement;

  /**
   * Queries the closed caption div.
   * @ignore
   */
  @query('.closed-caption')
  ccDiv!: HTMLDivElement;

  /** The chart instance.
   * @ignore
   */
  @state()
  chart: any = null;

  /** Table view mode.
   * @ignore
   */
  @state()
  tableView = false;

  /** Disable table view feature.
   * @ignore
   */
  @state()
  tableDisabled = false;

  /** Merged options.
   * @ignore
   */
  @state()
  mergedOptions: any = {};

  /** Merged datasets.
   * @ignore
   */
  @state()
  mergedDatasets: any = {};

  /** Is Widget. Inherited from kyn-widget.
   * @internal
   */
  @state()
  _widget = false;

  /** ResizeObserver for canvas-container.
   * @internal
   */
  _resizeObserver: any = new ResizeObserver(
    debounce(() => {
      this._resizeChart();
    })
  );

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
                        ${!this.tableDisabled
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
                  ${this.type === 'matrix'
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
                                      ${this.labels.length
                                        ? html`
                                            ${this.options?.scales[IndexAxis]
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
                                          typeof dataPoint === 'object' &&
                                          !Array.isArray(dataPoint) &&
                                          dataPoint !== null
                                        ) {
                                          return html`
                                            <td>
                                              ${Object.keys(dataPoint).map(
                                                (key) => {
                                                  const Label =
                                                    this.options.scales[key]
                                                      ?.title?.text || key;
                                                  const DisplayData =
                                                    this.options.scales[key]
                                                      ?.type === 'time'
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

    this._themeObserver.observe(
      document.querySelector('meta[name="color-scheme"]'),
      { attributes: true }
    );
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

  /** Use HTML legend instead of Chart.js built-in canvas legend.
   * @public
   */
  @property({ type: Boolean })
  useHtmlLegend = false;

  private generateScrollableLegend() {
    if (!this.chart || !this.useHtmlLegend) return;

    const legendContainer = this.shadowRoot?.querySelector(
      '.html-legend-container'
    );
    if (!legendContainer) return;

    const legendOptions = this.mergedOptions.plugins.customLegend;

    renderHTMLLegend(this.chart, legendContainer as HTMLElement, {
      maxHeight: legendOptions?.maxHeight || 100,
      boxWidth: legendOptions?.boxWidth || 16,
      boxHeight: legendOptions?.boxHeight || 16,
      borderRadius: legendOptions?.borderRadius || 2,
    });
  }

  override updated(changedProps: any) {
    // Update chart instance when data changes.
    if (
      this.chart &&
      (changedProps.has('labels') ||
        changedProps.has('datasets') ||
        changedProps.has('options'))
    ) {
      this.mergeOptions().then(() => {
        this.chart.data.labels = this.labels;
        this.chart.options = this.mergedOptions;

        // remove datasets not in mergedDatasets
        this.chart.data.datasets.forEach((dataset: any, index: number) => {
          const NewDataset = this.mergedDatasets.find(
            (newDataset: any) => newDataset.label === dataset.label
          );

          if (!NewDataset) {
            // remove
            this.chart.data.datasets.splice(index, 1);
          }
        });

        // update datasets, add new ones
        this.mergedDatasets.forEach((dataset: any) => {
          const OldDataset = this.chart.data.datasets.find(
            (oldDataset: any) => oldDataset.label === dataset.label
          );

          if (!OldDataset) {
            // add new dataset
            this.chart.data.datasets.push(dataset);
          } else {
            // update each key/entry in the dataset object
            Object.keys(dataset).forEach((key) => {
              OldDataset[key] = dataset[key];
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

    // Re-init chart instance when type, plugins, colorPalette, width, height, or useHtmlLegend change.
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
    const ignoredTypes = ['choropleth', 'treemap', 'bubbleMap'];

    // Configure chart options
    Chart.defaults.color = getTokenThemeVal('--kd-color-text-level-primary');

    // We already handled legend config in mergeOptions

    // Select plugin when type='meter'. Otherwise both plugins (meterGaugePlugin & doughnutLabelPlugin) are called
    const pluginSelectForDoghnutMeter =
      this.type === 'meter' ? meterGaugePlugin : doughnutLabelPlugin;

    let plugins = [
      canvasBackgroundPlugin,
      pluginSelectForDoghnutMeter,
      gradientLegendPlugin,
      ...this.plugins,
    ];

    // only add certain plugins for standard chart types
    if (!ignoredTypes.includes(this.type)) {
      // plugins = [...plugins, a11yPlugin, musicPlugin];
      plugins = [...plugins, a11yPlugin];
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.canvas, {
      //type: this.type,
      type: this.type === 'meter' ? 'doughnut' : this.type,
      data: {
        labels: this.labels,
        datasets: this.mergedDatasets,
      },
      options: this.mergedOptions,
      plugins: plugins,
    });

    this.generateScrollableLegend();
  }

  /**
   * Merges various chart type options and dataset options to create a
   * final set of options for a chart.
   */
  private async mergeOptions() {
    const radialTypes = ['pie', 'doughnut', 'radar', 'polarArea', 'meter'];
    const ignoredTypes = ['choropleth', 'treemap', 'bubbleMap'];

    const additionalTypeImports: any = [];
    this.datasets.forEach((dataset) => {
      // get chart types from datasets so we can import additional configs
      if (dataset.type) {
        additionalTypeImports.push(
          import(`../../common/config/chartTypes/${dataset.type}.js`)
        );
      }
    });

    // import main and additional chart type configs
    const chartTypeConfigs = await Promise.all([
      import(`../../common/config/chartTypes/${this.type}.js`),
      ...additionalTypeImports,
    ]);

    // start with global options
    let mergedOptions: any = globalOptions(this);

    // Configure legend display based on useHtmlLegend property
    if (!this.useHtmlLegend) {
      // Enable built-in Chart.js legend when HTML legend is disabled
      mergedOptions.plugins = mergedOptions.plugins || {};
      mergedOptions.plugins.legend = mergedOptions.plugins.legend || {};
      mergedOptions.plugins.legend.display = true;

      // Disable customLegend options when using built-in legend
      if (mergedOptions.plugins.customLegend) {
        mergedOptions.plugins.customLegend.display = false;
      }
    }

    // merge global type options
    if (radialTypes.includes(this.type)) {
      mergedOptions = deepmerge(mergedOptions, globalOptionsRadial(this));
    } else if (!ignoredTypes.includes(this.type)) {
      mergedOptions = deepmerge(mergedOptions, globalOptionsNonRadial(this));
    }

    const mergedDatasets: any = JSON.parse(JSON.stringify(this.datasets));

    chartTypeConfigs.forEach((chartTypeConfig: any) => {
      // merge all of the imported chart type options with the global options
      mergedOptions = deepmerge(mergedOptions, chartTypeConfig.options(this));

      // merge all of the imported chart type dataset options
      mergedDatasets.forEach((dataset: any, index: number) => {
        if (
          (!dataset.type && chartTypeConfig.type === this.type) ||
          dataset.type === chartTypeConfig.type
        ) {
          mergedDatasets[index] = deepmerge(
            dataset,
            chartTypeConfig.datasetOptions(this, index)
          );
        }
      });
    });

    if (this.options) {
      // merge any consumer supplied options with defaults
      mergedOptions = deepmerge(mergedOptions, this.options);
    }
    this.mergedOptions = mergedOptions;

    // merge default chart type dataset options with consumer supplied datasets
    mergedDatasets.forEach((dataset: object, index: number) => {
      const customDeepmerge = deepmergeCustom({
        mergeArrays: false,
      });
      mergedDatasets[index] = customDeepmerge(dataset, this.datasets[index]);
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
    const blacklist: any = [];
    this.tableDisabled = blacklist.includes(this.type);
  }

  private handleDownloadImage(e: Event, jpeg: boolean) {
    e.preventDefault();

    // add bg color to canvas
    const context: any = this.canvas.getContext('2d');
    const color = getTokenThemeVal('--kd-color-background-page-default');
    context.save();
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = color;
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // set image format
    const imgFormat = jpeg ? 'image/jpeg' : 'image/png';
    const fileExt = jpeg ? 'jpg' : 'png';

    // create a fake link to download the image
    const a = document.createElement('a');
    a.href = this.chart.toBase64Image(imgFormat, 1);
    a.download = this.chartTitle + '.' + fileExt;

    // trigger the download
    a.click();

    // remove canvas bg color
    context.restore();
  }

  private handleDownloadCsv(e: Event) {
    e.preventDefault();
    let csv = '';

    for (let i = 0; i < this.chart.data.datasets.length; i++) {
      csv += convertChartDataToCSV({
        data: this.chart.data.datasets[i],
        labels: this.labels,
      });
    }
    if (csv == null) return;

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
