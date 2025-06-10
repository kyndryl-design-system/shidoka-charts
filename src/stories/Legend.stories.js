import { html } from 'lit';
import Chart from 'chart.js/auto';
import { htmlLegendPlugin } from '../common/plugins/htmlLegendPlugin';
import { renderHTMLLegend } from '../common/legend';
import argTypes from '../common/config/chartArgTypes';
import '../components/chart';
import { action } from 'storybook/actions';

Chart.register(htmlLegendPlugin);

export default {
  title: 'Guidelines/Legend',
  id: 'guidelines-legend',
  component: 'kd-chart',
  decorators: [
    (story) => html`<div style="max-width: 800px;">${story()}</div>`,
  ],
  argTypes: {
    useHtmlLegend: { control: { type: 'boolean' } },
    htmlLegendMaxHeight: { control: { type: 'number' } },
    ...argTypes,
  },
};

const basicData = {
  chartTitle: 'Bar Chart',
  description: 'Chart description.',
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    { label: 'Dataset 1', data: [12, 19, 3, 5, 2, 3] },
    { label: 'Dataset 2', data: [8, 15, 7, 9, 6, 13] },
    { label: 'Dataset 3', data: [5, 12, 8, 3, 9, 7] },
  ],
  options: {
    scales: {
      x: { title: { text: 'Color' } },
      y: { title: { text: 'Votes' } },
    },
    plugins: { legend: { position: 'bottom' } },
  },
  colorPalette: 'categorical',
};

const manyLabels = [
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Purple',
  'Orange',
  'Pink',
  'Brown',
  'Gray',
  'Black',
  'Cyan',
  'Magenta',
  'Lime',
  'Indigo',
  'Teal',
  'Lavender',
  'Maroon',
  'Navy',
  'Olive',
  'Coral',
  'Gold',
  'Silver',
  'Turquoise',
  'Violet',
  'Beige',
  'Khaki',
  'Salmon',
  'Plum',
  'Orchid',
  'Crimson',
  'Sienna',
  'Azure',
  'Mint',
  'Ivory',
  'Tan',
  'Indigo',
  'Teal',
  'Lavender',
  'Maroon',
  'Navy',
  'Olive',
  'Coral',
  'Gold',
  'Silver',
  'Turquoise',
  'Violet',
  'Beige',
  'Khaki',
  'Salmon',
  'Plum',
  'Orchid',
  'Crimson',
  'Sienna',
  'Azure',
  'Mint',
  'Ivory',
  'Tan',
  'Indigo',
  'Teal',
  'Lavender',
  'Maroon',
  'Navy',
  'Olive',
  'Coral',
  'Gold',
  'Silver',
  'Turquoise',
  'Violet',
  'Beige',
  'Khaki',
  'Salmon',
  'Plum',
  'Orchid',
  'Crimson',
  'Sienna',
  'Azure',
  'Mint',
  'Ivory',
  'Tan',
];
const randomData = (n) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 100));

export const CanvasLegend = {
  args: {
    ...basicData,
    chartTitle: 'Chart with Canvas Legend',
    description: 'Using the built-in Canvas legend (useHtmlLegend="false")',
  },
  render: (args) => html`
    <kd-chart
      type="bar"
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      .labels=${args.labels}
      .datasets=${args.datasets}
      ?useHtmlLegend=${args.useHtmlLegend}
      html-legend-max-height=${args.htmlLegendMaxHeight}
      .options=${{ colorPalette: args.colorPalette, ...args.options }}
    ></kd-chart>
  `,
};

export const BuiltInHTMLLegend = {
  args: {
    ...basicData,
    useHtmlLegend: true,
    chartTitle: 'Chart with HTML Legend',
    description: 'Using the built-in HTML legend',
  },
  render: (args) => html`
    <kd-chart
      type="bar"
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      .labels=${args.labels}
      .datasets=${args.datasets}
      ?useHtmlLegend=${args.useHtmlLegend}
      html-legend-max-height=${args.htmlLegendMaxHeight}
      .options=${{ colorPalette: args.colorPalette, ...args.options }}
    ></kd-chart>
  `,
};

