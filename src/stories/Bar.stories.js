import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import { getRandomData } from '../common/helpers/helpers';

export default {
  title: 'Charts/Bar',
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
  chartTitle: 'Bar Chart',
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
  colorPalette: 'categorical',
  noBorder: false,
  width: null,
  height: null,
};

export const Vertical = {
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
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const Horizontal = {
  args: {
    ...args,
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          title: {
            text: 'Votes',
          },
        },
        y: {
          title: {
            text: 'Color',
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
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const Stacked = {
  args: {
    ...args,
    options: {
      scales: {
        x: {
          title: {
            text: 'Color',
          },
          stacked: true,
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
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const HorizontalStacked = {
  args: {
    ...args,
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          title: {
            text: 'Votes',
          },
          stacked: true,
        },
        y: {
          title: {
            text: 'Color',
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
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const Floating = {
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
      <kd-chart
        type="bar"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const SingleLabel = {
  args: {
    ...args,
    labels: ['Color'],
    datasets: [
      {
        label: 'Red',
        data: [12],
      },
      {
        label: 'Blue',
        data: [8],
      },
      {
        label: 'Yellow',
        data: [15],
      },
      {
        label: 'Green',
        data: [7],
      },
      {
        label: 'Purple',
        data: [9],
      },
      {
        label: 'Orange',
        data: [13],
      },
    ],
    options: {
      scales: {
        x: {
          title: {
            display: false,
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
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};
