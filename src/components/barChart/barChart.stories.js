import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Bar Chart',
  component: 'kd-chart-bar',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  design: {
    type: 'figma',
    url: '',
  },
};

const args = {
  chartTitle: 'Chart Title',
  description: 'Chart description.',
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [12, 19, 3, 5, 2, 3],
    },
    {
      label: 'Dataset 2',
      data: [8, 15, 7, 9, 6, 13],
    },
  ],
  horizontal: false,
  stacked: false,
  hideDescription: false,
  hideCaptions: false,
  options: {},
};

export const BarChart = {
  args,
  render: (args) => {
    return html`
      <kd-chart-bar
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?horizontal=${args.horizontal}
        ?stacked=${args.stacked}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        .options=${args.options}
      ></kd-chart-bar>
    `;
  },
};

export const FloatingBarChart = {
  args: {
    ...args,
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          [2, 10],
          [12, 19],
          [3, 5],
          [5, 9],
          [2, 11],
          [3, 7],
        ],
      },
      {
        label: 'Dataset 2',
        data: [
          [8, 5],
          [13, 7],
          [3, -3],
          [5, 7],
          [2, 9],
          [3, -1],
        ],
      },
    ],
  },
  render: (args) => {
    return html`
      <kd-chart-bar
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?horizontal=${args.horizontal}
        ?stacked=${args.stacked}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        .options=${args.options}
      ></kd-chart-bar>
    `;
  },
};

export const ComboChart = {
  args: {
    ...args,
    datasets: [
      {
        type: 'line',
        label: 'Dataset 1',
        data: [12, 19, 3, 5, 2, 3],
      },
      {
        label: 'Dataset 2',
        data: [12, 19, 3, 5, 2, 3],
      },
    ],
  },
  render: (args) => {
    return html`
      <kd-chart-bar
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?horizontal=${args.horizontal}
        ?stacked=${args.stacked}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        .options=${args.options}
      ></kd-chart-bar>
    `;
  },
};
