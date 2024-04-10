import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
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
import canvasBackgroundPlugin from '../../common/plugins/canvasBackground';
import doughnutLabelPlugin from '../../common/plugins/doughnutLabel';
import a11yPlugin from 'chartjs-plugin-a11y-legend';
import musicPlugin from 'chartjs-plugin-chart2music';
import datalabelsPlugin from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import { convertChartDataToCSV, debounce } from '../../common/helpers/helpers';
import ChartScss from './chart.scss';
import globalOptions from '../../common/config/globalOptions';
import globalOptionsNonRadial from '../../common/config/globalOptionsNonRadial';
import globalOptionsRadial from '../../common/config/globalOptionsRadial';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import chartIcon from '@carbon/icons/es/chart--line/24';
import tableIcon from '@carbon/icons/es/table-of-contents/24';
import downloadIcon from '@carbon/icons/es/download/20';
import maximizeIcon from '@carbon/icons/es/maximize/20';
import minimizeIcon from '@carbon/icons/es/minimize/20';

Chart.register(
  ChoroplethController,
  BubbleMapController,
  GeoFeature,
  ColorScale,
  SizeScale,
  ProjectionScale,
  TreemapController,
  TreemapElement
);

/**
 * Chart.js wrapper component.
 * @slot unnamed - Slot for custom content between header and chart.
 * @slot controls - Slot for custom controls such as an overflow menu.
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

  override render() {
    return html`
      <div
        class="container ${this.fullscreen ? 'fullscreen' : ''}
          ${this.noBorder ? 'no-border' : ''}"
        @fullscreenchange=${() => this.handleFullscreenChange()}
      >
        ${!this.hideHeader || !this.hideControls
          ? html`
              <div class="header">
                ${!this.hideHeader
                  ? html`
                      <div>
                        <div class="title">${this.chartTitle}</div>
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
                                title="Toggle View Mode"
                                aria-label="Toggle View Mode"
                                class="view-toggle control-button"
                                @click=${() => this.handleViewToggle()}
                              >
                                <kd-icon
                                  .icon=${chartIcon}
                                  class="${!this.tableView ? 'active' : ''}"
                                ></kd-icon>
                                <kd-icon
                                  .icon=${tableIcon}
                                  class="${this.tableView ? 'active' : ''}"
                                ></kd-icon>
                              </button>
                            `
                          : null}

                        <button
                          title=${this.customLabels.toggleFullscreen}
                          aria-label=${this.customLabels.toggleFullscreen}
                          class="control-button"
                          @click=${() => this.handleFullscreen()}
                        >
                          <kd-icon
                            .icon=${this.fullscreen
                              ? minimizeIcon
                              : maximizeIcon}
                          ></kd-icon>
                        </button>

                        <div class="download">
                          <button
                            title=${this.customLabels.downloadMenu}
                            aria-label=${this.customLabels.downloadMenu}
                            class="control-button download-button"
                          >
                            <kd-icon .icon=${downloadIcon}></kd-icon>
                          </button>

                          <div class="download-menu">
                            ${!this.tableDisabled
                              ? html`
                                  <button
                                    @click=${(e: Event) =>
                                      this.handleDownloadCsv(e)}
                                  >
                                    ${this.customLabels.downloadCsv}
                                  </button>
                                `
                              : null}
                            <button
                              @click=${(e: Event) =>
                                this.handleDownloadImage(e, false)}
                            >
                              ${this.customLabels.downloadPng}
                            </button>
                            <button
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

        <slot></slot>

        <figure class="${this.tableView ? 'hidden' : ''}">
          <div
            class="canvas-container"
            style="${this.width ? `width: ${this.width}px;` : ''}
              ${this.height ? `height: ${this.height}px;` : ''}"
          >
            <canvas role="img"></canvas>
          </div>
          <figcaption>
            <div
              class="closed-caption ${this.hideCaptions
                ? 'hidden-visually'
                : ''}"
            ></div>
          </figcaption>
        </figure>

        ${!this.tableDisabled && this.tableView
          ? html`
              <div class="table">
                <table>
                  <thead>
                    <tr>
                      ${this.labels.length
                        ? html`<th>${this.getTableAxisLabel()}</th>`
                        : null}
                      ${this.datasets.map((dataset) => {
                        return html`<th>${dataset.label}</th>`;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    ${this.datasets[0].data.map((_value: any, i: number) => {
                      return html`
                        <tr>
                          ${this.labels.length
                            ? html`<td>${this.labels[i]}</td>`
                            : null}
                          ${this.datasets.map((dataset) => {
                            const dataPoint = dataset.data[i];

                            if (Array.isArray(dataPoint)) {
                              // handle data in array format
                              return html`
                                <td>${dataPoint[0]}, ${dataPoint[1]}</td>
                              `;
                            } else if (
                              typeof dataPoint === 'object' &&
                              !Array.isArray(dataPoint) &&
                              dataPoint !== null
                            ) {
                              // handle data in object format
                              return html`
                                <td>
                                  ${Object.keys(dataPoint).map((key) => {
                                    return html`
                                      <span>${key}: ${dataPoint[key]}</span>
                                    `;
                                  })}
                                </td>
                              `;
                            } else {
                              // handle data in number/basic format
                              return html`<td>${dataset.data[i]}</td>`;
                            }
                          })}
                        </tr>
                      `;
                    })}
                  </tbody>
                </table>
              </div>
            `
          : null}
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();

    const Parent = this;
    window?.addEventListener(
      'resize',
      debounce(() => {
        Parent._resizeChart();
      }, 50)
    );
  }

  override disconnectedCallback() {
    const Parent = this;
    window?.removeEventListener(
      'resize',
      debounce(() => {
        Parent._resizeChart();
      }, 50)
    );

    super.disconnectedCallback();
  }

  private _resizeChart() {
    if (this.chart) {
      this.chart.resize();
    }
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
      });
    }

    // init chart
    // check to make sure initial datasets + data have been provided
    let hasData = false;
    if (this.datasets && this.datasets.length) {
      this.datasets.forEach((dataset) => {
        hasData = dataset.data.length > 0;
      });
    }

    if (!this.chart && this.type && changedProps.has('datasets') && hasData) {
      this.mergeOptions().then(() => {
        this.initChart();
      });

      this.checkType();
    }

    // Re-init chart instance when type, plugins, colorPalette, width, or height change.
    if (
      this.chart &&
      (changedProps.has('type') ||
        changedProps.has('plugins') ||
        changedProps.has('width') ||
        changedProps.has('height'))
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

    // Chart.defaults.font.family = getComputedStyle(
    //   document.documentElement
    // ).getPropertyValue('--kd-font-family-secondary');
    Chart.defaults.color =
      getComputedStyle(document.documentElement).getPropertyValue(
        '--kd-color-text-primary'
      ) || '#3d3c3c';

    let plugins = [
      canvasBackgroundPlugin,
      doughnutLabelPlugin,
      ...this.plugins,
    ];

    // only add certain plugins for standard chart types
    if (!ignoredTypes.includes(this.type)) {
      plugins = [
        ...plugins,
        a11yPlugin,
        musicPlugin,
        annotationPlugin,
        datalabelsPlugin,
      ];
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.canvas, {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: this.mergedDatasets,
      },
      options: this.mergedOptions,
      plugins: plugins,
    });
  }

  /**
   * Merges various chart type options and dataset options to create a
   * final set of options for a chart.
   */
  private async mergeOptions() {
    const radialTypes = ['pie', 'doughnut', 'radar', 'polarArea'];
    const ignoredTypes = ['choropleth', 'treemap', 'bubbleMap'];

    // get chart types from datasets so we can import additional configs
    const additionalTypeImports: any = [];
    this.datasets.forEach((dataset) => {
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
    const blacklist = ['choropleth', 'bubbleMap', 'treemap'];
    this.tableDisabled = blacklist.includes(this.type);
  }

  private handleDownloadImage(e: Event, jpeg: boolean) {
    e.preventDefault();

    const imgFormat = jpeg ? 'image/jpeg' : 'image/png';
    const fileExt = jpeg ? 'jpg' : 'png';
    const a = document.createElement('a');

    a.href = this.chart.toBase64Image(imgFormat, 1);
    a.download = this.chartTitle + '.' + fileExt;

    // trigger the download
    a.click();
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
