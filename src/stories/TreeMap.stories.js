import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import statsByState from './sampleData/treemapStates.json';
import nestedTree from './sampleData/treemapNested.json';

export default {
  title: 'Proof of Concept/Tree Map',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  design: {
    type: 'figma',
    url: '',
  },
  argTypes: argTypes,
};

const args = {
  chartTitle: 'Tree Map',
  description: 'Chart description.',
  datasets: [
    {
      label: 'Dataset 1',
      tree: statsByState,
      key: 'population',
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
  hideDescription: false,
  hideCaptions: false,
  colorPalette: 'default',
};

export const TreeMap = {
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
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

export const Grouped = {
  args: {
    ...args,
    datasets: [
      {
        label: 'Dataset 1',
        tree: statsByState,
        key: 'population',
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
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

export const NestedData = {
  args: {
    ...args,
    datasets: [
      {
        label: 'Dataset 1',
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
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};
