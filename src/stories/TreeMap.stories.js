import { html } from 'lit';
import '../components/chart';
// import { transparentColorScale } from '../common/helpers/helpers';
import statsByState from './sampleData/treemap.json';

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
      tree: [15, 6, 6, 5, 4, 3, 2, 2],
      // backgroundColor: (ctx) =>
      //   transparentColorScale(ctx, 'blue'),
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
        key: 'area',
        groups: ['division'],
        labels: {
          align: 'left',
          display: true,
          formatter(ctx) {
            if (ctx.type !== 'data') {
              return;
            }
            return [ctx.raw._data.division];
          },
          color: 'white',
          font: { size: 12 },
          position: 'top',
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

export const Captions = {
  args: {
    ...args,
    datasets: [
      {
        label: 'Dataset 1',
        tree: statsByState,
        key: 'area',
        groups: ['region', 'division', 'state'],
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
          font: { size: 12 },
          position: 'top',
        },
        captions: {
          align: 'center',
          display: true,
          color: 'white',
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
