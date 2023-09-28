import { html } from 'lit';
import '../components/chart';

export default {
  title: 'Future/Scatter',
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
  chartTitle: 'Scatter Chart',
  description: 'Chart description.',
  labels: [],
  datasets: [
    {
      label: 'Dataset 1',
      data: [
        {
          x: 20,
          y: 30,
        },
        {
          x: 30,
          y: 20,
        },
        {
          x: 40,
          y: 10,
        },
      ],
    },
    {
      label: 'Dataset 2',
      data: [
        {
          x: 15,
          y: 25,
        },
        {
          x: 32,
          y: 10,
        },
        {
          x: 38,
          y: 15,
        },
      ],
    },
  ],
  options: {
    scales: {
      x: {
        title: {
          text: 'X Axis',
        },
      },
      y: {
        title: {
          text: 'Y Axis',
        },
      },
    },
  },
  hideDescription: false,
  hideCaptions: false,
};

export const Scatter = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="scatter"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?noBorder=${args.noBorder}
        .options=${args.options}
      ></kd-chart>
    `;
  },
};
