import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';

/**
 * Sankey chart type is available through the integration of the
 * [chartjs-chart-sankey](https://github.com/kurkle/chartjs-chart-sankey) package.
 * For detailed documentation on the availble, configurable options, refer to the [plugin's documentation](https://github.com/kurkle/chartjs-chart-sankey/blob/main/README.md).
 */

export default {
  title: 'Third Party Charts/Sankey',
  component: 'kd-chart',
  decorators: [
    (story) => html`<div style="max-width: 800px;">${story()}</div>`,
  ],
  argTypes,
  parameters: { design: { type: 'figma', url: '' } },
};

const args = {
  chartTitle: 'Sankey Chart',
  description: 'Sankey chart showing flows between nodes.',
  data: {
    datasets: [
      {
        label: 'Flow',
        data: [
          { from: 'a', to: 'b', flow: 10 },
          { from: 'a', to: 'c', flow: 5 },
          { from: 'b', to: 'c', flow: 10 },
          { from: 'd', to: 'c', flow: 7 },
        ],
        colorMode: 'gradient',
        alpha: 1,
        labels: { a: 'Label A', b: 'Label B', c: 'Label C', d: 'Label D' },
        priority: { b: 1, d: 0 },
        column: { d: 1 },
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
  render: (a) => {
    const datasetsSource =
      (a.datasets && a.datasets.length && a.datasets) || a.data?.datasets;

    const datasets = (datasetsSource || []).map((ds) => ({ ...ds }));

    const nodeLabels = (() => {
      if (!datasets?.[0]?.data?.length) return [];
      const ds = datasets[0];
      const nodes = [];
      ds.data.forEach((link) => {
        if (!link) return;
        const from = link.from ?? link.source;
        const to = link.to ?? link.target;
        if (from !== undefined && !nodes.includes(from)) nodes.push(from);
        if (to !== undefined && !nodes.includes(to)) nodes.push(to);
      });
      return nodes.map((n) => (ds.labels?.[n] ? ds.labels[n] : String(n)));
    })();

    return html`
      <kd-chart
        type="sankey"
        .chartTitle=${a.chartTitle}
        .description=${a.description}
        .labels=${nodeLabels}
        .datasets=${datasets}
        ?hideDescription=${a.hideDescription}
        ?hideCaptions=${a.hideCaptions}
        ?hideHeader=${a.hideHeader}
        ?hideControls=${a.hideControls}
        ?noBorder=${a.noBorder}
        .options=${{
          colorPalette: a.colorPalette,
          ...a.options,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
            ...(a.options?.plugins || {}),
          },
          sankey: {
            tableHeaders: {
              source: 'Source',
              target: 'Target',
              value: 'Weight',
            },
          },
        }}
        .width=${a.width}
        .height=${a.height}
      ></kd-chart>
    `;
  },
};
