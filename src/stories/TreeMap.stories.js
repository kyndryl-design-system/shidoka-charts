import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import statsByState from './sampleData/treemapStates.json';
import nestedTree from './sampleData/treemapNested.json';

export default {
  title: 'Third Party Charts/Tree Map',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=1652%3A7571&mode=dev',
    },
  },
  argTypes: {
    ...argTypes,
    colorScaling: {
      control: 'boolean',
      table: {
        category: 'Options',
      },
    },
  },
};

const args = {
  chartTitle: 'Tree Map',
  description: 'Chart description.',
  datasets: [
    {
      label: 'Population',
      tree: statsByState,
      key: 'population',
      labelKey: 'state',
      labels: {
        formatter(ctx) {
          if (ctx.type !== 'data') {
            return;
          }
          return [ctx.raw._data.state];
        },
      },
    },
  ],
  options: {
    scales: {
      x: {
        title: {
          text: 'State',
        },
      },
    },
  },
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
  colorPalette: 'categorical',
  colorScaling: false,
  noBorder: false,
  width: null,
  height: null,
};

export const Simple = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="treemap"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{
          ...args.options,
          colorPalette: args.colorPalette,
          colorScaling: args.colorScaling,
        }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const Grouped = {
  args: {
    ...args,
    datasets: [
      {
        label: 'Population',
        tree: statsByState,
        key: 'population',
        labelKey: 'state',
        groups: ['region', 'state'],
        labels: {
          formatter(ctx) {
            if (ctx.type !== 'data') {
              return;
            }
            return [ctx.raw._data.state];
          },
        },
      },
    ],
  },
  render: (args) => {
    return html`
      <kd-chart
        type="treemap"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{
          ...args.options,
          colorPalette: args.colorPalette,
          colorScaling: args.colorScaling,
        }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const NestedData = {
  args: {
    ...args,
    datasets: [
      {
        label: 'Value',
        tree: nestedTree,
        treeLeafKey: 'name',
        key: 'value',
        groups: [0, 1, 'name'],
        labels: {
          formatter(ctx) {
            if (ctx.type !== 'data') {
              return;
            }
            return [ctx.raw._data.name || ctx.raw._data.label];
          },
        },
      },
    ],
    options: {
      scales: {
        x: {
          title: {
            text: 'Category',
          },
        },
      },
    },
  },
  render: (args) => {
    return html`
      <kd-chart
        type="treemap"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{
          ...args.options,
          colorPalette: args.colorPalette,
          colorScaling: args.colorScaling,
        }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

const manyCategoriesTree = [
  { category: 'Category 01', value: 10 },
  { category: 'Category 02', value: 20 },
  { category: 'Category 03', value: 30 },
  { category: 'Category 04', value: 40 },
  { category: 'Category 05', value: 50 },
  { category: 'Category 06', value: 60 },
  { category: 'Category 07', value: 70 },
  { category: 'Category 08', value: 80 },
  { category: 'Category 09', value: 90 },
  { category: 'Category 10', value: 100 },
  { category: 'Category 11', value: 110 },
  { category: 'Category 12', value: 120 },
  { category: 'Category 13', value: 130 },
  { category: 'Category 14', value: 140 },
  { category: 'Category 15', value: 150 },
  { category: 'Category 16', value: 160 },
  { category: 'Category 17', value: 170 },
  { category: 'Category 18', value: 180 },
  { category: 'Category 19', value: 190 },
  { category: 'Category 20', value: 200 },
];

export const ManyCategories = {
  args: {
    ...args,
    chartTitle: 'Tree Map – Many Categories (colorScaling)',
    description:
      'Tree map with 20 categories, using colorScaling to map values across the palette.',
    datasets: [
      {
        label: 'Many Categories',
        tree: manyCategoriesTree,
        key: 'value',
        labelKey: 'category',
        labels: {
          formatter(ctx) {
            if (ctx.type !== 'data') {
              return;
            }
            return [ctx.raw._data.category];
          },
        },
      },
    ],
    options: {
      scales: {
        x: {
          title: {
            text: 'Category',
          },
        },
      },
    },
    colorScaling: true,
  },
  render: (args) => {
    return html`
      <kd-chart
        type="treemap"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{
          ...args.options,
          colorPalette: args.colorPalette,
          colorScaling: args.colorScaling,
        }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};
