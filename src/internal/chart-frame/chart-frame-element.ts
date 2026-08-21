import { LitElement, PropertyValues, html, nothing, unsafeCSS } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import chartIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/analytics.svg';
import tableIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/table-view.svg';
import downloadIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/download.svg';
import ChartFrameScss from './chart-frame.scss?inline';
import { RendererController } from './renderer-controller';
import { resolveChartTheme } from './theme';
import { tableViewToCsv, toSafeFileName } from './csv';
import {
  csvToDataUrl,
  downloadDataUrl,
  imageFormatExtension,
  imageFormatLabel,
} from './export';
import type {
  ChartImageFormat,
  ChartInteraction,
  ChartRenderer,
  ChartTableView,
  ChartTheme,
  RendererCapabilities,
  RendererContext,
} from './types';

/** Text labels a consumer can override. */
export interface ChartFrameLabels {
  toggleView: string;
  downloadMenu: string;
  downloadCsv: string;
  /** Prefix applied to each capability-advertised image format. */
  downloadImage: string;
  emptyState: string;
}

const DEFAULT_LABELS: ChartFrameLabels = {
  toggleView: 'Toggle View Mode',
  downloadMenu: 'Download Menu',
  downloadCsv: 'Download as CSV',
  downloadImage: 'Download as',
  emptyState: 'No data available.',
};

/**
 * Engine-neutral chrome shared by hybrid chart components.
 *
 * The frame owns the header, controls, table fallback, CSV export, theme
 * observation, resize coordination and normalized events. It knows nothing
 * about any charting engine: everything engine-specific reaches it through
 * `ChartRenderer` and `RendererCapabilities`.
 */
export abstract class ChartFrameElement<TModel> extends LitElement {
  static override styles = unsafeCSS(ChartFrameScss);

  /** Chart title. Also the accessible name of the chart region. */
  @property({ type: String })
  accessor chartTitle = '';

  /** Chart description. Also the accessible description of the chart region. */
  @property({ type: String })
  accessor description = '';

  /** Hides the description visually while keeping it available to screen readers. */
  @property({ type: Boolean })
  accessor hideDescription = false;

  /** Hides all of the controls. */
  @property({ type: Boolean })
  accessor hideControls = false;

  /** Hides the table view control. */
  @property({ type: Boolean })
  accessor hideTableControl = false;

  /** Hides the download control. */
  @property({ type: Boolean })
  accessor hideDownloadControl = false;

  /** Removes the outer border and padding. */
  @property({ type: Boolean })
  accessor noBorder = false;

  /** Chart region height in px. */
  @property({ type: Number })
  accessor height = 400;

  /** Shidoka data visualization palette key. */
  @property({ type: String })
  accessor colorPalette = 'categorical';

  /** Customizable text labels. */
  @property({ type: Object })
  accessor customLabels: Partial<ChartFrameLabels> = {};

  /**
   * Escape hatch for engine-native configuration. The shape is whatever the
   * underlying engine expects and is **not** normalized across engines.
   *
   * Unstable: this property is engine-specific and may change or be removed
   * without a breaking-change release.
   */
  @property({ type: Object })
  accessor unsafeNativeOptions: unknown = undefined;

  /** Table view mode.
   * @internal
   */
  @state()
  accessor _tableView = false;

  /** Stable renderer host. The renderer owns everything inside it.
   * @internal
   */
  @query('.renderer-host')
  private accessor _host!: HTMLDivElement;

  private _controller: RendererController<TModel> | null = null;
  private _capabilities: RendererCapabilities | null = null;
  private _themeObserver: MutationObserver | null = null;
  private _motionQuery: MediaQueryList | null = null;
  private _motionListener: (() => void) | null = null;
  private _reducedMotion = false;
  private _theme: ChartTheme | null = null;
  private _hasRendered = false;

  /** Creates the renderer for this chart. One renderer per component. */
  protected abstract createRenderer(): ChartRenderer<TModel>;

  /** Builds the renderer model, or null when there is nothing to draw. */
  protected abstract buildModel(): TModel | null;

  /** Builds the tabular fallback, which is also the CSV source of truth. */
  protected abstract buildTableView(model: TModel): ChartTableView;

  /** Reactive properties that should trigger a renderer update. */
  protected abstract get dataProperties(): readonly string[];

  /** Optional short summary rendered beneath the chart. */
  protected get captionText(): string {
    return '';
  }

