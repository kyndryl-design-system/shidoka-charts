import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import { getComputedColorPalette } from '../common/config/colorPalettes';

/**
 * Sankey chart type is available through the integration of the
 * [chartjs-chart-sankey](https://github.com/kurkle/chartjs-chart-sankey) package.
 * For detailed documentation on the availble, configurable options, refer to the [plugin's documentation](https://github.com/kurkle/chartjs-chart-sankey/blob/main/README.md).
 */

export default {
  title: 'Third Party Charts/Sankey',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  argTypes: {
    ...argTypes,
    parameters: {
      design: {
        type: 'figma',
        url: '',
      },
    },
  },
};

const args = {
  chartTitle: 'Sankey Chart',
  description: 'Sankey chart showing flows between nodes.',
  data: {
    datasets: [
      {
        label: 'Values',
        data: [
          { from: 'a', to: 'b', flow: 10 },
          { from: 'a', to: 'c', flow: 5 },
          { from: 'b', to: 'c', flow: 10 },
          { from: 'd', to: 'c', flow: 7 },
        ],
        colorMode: 'gradient',
        alpha: 1,
        labels: {
          a: 'Label A',
          b: 'Label B',
          c: 'Label C',
          d: 'Label D',
        },
        priority: {
          b: 1,
          d: 0,
        },
        column: {
          d: 1,
        },
        size: 'max',
      },
    ],
  },
  options: {},
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
  colorPalette: 'default',
  noBorder: false,
  width: null,
  height: null,
};

export const Sankey = {
  args,
  render: (args) => {
    const paletteKey =
      args.colorPalette === 'default' ? 'categorical' : args.colorPalette;
    const palette = getComputedColorPalette(paletteKey);
    const datasetsSource =
      (args.datasets && args.datasets.length && args.datasets) ||
      (args.data && args.data.datasets);
    const datasets = (datasetsSource || []).map((ds) => ({
      ...ds,
      _colorPalette: palette,
    }));

    const nodeLabels =
      datasets && datasets[0] && Array.isArray(datasets[0].data)
        ? (() => {
            const nodes = [];
            const ds = datasets[0];
            ds.data.forEach((link) => {
              if (!link) return;
              if (link.from !== undefined && !nodes.includes(link.from))
                nodes.push(link.from);
              if (link.to !== undefined && !nodes.includes(link.to))
                nodes.push(link.to);
            });
            return nodes.map((n) =>
              ds.labels && ds.labels[n] ? ds.labels[n] : String(n)
            );
          })()
        : [];

    return html`
      <kd-chart
        type="sankey"
        .labels=${nodeLabels}
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .datasets=${datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{
          colorPalette: args.colorPalette,
          ...args.options,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
        }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};
