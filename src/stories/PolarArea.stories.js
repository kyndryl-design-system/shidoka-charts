import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';

export default {
  title: 'Future/Polar Area',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 600px;">${story()}</div> `,
  ],
  design: {
    type: 'figma',
    url: '',
  },
  argTypes: argTypes,
};

const args = {
  chartTitle: 'Polar Area Chart',
  description: 'Chart description.',
  labels: ['Blue', 'Red', 'Orange', 'Yellow', 'Green', 'Purple'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [12, 19, 3, 5, 2, 3],
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
  colorPalette: 'default',
  noBorder: false,
  width: null,
  height: null,
};

export const PolarArea = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="polarArea"
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