  /** Fallback name used for downloaded files. */
  protected get fileNameFallback(): string {
    return 'chart';
  }

  private get labels(): ChartFrameLabels {
    return { ...DEFAULT_LABELS, ...this.customLabels };
  }

  /**
   * Capabilities are constant per renderer class, so they are read from a
   * throwaway instance during the first render. Reading them after mount would
   * mean changing state inside an update cycle.
   */
  private get capabilities(): RendererCapabilities {
    this._capabilities ??= this.createRenderer().capabilities;
    return this._capabilities;
  }

  /**
   * Unstable escape hatch returning the underlying engine instance, or null
   * when nothing is mounted. The type is engine-specific and may change or be
   * removed without a breaking-change release.
   */
  unsafeGetNativeInstance(): unknown {
    return this._controller?.nativeInstance() ?? null;
  }

  /** Forces a renderer update, e.g. after mutating a model array in place. */
  refresh(): void {
    const model = this.buildModel();
    if (model && this._controller?.mounted) {
      this._theme = resolveChartTheme(this.colorPalette);
      this._controller.update(this.rendererContext(model));
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.observeTheme();
    this.observeReducedMotion();

    // Reconnect: the element already rendered once, so `firstUpdated` will not
    // run again and the renderer has to be re-created explicitly.
    if (this._hasRendered) {
      this.updateComplete.then(() => this.ensureMounted());
    }
  }

  override disconnectedCallback(): void {
    this.teardown();
    super.disconnectedCallback();
  }

  protected override firstUpdated(_changed: PropertyValues): void {
    this._hasRendered = true;
    this.ensureMounted();
  }

  protected override updated(changed: PropertyValues): void {
    if (!this._controller?.mounted) {
      this.ensureMounted();
      return;
    }

    const shouldUpdate =
      changed.has('colorPalette') ||
      changed.has('unsafeNativeOptions') ||
      this.dataProperties.some((name) => changed.has(name));

    if (shouldUpdate) {
      const model = this.buildModel();
      if (model) {
        this._theme = resolveChartTheme(this.colorPalette);
        this._controller.update(this.rendererContext(model));
      }
    }
  }

  override render() {
    const model = this.buildModel();
    const table = model ? this.buildTableView(model) : null;
    const hasName = Boolean(this.chartTitle || this.description);
    const caption = this.captionText;

    return html`
      <div class=${classMap({ container: true, 'no-border': this.noBorder })}>
        <div class="header">
          <div id="titleDesc">
            <div class="title" id="chartFrameTitle">${this.chartTitle}</div>
            <div
              class=${classMap({
                description: true,
                'hidden-visually': this.hideDescription,
              })}
              id="chartFrameDescription"
            >
              ${this.description}
            </div>
          </div>
          ${this.hideControls ? nothing : this.renderControls(table)}
        </div>

        <figure class=${classMap({ hidden: this._tableView })}>
          <div
            class="renderer-host"
            role="img"
            tabindex="0"
            style="height: ${this.height}px"
            aria-labelledby=${ifDefined(hasName ? 'chartFrameTitle' : undefined)}
            aria-label=${ifDefined(hasName ? undefined : 'Chart')}
            aria-describedby=${ifDefined(
              this.description ? 'chartFrameDescription' : undefined
            )}
          ></div>
          <figcaption>${caption}</figcaption>
          ${model ? nothing : html`<p class="empty-state">${this.labels.emptyState}</p>`}
        </figure>

        ${this._tableView && table ? this.renderTable(table) : nothing}
      </div>
    `;
  }

  private renderControls(table: ChartTableView | null) {
    const labels = this.labels;
    const imageFormats = this.capabilities.imageExport;
    const canDownload =
      !this.hideDownloadControl && (Boolean(table) || imageFormats.length > 0);

    return html`
      <div class="controls">
        ${this.hideTableControl || !table
          ? nothing
          : html`
              <button
                class="control-button"
                aria-label=${labels.toggleView}
                title=${labels.toggleView}
                aria-pressed=${this._tableView ? 'true' : 'false'}
                @click=${() => this.toggleTableView()}
              >
                <span
                  >${this._tableView
                    ? unsafeSVG(chartIcon)
                    : unsafeSVG(tableIcon)}</span
                >
              </button>
            `}
        ${canDownload
          ? html`
              <div class="download">
                <button
                  class="control-button"
                  aria-label=${labels.downloadMenu}
                  title=${labels.downloadMenu}
                >
                  <span>${unsafeSVG(downloadIcon)}</span>
                </button>
                <div class="download-menu">
                  ${table
                    ? html`
                        <button @click=${() => this.downloadCsv(table)}>
                          ${labels.downloadCsv}
                        </button>
                      `
                    : nothing}
                  ${this._tableView
                    ? nothing
                    : imageFormats.map(
                        (format) => html`
                          <button @click=${() => this.downloadImage(format)}>
                            ${labels.downloadImage}
                            ${imageFormatLabel(format)}
                          </button>
                        `
                      )}
                </div>
              </div>
            `
          : nothing}
        <slot name="controls"></slot>
      </div>
    `;
  }

  private renderTable(table: ChartTableView) {
    return html`
      <div class="table">
        <table>
          <thead>
            <tr>
              ${table.columns.map((column) => html`<th scope="col">${column}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${table.rows.map(
              (row) => html`
                <tr>
                  ${row.map((cell) => html`<td>${cell}</td>`)}
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  private toggleTableView(): void {
    this._tableView = !this._tableView;
    this.dispatchEvent(
      new CustomEvent('on-view-toggle', {
        detail: { tableView: this._tableView },
        bubbles: true,
        composed: true,
      })
    );
  }

  private downloadCsv(table: ChartTableView): void {
    const csv = tableViewToCsv(table);
    if (!csv) return;

    const name = toSafeFileName(this.chartTitle, this.fileNameFallback);
    downloadDataUrl(csvToDataUrl(csv), `${name}.csv`);
  }

  private downloadImage(format: ChartImageFormat): void {
    const theme = this._theme ?? resolveChartTheme(this.colorPalette);
    const dataUrl = this._controller?.toDataUrl(format, theme.backgroundColor);
    if (!dataUrl) return;

    const name = toSafeFileName(this.chartTitle, this.fileNameFallback);
    downloadDataUrl(dataUrl, `${name}.${imageFormatExtension(format)}`);
  }

  private rendererContext(model: TModel): RendererContext<TModel> {
    return {
      model,
      theme: this._theme ?? resolveChartTheme(this.colorPalette),
      reducedMotion: this._reducedMotion,
      nativeOptions: this.unsafeNativeOptions,
      emit: (interaction: ChartInteraction) => this.emitInteraction(interaction),
    };
  }

  private emitInteraction(interaction: ChartInteraction): void {
    this.dispatchEvent(
      new CustomEvent('on-chart-interaction', {
        detail: interaction,
        bubbles: true,
        composed: true,
      })
    );
  }

  private ensureMounted(): void {
    if (this._controller?.mounted) return;

    const model = this.buildModel();
    if (!model || !this._host || !this.isConnected) return;

    this._theme = resolveChartTheme(this.colorPalette);
    this._controller ??= new RendererController<TModel>(() =>
      this.createRenderer()
    );
    this._controller.mount(this._host, this.rendererContext(model));
  }

  private teardown(): void {
    this._controller?.destroy();
    this._controller = null;

    this._themeObserver?.disconnect();
    this._themeObserver = null;

    if (this._motionQuery && this._motionListener) {
      this._motionQuery.removeEventListener('change', this._motionListener);
    }
    this._motionQuery = null;
    this._motionListener = null;
  }

  private observeTheme(): void {
    if (this._themeObserver) return;

    try {
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (!(meta instanceof Node)) return;

      this._themeObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'content' &&
            (mutation.target as HTMLMetaElement).content !== mutation.oldValue
          ) {
            this.handleThemeChange();
            break;
          }
        }
      });

      this._themeObserver.observe(meta, {
        attributes: true,
        attributeFilter: ['content'],
        attributeOldValue: true,
      });
    } catch (error) {
      console.warn('Failed to set up chart theme observer:', error);
    }
  }

  private observeReducedMotion(): void {
    if (this._motionQuery || typeof window.matchMedia !== 'function') return;

    this._motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this._reducedMotion = this._motionQuery.matches;
    this._motionListener = () => {
      this._reducedMotion = this._motionQuery?.matches ?? false;
      this.refresh();
    };
    this._motionQuery.addEventListener('change', this._motionListener);
  }

  private handleThemeChange(): void {
    this._theme = resolveChartTheme(this.colorPalette);
    const model = this.buildModel();

    if (model && this._controller?.mounted) {
      this._controller.update(this.rendererContext(model));
    }
  }
}
