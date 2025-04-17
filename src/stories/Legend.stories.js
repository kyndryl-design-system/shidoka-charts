import { html } from 'lit';
import '../components/chart';
import Chart from 'chart.js/auto';
import { htmlLegendPlugin } from '../common/plugins/htmlLegendPlugin';
import {
  renderHTMLLegend,
  renderCustomLegend,
  renderBoxedLegend,
} from '../common/legend';
import argTypes from '../common/config/chartArgTypes';
import '../common/legend/styles/legend.scss';

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
      .options=${args.options}
      .colorPalette=${args.colorPalette}
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
      .options=${args.options}
      .colorPalette=${args.colorPalette}
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
      .options=${{ plugins: { legend: { position: 'bottom' } } }}
      .colorPalette=${args.colorPalette}
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
      .options=${{ plugins: { legend: { position: 'bottom' } } }}
      .colorPalette=${args.colorPalette}
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
        }}
        .colorPalette=${args.colorPalette}
      ></kd-chart>

      <div id="external-html-legend" style="margin-top: 20px;"></div>
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
      <kd-chart
        type="${type}"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?useHtmlLegend=${args.useHtmlLegend}
        html-legend-max-height=${args.htmlLegendMaxHeight}
        .options=${args.options}
        .colorPalette=${args.colorPalette}
      ></kd-chart>
      <div
        id="${containerId}"
        style="margin-top:20px; border:1px solid lightgrey; padding:10px;"
      ></div>
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

export const CustomStyledLegend = {
  args: {
    ...basicData,
    useHtmlLegend: false,
    chartTitle: 'Chart with Custom Styled Legend',
    description: 'Using renderCustomLegend()',
  },
  render: (args) => {
    setTimeout(() => {
      const chart = document.getElementById('custom-styled-chart').chart;
      const container = document.getElementById('custom-styled-legend');
      if (chart && container) {
        renderCustomLegend(chart, container, {
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
          gap: 8px;
          justify-content: center;
        }
        #custom-styled-legend .custom-legend-item {
          display: flex;
          align-items: center;
          background: #f0f0f0;
          border-radius: 4px;
          padding: 6px 10px;
          transition: all 0.2s;
        }
        #custom-styled-legend .custom-legend-item:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
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
        }}
        .colorPalette=${args.colorPalette}
      ></kd-chart>
      <div id="custom-styled-legend" style="margin-top:20px;"></div>
    `;
  },
};
