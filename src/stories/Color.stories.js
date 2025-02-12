import { html } from 'lit';
import '../components/chart';
import { getColorPalette } from '../common/config/colorPalettes';

export default {
  title: 'Guidelines/Color Palettes',
  decorators: [
    (story) => html`
      <style>
        .colors {
          display: flex;
          flex-grow: 1;
        }

        .colors span {
          height: 50px;
          flex-grow: 1;
        }
      </style>
      ${story()}
    `,
  ],
};

const args = {
  colorPalette: 'default',
};

export const Categorical = {
  args,
  render: (args) => {
    return html`
      categorical
      <div class="colors">
        ${getColorPalette('categorical').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};

export const Sequential01 = {
  args,
  render: (args) => {
    return html`
      sequential01
      <div class="colors">
        ${getColorPalette('sequential01').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};

export const Sequential02 = {
  args,
  render: (args) => {
    return html`
      sequential02
      <div class="colors">
        ${getColorPalette('sequential02').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};

export const Sequential03 = {
  args,
  render: (args) => {
    return html`
      sequential03
      <div class="colors">
        ${getColorPalette('sequential03').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};

export const Sequential04 = {
  args,
  render: (args) => {
    return html`
      sequential04
      <div class="colors">
        ${getColorPalette('sequential04').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};

export const Sequential05 = {
  args,
  render: (args) => {
    return html`
      sequential05
      <div class="colors">
        ${getColorPalette('sequential05').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};

export const Divergent01 = {
  args,
  render: (args) => {
    return html`
      divergent01
      <div class="colors">
        ${getColorPalette('divergent01').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};

export const Divergent02 = {
  args,
  render: (args) => {
    return html`
      divergent02
      <div class="colors">
        ${getColorPalette('divergent02').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};

export const RAG03 = {
  args,
  render: (args) => {
    return html`
      rag03
      <div class="colors">
        ${getColorPalette('rag03').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};

export const RAG08 = {
  args,
  render: (args) => {
    return html`
      rag08
      <div class="colors">
        ${getColorPalette('rag08').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};
