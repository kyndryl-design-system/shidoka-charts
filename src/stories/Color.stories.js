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
      <h3>Categorical</h3>
      <br />
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
      <h3>Sequential01</h3>
      <br />
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
      <h3>Sequential02</h3>
      <br />
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
      <h3>Sequential03</h3>
      <br />
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
      <h3>Sequential04</h3>
      <br />
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
      <h3>Sequential05</h3>
      <br />
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
      <h3>Divergent01</h3>
      <br />
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
      <h3>Divergent02</h3>
      <br />
      <div class="colors">
        ${getColorPalette('divergent02').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};

export const StatusLight = {
  args,
  render: (args) => {
    return html`
      <h3>StatusLight</h3>
      <br />
      <div class="colors">
        ${getColorPalette('statusLight').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};

export const StatusDark = {
  args,
  render: (args) => {
    return html`
      <h3>StatusDark</h3>
      <br />
      <div class="colors">
        ${getColorPalette('statusDark').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};

export const RAG03 = {
  args,
  tags: ['deprecated', 'version:v2.6.0'],
  render: (args) => {
    return html`
      <h3>RAG03</h3>
      <br />
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
  tags: ['deprecated', 'version:v2.6.0'],
  render: (args) => {
    return html`
      <h3>RAG08</h3>
      <br />
      <div class="colors">
        ${getColorPalette('rag08').map((color) => {
          return html`<span style="background-color: var(${color})"></span>`;
        })}
      </div>
    `;
  },
};
