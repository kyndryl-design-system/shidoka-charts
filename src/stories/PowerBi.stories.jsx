import '../components/powerbi/pbi-embed.js';
import React from 'react';
import {
  Title,
  Description,
  Primary,
  Stories,
} from '@storybook/addon-docs/blocks';
import downloadIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/download.svg';
import PowerBiDescription from './PowerBiDescription.mdx';

const HIDDEN_PROPS = [
  'title',
  'downloadUrl',
  'publicIframeBase',
  'publicIframeMap',
  'palettes',
  'modes',
  'exampleTypes',
];
const hiddenArgTypes = Object.fromEntries(
  HIDDEN_PROPS.map((k) => [k, { table: { disable: true }, control: false }])
);

export default {
  title: 'Power BI/Shidoka Power BI Themes',
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      page: () => (
        <>
          <Title />
          <PowerBiDescription />
          <Primary />
          <Stories includePrimary={false} />
        </>
      ),
      source: { code: '' },
    },
  },
  argTypes: {
    ...hiddenArgTypes,
  },
  args: {
    title: 'Power BI/Themes (Docs)',
    downloadUrl: '/pbi-themes/Shidoka-Themes.zip',

    publicIframeBase: '',
    publicIframeMap: {
      Categorical01:
        'https://app.powerbi.com/reportEmbed?reportId=6b3df929-5031-476b-882b-e7af47d6c26c&autoAuth=true&ctid=f260df36-bc43-424c-8f44-c85226657b01',
    },

    palettes: [
      'Categorical01',
      'Sequential01',
      'Sequential02',
      'Sequential03',
      'Sequential04',
      'Sequential05',
      'Divergent01',
      'Divergent02',
      'RAG03',
      'RAG08',
    ],
    modes: ['light', 'dark'],
    exampleTypes: ['Donut'],
  },
};

export const DownloadZIP = () => `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 12px; text-align: center;">
    <style>
      .download-btn{border:1px solid transparent;background-color:#29707a;color:#fff;cursor:pointer;font-size:16px;padding:8px 16px;border-radius:4px;margin-top:16px;display:inline-flex;align-items:center;gap:8px;text-decoration:none;transition:background-color .2s ease}
      .download-btn:hover{background-color:#3797a4}
      .download-btn svg{width:16px;height:16px;display:inline-block}
    </style>
    <h2 style="margin:0 0 8px 0;font-size:18px;">Shidoka Power BI Themes</h2>
    <p style="margin:0 0 12px 0;color:#6d6d6d;">
      See the documentation above for installation and usage. Download the ZIP directly:<br/>
      <a href="/pbi-themes/Shidoka-Themes.zip" download class="download-btn">
        ${downloadIcon}
        <span>Shidoka-Themes.zip</span>
      </a>
    </p>
  </div>
`;
DownloadZIP.parameters = { docs: { source: { code: '' } } };

function isPublicPbiUrl(url) {
  return /^https:\/\/app\.powerbi\.com\/view\?r=/i.test(String(url || ''));
}

function buildIframeSrc(args, palette, mode, exampleType, idx) {
  try {
    const key = `${palette}-${mode}-${exampleType}`;
    const map = args?.publicIframeMap || {};
    const candidate = map[key] || map[`${palette}-${mode}`] || map[palette];

    if (candidate) return candidate;

    if (args?.publicIframeBase) {
      const base = String(args.publicIframeBase).replace(/\/$/, '');
      const q = `?palette=${encodeURIComponent(
        palette
      )}&mode=${encodeURIComponent(mode)}&type=${encodeURIComponent(
        exampleType
      )}&idx=${encodeURIComponent(String(idx))}`;
      return `${base}${q}`;
    }

    const file = `${palette}-${mode}-${exampleType}-${idx}.html`.toLowerCase();
    return `/pbi-themes/previews/${encodeURIComponent(file)}`;
  } catch {
    return '';
  }
}

// export const Examples = (args) => {
//   const container = document.createElement('div');
//   container.style.maxWidth = '980px';
//   container.style.fontFamily =
//     "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";

//   const warn = (msg) => {
//     const w = document.createElement('div');
//     w.style.background = '#fff7ed';
//     w.style.border = '1px solid #fdba74';
//     w.style.color = '#9a3412';
//     w.style.padding = '8px 12px';
//     w.style.borderRadius = '6px';
//     w.style.margin = '0 0 12px 0';
//     w.textContent = msg;
//     return w;
//   };

//   const grid = document.createElement('div');
//   grid.style.display = 'grid';
//   grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
//   grid.style.gap = '16px';

//   args.palettes.forEach((palette) => {
//     args.modes.forEach((mode) => {
//       const card = document.createElement('div');
//       card.style.border = '1px solid #e6e6e6';
//       card.style.borderRadius = '8px';
//       card.style.overflow = 'hidden';
//       card.style.background = '#fff';
//       card.style.boxShadow = '0 1px 0 rgba(16,24,40,0.02)';

//       const header = document.createElement('div');
//       header.style.padding = '12px';
//       header.style.display = 'flex';
//       header.style.alignItems = 'center';
//       header.style.justifyContent = 'space-between';
//       header.style.borderBottom = '1px solid #f1f5f9';

//       const title = document.createElement('div');
//       title.innerHTML = `<strong style="font-size:.95rem;">${palette} — ${mode}</strong><div style="font-size:12px;color:#6b7280;">Preview</div>`;
//       header.appendChild(title);
//       card.appendChild(header);

//       const body = document.createElement('div');
//       body.style.display = 'grid';
//       body.style.gridTemplateColumns = '1fr';
//       body.style.gap = '8px';
//       body.style.padding = '12px';

//       args.exampleTypes.forEach((exampleType, idx) => {
//         const src = buildIframeSrc(args, palette, mode, exampleType, idx);

//         const ex = document.createElement('div');
//         ex.style.border = '1px solid #f3f4f6';
//         ex.style.borderRadius = '6px';
//         ex.style.overflow = 'hidden';
//         ex.style.height = '220px';
//         ex.style.display = 'flex';
//         ex.style.flexDirection = 'column';

//         const meta = document.createElement('div');
//         meta.style.padding = '8px';
//         meta.style.fontSize = '12px';
//         meta.style.color = '#374151';
//         meta.style.background = '#fff';
//         meta.textContent = exampleType;
//         ex.appendChild(meta);

//         const wrap = document.createElement('div');
//         wrap.style.flex = '1 1 auto';

//         if (src && isPublicPbiUrl(src)) {
//           const iframe = document.createElement('iframe');
//           iframe.src = src;
//           iframe.style.width = '100%';
//           iframe.style.height = '100%';
//           iframe.style.border = '0';
//           iframe.title = `${palette} ${mode} ${exampleType}`;
//           iframe.loading = 'lazy';
//           iframe.allowFullscreen = true;
//           wrap.appendChild(iframe);
//         } else {
//           wrap.appendChild(
//             warn('No public Publish-to-web URL configured for this preview.')
//           );
//         }

//         ex.appendChild(wrap);
//         body.appendChild(ex);
//       });

//       card.appendChild(body);
//       grid.appendChild(card);
//     });
//   });

//   container.appendChild(grid);
//   return container;
// };

// Examples.storyName = 'Static public previews';
// Examples.parameters = {
//   controls: { disable: true },
//   docs: { source: { code: '' } },
// };
