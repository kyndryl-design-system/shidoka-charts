import * as pbi from 'powerbi-client';
import { loadPbiTheme } from '../../powerbi/loadTheme.js';

const DEV =
  typeof import.meta !== 'undefined' &&
  import.meta.env &&
  Boolean(import.meta.env.DEV);

const log = (scope, err) => {
  if (DEV) console.warn(`[pbi-embed] ${scope}`, err);
};

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: block; }
    .frame {
      height: 560px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      background: #fff;
      position: relative;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }
  </style>
  <div class="frame"></div>
`;

export class PbiEmbed extends HTMLElement {
  static get observedAttributes() {
    return [
      'public-iframe-src',
      'embed-url',
      'report-id',
      'token',
      'token-type',
      'palette',
      'mode',
      'page-name',
      'visual-name',
      'theme-base',
    ];
  }

  connectedCallback() {
    this.ensureInit();
    this.render();
  }

  disconnectedCallback() {
    try {
      this.service.reset(this.container);
    } catch (err) {
      log('service.reset', err);
    }
    this._embed = null;
    this._iframe = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.ensureInit();

    if (name === 'palette' || name === 'mode' || name === 'theme-base') {
      if (this._embed) {
        this.updateTheme().catch((err) => log('updateTheme', err));
        return;
      }
    }
    this.render();
  }

  ensureInit() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' }).appendChild(
        template.content.cloneNode(true)
      );
    }
    if (!this.container) {
      this.container = this.shadowRoot.querySelector('.frame');
    }
    if (!this.service) {
      this.service = new pbi.service.Service(
        pbi.factories.hpmFactory,
        pbi.factories.wpmpFactory,
        pbi.factories.routerFactory
      );
    }
  }

  get props() {
    const env = window.__PBI__ || {};
    return {
      publicSrc: this.getAttribute('public-iframe-src') || '',
      embedUrl: this.getAttribute('embed-url') || env.EMBED_URL || '',
      reportId: this.getAttribute('report-id') || env.REPORT_ID || '',
      token: this.getAttribute('token') || env.ACCESS_TOKEN || '',
      tokenType: (
        this.getAttribute('token-type') ||
        env.TOKEN_TYPE ||
        'aad'
      ).toLowerCase(),
      palette: this.getAttribute('palette') || 'Categorical01',
      mode: this.getAttribute('mode') || 'light',
      pageName: this.getAttribute('page-name') || '',
      visualName: this.getAttribute('visual-name') || '',
      themeBase: this.getAttribute('theme-base') || '',
    };
  }

  buildEmbedKey() {
    const { publicSrc, embedUrl, reportId, token, tokenType } = this.props;
    return [publicSrc, embedUrl, reportId, token, tokenType].join('|');
  }

  async render() {
    const { publicSrc, embedUrl, reportId, token, tokenType } = this.props;
    const key = this.buildEmbedKey();

    if (this._lastEmbedKey === key && this._embed && !publicSrc) {
      await this.updateTheme().catch((err) => log('updateTheme', err));
      return;
    }

    try {
      this.service.reset(this.container);
    } catch (err) {
      log('service.reset', err);
    }
    this.container.innerHTML = '';
    this._embed = null;
    this._iframe = null;
    this._lastEmbedKey = key;

    let themeJson;
    try {
      themeJson = await this.fetchTheme();
    } catch (err) {
      log('fetchTheme', err);
    }

    if (publicSrc) {
      const iframe = document.createElement('iframe');
      iframe.src = publicSrc;
      iframe.title = 'Power BI Public Report';
      iframe.loading = 'lazy';
      iframe.allowFullscreen = true;
      this.container.appendChild(iframe);
      this._iframe = iframe;
      return;
    }

    if (!embedUrl || !reportId || !token) {
      this.container.innerHTML = `<div style="padding:16px">
        <h3>Awaiting Power BI credentials</h3>
        <p>Clear <code>public-iframe-src</code> and provide <code>embed-url</code>, <code>report-id</code>, <code>token</code>.</p>
      </div>`;
      return;
    }

    const resolvedTokenType =
      tokenType === 'embed'
        ? pbi.models.TokenType.Embed
        : pbi.models.TokenType.Aad;

    const config = {
      type: 'report',
      id: reportId,
      embedUrl,
      accessToken: token,
      tokenType: resolvedTokenType,
      settings: {
        panes: { filters: { visible: false } },
        layoutType: pbi.models.LayoutType.Responsive,
        theme: themeJson ? { themeJson } : undefined,
      },
    };

    const embed = this.service.embed(this.container, config);
    this._embed = embed;

    this._embed.off?.('loaded');
    embed.on('loaded', async () => {
      if (this.props.pageName) {
        try {
          await embed.setPage(this.props.pageName);
        } catch (err) {
          log('setPage', err);
        }
      }
      if (this.props.visualName) {
        try {
          const page = await embed.getActivePage();
          const visual = await page.getVisualByName(this.props.visualName);
          await visual.focus();
        } catch (err) {
          log('focusVisual', err);
        }
      }
    });

    if (themeJson) {
      try {
        await embed.updateSettings({ theme: { themeJson } });
      } catch (err) {
        log('updateSettings(theme)', err);
      }
    }
  }

  async updateTheme() {
    if (!this._embed) return;
    const themeJson = await this.fetchTheme();
    try {
      await this._embed.updateSettings({ theme: { themeJson } });
    } catch (err) {
      log('updateSettings(theme)', err);
    }
  }

  async fetchTheme() {
    const { palette, mode, themeBase } = this.props;
    return themeBase
      ? await loadPbiTheme(palette, mode, { basePath: themeBase })
      : await loadPbiTheme(palette, mode);
  }
}

if (!customElements.get('pbi-embed')) {
  customElements.define('pbi-embed', PbiEmbed);
}
