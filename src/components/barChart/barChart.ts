import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import Chart from 'chart.js/auto';
import a11yPlugin from 'chartjs-plugin-a11y-legend';
import musicPlugin from 'chartjs-plugin-chart2music';
import BarChartScss from './barChart.scss';

/**
 * Bar chart.
 */
@customElement('kd-chart-bar')
export class BarChart extends LitElement {
  static override styles = BarChartScss;

  /** Chart title. */
  @property({ type: String })
  chartTitle = '';

  /** Chart description. */
  @property({ type: String })
  description = '';

  /** Chart.js labels. */
  @property({ type: Array })
  labels!: Array<string>;

  /** Chart.js datasets. Datasets are layered top to bottom. */
  @property({ type: Array })
  datasets!: Array<any>;

  /** Horizontal layout. */
  @property({ type: Boolean })
  horizontal = false;

  /** Stacked bars/datasets. Does not work on Combo charts. */
  @property({ type: Boolean })
  stacked = false;

  /** Chart.js options. Can override Shidoka defaults. */
  @property({ type: Object })
  options: object = {};

  /** Hides the description visually. */
  @property({ type: Boolean })
  hideDescription = false;

  /** Hides the closed captions visually. */
  @property({ type: Boolean })
  hideCaptions = false;

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

  override render() {
    return html`
      <figure>
        <div class="title">${this.chartTitle}</div>
        <canvas role="img"></canvas>
        <figcaption>
          <div
            class="closed-caption ${this.hideCaptions ? 'hidden-visually' : ''}"
          ></div>
          <div
            class="description ${this.hideDescription ? 'hidden-visually' : ''}"
          >
            ${this.description}
          </div>
        </figcaption>
      </figure>
    `;
  }

  override firstUpdated() {
    this.initChart();
  }

  override updated(changedProps: any) {
    // Update chart instance when data changes.
    if (changedProps.has('labels') || changedProps.has('datasets')) {
      this.chart.data.labels = this.labels;
      this.chart.data.datasets = this.datasets;
      this.chart.update();
    }

    // Update chart instance when options change.
    if (
      changedProps.has('options') ||
      changedProps.has('horizontal') ||
      changedProps.has('stacked')
    ) {
      this.chart.options = this.mergeOptions();
      this.chart.update();
    }
  }

  /**
   * Initializes a bar chart using the Chart.js library with provided labels, datasets,
   * and options.
   */
  private initChart() {
    this.chart = new Chart(this.canvas, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: this.datasets,
      },
      options: this.mergeOptions(),
      plugins: [a11yPlugin, musicPlugin],
    });
  }

  /**
   * Merges the default options with the custom options and returns the merged options.
   * @returns the merged options object.
   */
  private mergeOptions() {
    // set default options
    let options: any = {
      indexAxis: this.horizontal ? 'y' : 'x',
      scales: {
        x: {
          stacked: this.stacked ? true : false,
        },
        y: {
          stacked: this.stacked ? true : false,
        },
      },
      plugins: {
        chartjs2music: {
          cc: this.ccDiv,
        },
      },
    };

    // merge custom options
    if (this.options) {
      options = { ...options, ...this.options };
    }

    return options;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kd-chart-bar': BarChart;
  }
}
