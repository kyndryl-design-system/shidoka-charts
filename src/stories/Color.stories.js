import { html } from 'lit';
import '../components/chart';
//import argTypes from '../common/config/chartArgTypes';
import colorPalettes from '../common/config/colorPalettes';

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
        ${colorPalettes.categorical.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const SingleSea = {
  args,
  render: (args) => {
    return html`
      singlesea
      <div class="colors">
        ${colorPalettes.singlesea.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const SeaGray = {
  args,
  render: (args) => {
    return html`
      seagray
      <div class="colors">
        ${colorPalettes.seagray.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
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
        ${colorPalettes.sequential01.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
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
        ${colorPalettes.sequential02.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
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
        ${colorPalettes.sequential03.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
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
        ${colorPalettes.sequential04.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
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
        ${colorPalettes.sequential05.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
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
        ${colorPalettes.divergent01.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
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
        ${colorPalettes.divergent02.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const Default = {
  args,
  render: (args) => {
    return html`
      default
      <div class="colors">
        ${colorPalettes.default.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const RainForest = {
  args,
  render: (args) => {
    return html`
      rainforest
      <div class="colors">
        ${colorPalettes.rainforest.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const GentleTouch = {
  args,
  render: (args) => {
    return html`
      gentletouch
      <div class="colors">
        ${colorPalettes.gentletouch.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const SavannahSunrise = {
  args,
  render: (args) => {
    return html`
      savannahsunrise
      <div class="colors">
        ${colorPalettes.savannahsunrise.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const CrystalCavern = {
  args,
  render: (args) => {
    return html`
      crystalcavern
      <div class="colors">
        ${colorPalettes.crystalcavern.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const Magenta = {
  args,
  render: (args) => {
    return html`
      magenta
      <div class="colors">
        ${colorPalettes.magenta.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const MagentaNight = {
  args,
  render: (args) => {
    return html`
      magentanight
      <div class="colors">
        ${colorPalettes.magentanight.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const BrazilianSunrise = {
  args,
  render: (args) => {
    return html`
      braziliansunrise
      <div class="colors">
        ${colorPalettes.braziliansunrise.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const TequilaSunrise = {
  args,
  render: (args) => {
    return html`
      tequilasunrise
      <div class="colors">
        ${colorPalettes.tequilasunrise.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const EveningHorizon = {
  args,
  render: (args) => {
    return html`
      eveninghorizon
      <div class="colors">
        ${colorPalettes.eveninghorizon.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const Energizing = {
  args,
  render: (args) => {
    return html`
      energizing
      <div class="colors">
        ${colorPalettes.energizing.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const CherryBlossom = {
  args,
  render: (args) => {
    return html`
      cherryblossom
      <div class="colors">
        ${colorPalettes.cherryblossom.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};

export const SpringGreen = {
  args,
  render: (args) => {
    return html`
      springgreen
      <div class="colors">
        ${colorPalettes.springgreen.map((color) => {
          return html`<span style="background-color: ${color}"></span>`;
        })}
      </div>
    `;
  },
};
