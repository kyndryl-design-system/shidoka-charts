import { html } from 'lit';
import '../components/chart';
import argTypes, { hideUnusedControls } from '../common/config/chartArgTypes';
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
    useHtmlLegend: hideUnusedControls,
    colorPalette: hideUnusedControls,
  },
};

const args = {
  chartTitle: 'Tree Map',
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
};

export const Simple = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="treemap"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: 'categorical', ...args.options }}
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
        .labels=${args.labels}
        .datasets=${args.datasets}
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
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};
