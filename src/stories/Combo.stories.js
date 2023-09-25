import { html } from 'lit';
import '../components/chart';

export default {
  title: 'Combo',
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
  chartTitle: 'Combo Chart',
  description: 'Chart description.',
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [12, 19, 3, 5, 2, 3],
      order: 2,
    },
    {
      type: 'line',
      label: 'Dataset 2',
      data: [8, 15, 7, 9, 6, 13],
      order: 1,
    },
  ],
  options: {
    scales: {
      x: {
        title: {
          text: 'Color',
        },
      },
      y: {
        title: {
          text: 'Votes',
        },
      },
    },
  },
  hideDescription: false,
  hideCaptions: false,
};

export const Combo = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="bar"
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

export const ComboStacked = {
  args: {
    ...args,
    datasets: [
      {
        label: 'Dataset 1',
        data: [12, 19, 3, 5, 2, 3],
        stack: 'combined',
      },
      {
        type: 'line',
        label: 'Dataset 2',
        data: [8, 15, 7, 9, 6, 13],
        stack: 'combined',
      },
    ],
    options: {
      scales: {
        x: {
          title: {
            text: 'Color',
          },
        },
        y: {
          title: {
            text: 'Votes',
          },
          stacked: true,
        },
      },
    },
  },
  render: (args) => {
    return html`
      <kd-chart
        type="bar"
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

export const ComboFloating = {
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
        order: 2,
      },
      {
        type: 'line',
        label: 'Dataset 2',
        data: [8, 15, 7, 9, 6, 13],
        order: 1,
      },
    ],
    options: {
      scales: {
        x: {
          title: {
            text: 'Color',
          },
        },
        y: {
          title: {
            text: 'Votes',
          },
        },
      },
    },
  },
  render: (args) => {
    return html`
      <kd-chart
        type="bar"
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