export const InternalPieOverflow = {
  args: {
    ...basicData,
    useHtmlLegend: true,
    htmlLegendMaxHeight: 150,
    chartTitle: 'Pie Chart with Internal HTML Legend Overflow',
    labels: manyLabels.slice(0, 50),
    datasets: [{ data: randomData(50) }],
  },
  render: (args) => html`
    <kd-chart
      type="pie"
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      .labels=${args.labels}
      .datasets=${args.datasets}
      ?useHtmlLegend=${args.useHtmlLegend}
      html-legend-max-height=${args.htmlLegendMaxHeight}
      .options=${{
        plugins: { legend: { position: 'bottom' } },
        colorPalette: args.colorPalette,
      }}
    ></kd-chart>
  `,
};

export const InternalDoughnutOverflow = {
  args: {
    ...basicData,
    useHtmlLegend: true,
    htmlLegendMaxHeight: 150,
    chartTitle: 'Doughnut Chart with Internal HTML Legend Overflow',
    labels: manyLabels.slice(0, 50),
    datasets: [{ data: randomData(50) }],
  },
  render: (args) => html`
    <kd-chart
      type="doughnut"
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      .labels=${args.labels}
      .datasets=${args.datasets}
      ?useHtmlLegend=${args.useHtmlLegend}
      html-legend-max-height=${args.htmlLegendMaxHeight}
      .options=${{
        plugins: { legend: { position: 'bottom' } },
        colorPalette: args.colorPalette,
      }}
    ></kd-chart>
  `,
};

export const ExternalHTMLLegend = {
  args: {
    ...basicData,
    useHtmlLegend: false,
    chartTitle: 'Chart with External HTML Legend',
    description: 'Using htmlLegendPlugin for full customization',
  },
  render: (args) => {
    const pluginOpts = {
      containerId: 'external-html-legend',
      maxHeight: 100,
      boxWidth: 16,
      boxHeight: 16,
      borderRadius: 2,
      className: 'shidoka-legend',
      itemClassName: 'shidoka-legend-item',
      layout: 'horizontal',
    };
    return html`
      <style>
        #external-html-legend {
          margin-top: 20px;
        }
      </style>
      <kd-chart
        type="bar"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?useHtmlLegend=${args.useHtmlLegend}
        html-legend-max-height=${args.htmlLegendMaxHeight}
        .options=${{
          ...args.options,
          plugins: { legend: { display: false }, htmlLegend: pluginOpts },
          colorPalette: args.colorPalette,
        }}
      ></kd-chart>

      <div id="external-html-legend"></div>
    `;
  },
};

