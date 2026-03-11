import { LitElement, PropertyValues, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import mermaid from 'mermaid';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';
import Styles from './mermaid.scss?inline';

import { monochrome24, duotone64 } from '@kyndryl-design-system/shidoka-icons';

/**
 * [Mermaid.js](https://mermaid.js.org) diagram wrapper component.
 * Includes a dark/light responsive theme out of the box with fully extensible mermaid.js configuration.
 */
@customElement('kyn-mermaid')
export class MermaidDiagram extends LitElement {
  /** Mermaid configuration object. */
  @property({ type: String })
  accessor diagramSyntax = ``;

  /** Mermaid configuration object. */
  @property({ type: Object })
  accessor mermaidConfig = {};

  /** Container element query for rendering the mermaid diagram.
   * @internal */
  @query('.kyn-mermaid')
  private accessor _container!: HTMLDivElement;

  /** Theme observer to watch for meta color-scheme changes.
   * @internal
   */
  _themeObserver: any = new MutationObserver((mutations: MutationRecord[]) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'content'
      ) {
        const newValue = (mutation.target as HTMLMetaElement).content;
        const oldValue = mutation.oldValue;

        if (newValue !== oldValue) {
          this._renderDiagram();
          break;
        }
      }
    }
  });

  override createRenderRoot() {
    return this;
  }

  override render() {
    return html`<div class="kyn-mermaid"></div>`;
  }

  override connectedCallback() {
    super.connectedCallback();

    // Inject component styles into <head> once (light DOM has no style scoping)
    if (!document.head.querySelector('style[data-kyn-mermaid]')) {
      const style = document.createElement('style');
      style.setAttribute('data-kyn-mermaid', '');
      style.textContent = Styles;
      document.head.appendChild(style);
    }

    // connect the theme change observer
    try {
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta instanceof Node) {
        this._themeObserver.observe(meta, {
          attributes: true,
          attributeFilter: ['content'], // only watch the content attribute
          attributeOldValue: true, // enables mutation.oldValue
        });
      }
    } catch (error) {
      console.warn('Failed to set up theme observer:', error);
    }
  }

  override disconnectedCallback() {
    this._themeObserver.disconnect();

    super.disconnectedCallback();
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    mermaid.registerIconPacks([
      {
        name: monochrome24.prefix,
        icons: monochrome24,
      },
      {
        name: duotone64.prefix,
        icons: duotone64,
      },
    ]);
  }

  override updated(changedProperties: Map<string, unknown>) {
    // re-render diagram when config is changed
    if (
      changedProperties.has('mermaidConfig') ||
      changedProperties.has('diagramSyntax')
    ) {
      this._renderDiagram();
    }
  }

  /**
   * Build mermaid themeVariables from the active Shidoka design tokens.
   * Uses `theme: 'base'` so every variable is respected.
   * Any token that fails to resolve is omitted so mermaid uses its own default.
   */
  private _getThemeVariables(): Record<
    string,
    string | Record<string, string>
  > {
    const raw: Record<string, string | Record<string, string>> = {
      // typography
      fontFamily: 'Roboto',
      fontSize: '14px',

      // primary nodes
      primaryColor: getTokenThemeVal('--kd-color-background-container-default'),
      primaryTextColor: getTokenThemeVal('--kd-color-text-level-primary'),
      primaryBorderColor: getTokenThemeVal('--kd-color-border-forms-default'),

      // secondary nodes
      secondaryColor: getTokenThemeVal(
        '--kd-color-background-container-tertiary'
      ),

      // tertiary nodes
      tertiaryColor: getTokenThemeVal('--kd-color-background-accent-tertiary'),

      // text / lines
      lineColor: getTokenThemeVal('--kd-color-border-forms-default'),

      // git graph
      commitLabelColor: getTokenThemeVal('--kd-color-text-level-primary'),

      // flowchart
      edgeLabelBackground: getTokenThemeVal(
        '--kd-color-background-accent-tertiary'
      ),

      xyChart: {
        backgroundColor: 'transparent',
      },
    };

    // Remove entries that failed to resolve so mermaid uses its own defaults
    // instead of receiving an empty string and throwing.
    return Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== ''));
  }

  // Render the mermaid diagram from the diagramSyntax property.
  private async _renderDiagram() {
    if (!this._container) return;

    const text = this.diagramSyntax.trim();
    if (!text) return;

    try {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose', // allow html in labels for icons
        theme: 'base',
        themeVariables: this._getThemeVariables(),
        architecture: {
          iconSize: 64,
        },
        ...this.mermaidConfig,
      });

      const id = `kyn-mermaid-svg-${crypto.randomUUID()}`;
      const { svg, bindFunctions } = await mermaid.render(id, text);
      this._container.innerHTML = svg;
      bindFunctions?.(this._container);
    } catch (e) {
      console.error('[kyn-mermaid] render error:', e);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-mermaid': MermaidDiagram;
  }
}
