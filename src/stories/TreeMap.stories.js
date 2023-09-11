import { html } from 'lit';
import '../components/chart';
import statsByState from './sampleData/treemapStates.json';
import nestedTree from './sampleData/treemapNested.json';

export default {
  title: 'Tree Map',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  design: {
    type: 'figma',
    url: '',
  },
};

const args = {
  chartTitle: 'Tree Map',
  description: 'Chart description.',
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: 'Dataset 1',
      tree: statsByState,
      key: 'population',
      labels: {
        align: 'left',
        display: true,
        formatter(ctx) {
          if (ctx.type !== 'data') {
            return;
          }
          return [ctx.raw._data.state];
        },
        color: 'white',
        hoverColor: 'white',
        font: { size: 12 },
        position: 'top',
        overflow: 'hidden',
      },
    },
  ],
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
  },
  hideDescription: false,
  hideCaptions: false,
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
        .options=${args.options}
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
          align: 'left',
          display: true,
          formatter(ctx) {
            if (ctx.type !== 'data') {
              return;
            }
            return [ctx.raw._data.state];
          },
          color: 'white',
          hoverColor: 'white',
          font: { size: 12 },
          position: 'top',
          overflow: 'hidden',
        },
        captions: {
          align: 'center',
          display: true,
          color: 'white',
          hoverColor: 'white',
          font: {
            size: 14,
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
        .options=${args.options}
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
          align: 'left',
          display: true,
          formatter(ctx) {
            if (ctx.type !== 'data') {
              return;
            }
            return [ctx.raw._data.name || ctx.raw._data.label];
          },
          color: 'white',
          hoverColor: 'white',
          font: { size: 12 },
          position: 'top',
          overflow: 'hidden',
        },
        captions: {
          align: 'center',
          display: true,
          color: 'white',
          hoverColor: 'white',
          font: {
            size: 14,
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
        .options=${args.options}
      ></kd-chart>
    `;
  },
};