const makeExternalLegendStory = (type, sliceCount, containerId) => {
  const pluginOpts = {
    containerId,
    maxHeight: 100,
    boxWidth: 12,
    boxHeight: 12,
    borderRadius: 2,
    className: 'shidoka-legend',
    itemClassName: 'shidoka-legend-item',
    layout: 'horizontal',
  };
  return {
    args: {
      ...basicData,
      chartTitle: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } Chart with Many Items`,
      labels: manyLabels.slice(0, sliceCount),
      datasets: [{ data: randomData(sliceCount) }],
      useHtmlLegend: false,
      description: `External HTML ${type} legend (${sliceCount} items)`,
      options: {
        plugins: { legend: { display: false }, htmlLegend: pluginOpts },
      },
    },
    render: (args) => html`
      <style>
        #external-pie-legend,
        #external-doughnut-legend {
          border: 1px solid var(--kd-color-border-variants-light);
        }
      </style>
      <kd-chart
        type="${type}"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?useHtmlLegend=${args.useHtmlLegend}
        html-legend-max-height=${args.htmlLegendMaxHeight}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
      <div id="${containerId}" style="margin-top:20px; padding:10px;"></div>
    `,
  };
};

export const ExternalPieOverflow = makeExternalLegendStory(
  'pie',
  50,
  'external-pie-legend'
);
export const ExternalDoughnutOverflow = makeExternalLegendStory(
  'doughnut',
  50,
  'external-doughnut-legend'
);

export const LegendWithClickHandler = {
  args: {
    ...basicData,
    useHtmlLegend: false,
    chartTitle: 'Chart with Clickable Legend Items',
    description:
      'Using onItemClick callback with Storybook actions to capture legend interactions',
  },
  render: (args) => {
    setTimeout(() => {
      const chart = document.getElementById('clickable-legend-chart').chart;
      const container = document.getElementById('clickable-legend-container');

      if (chart && container) {
        renderHTMLLegend(chart, container, {
          maxHeight: 120,
          boxWidth: 16,
          boxHeight: 16,
          borderRadius: 2,
          onItemClick: (info) => {
            const actionData = {
              label: info.label,
              isHidden: info.isHidden,
            };

            if (info.datasetIndex !== undefined) {
              actionData.datasetIndex = info.datasetIndex;
            }

            if (info.dataIndex !== undefined) {
              actionData.dataIndex = info.dataIndex;
            }

            action('on-click')(actionData);
          },
        });
      }
    }, 100);

    return html`
      <style>
        #clickable-legend-container {
          margin-top: 20px;
          padding: 10px;
          border: 1px solid var(--kd-color-border-variants-light);
          border-radius: 4px;
        }
      </style>
      <kd-chart
        id="clickable-legend-chart"
        type="bar"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?useHtmlLegend=${args.useHtmlLegend}
        .options=${{
          ...args.options,
          plugins: { legend: { display: false } },
          colorPalette: args.colorPalette,
        }}
      ></kd-chart>
      <div
        id="clickable-legend-container"
        @on-click=${(e) => action('on-click')(e.detail)}
      ></div>
    `;
  },
};

export const CustomStyledLegend = {
  args: {
    ...basicData,
    useHtmlLegend: false,
    chartTitle: 'Chart with Custom Styled Legend',
    description: 'Using renderCustomLegend()',
  },
  render: (args) => {
    setTimeout(() => {
      const chart = document.getElementById('custom-styled-chart')?.chart;
      const container = document.getElementById('custom-styled-legend');
      if (chart && container) {
        renderHTMLLegend(chart, container, {
          maxHeight: 100,
          boxWidth: 16,
          boxHeight: 16,
          className: 'custom-legend',
          itemClassName: 'custom-legend-item',
        });
      }
    }, 100);
    return html`
      <style>
        #custom-styled-legend .custom-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          justify-content: center;
          padding-top: 4px;
          padding-bottom: 4px;
        }

        #custom-styled-legend .custom-legend-items {
          padding-top: 4px;
        }

        #custom-styled-legend .custom-legend-item {
          display: flex;
          align-items: center;
          background: var(--kd-color-background-accent-subtle);
          border: none;
          border-radius: 4px;
          padding: 6px 10px;
          transition: opacity 0.2s ease, transform 0.2s ease;
          will-change: transform;
          position: relative;
        }

        #custom-styled-legend .custom-legend-item:hover {
          transform: translateY(-2px);
          background: var(--kd-color-background-ui-hollow-hover);
        }

        #custom-styled-legend .custom-legend-item:focus-visible {
          outline-color: var(--kd-color-border-variants-focus);
        }

        #custom-styled-legend .custom-legend-item.hidden {
          opacity: 0.5;
          text-decoration: line-through;
        }
      </style>
      <kd-chart
        id="custom-styled-chart"
        type="bar"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?useHtmlLegend=${args.useHtmlLegend}
        .options=${{
          ...args.options,
          plugins: { ...args.options.plugins, legend: { display: false } },
          colorPalette: args.colorPalette,
        }}
      ></kd-chart>
      <div id="custom-styled-legend" style="margin-top:20px;"></div>
    `;
  },
};

export const InlineGrid = {
  name: 'Inline side‑by‑side (Canvas vs. HTML Legends)',
  render: () => html`
    <style>
      .chart-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
      }
      .chart-grid kd-chart {
        /* this drives the total height of each chart */
        --kd-chart-height: 360px;
        /* this caps the HTML legend height */
        --kd-html-legend-max-height: 80px;
        height: 100%; /* make the host fill the grid cell */
      }
    </style>

    <div class="chart-grid">
      <!-- Canvas legend version -->
      <kd-chart
        type="bar"
        .chartTitle=${'Canvas Legend'}
        .labels=${basicData.labels}
        .datasets=${basicData.datasets}
        .options=${{
          colorPalette: basicData.colorPalette,
          ...basicData.options,
        }}
        ?useHtmlLegend=${false}
      ></kd-chart>

      <!-- HTML legend version -->
      <kd-chart
        type="bar"
        .chartTitle=${'HTML Legend'}
        .labels=${basicData.labels}
        .datasets=${basicData.datasets}
        .options=${{
          colorPalette: basicData.colorPalette,
          ...basicData.options,
        }}
        ?useHtmlLegend=${true}
      ></kd-chart>
    </div>
  `,
};
