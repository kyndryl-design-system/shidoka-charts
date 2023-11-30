import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';

export default {
  title: 'Future/Bubble',
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
  chartTitle: 'Bubble Chart',
  description: 'Chart description.',
  labels: [],
  datasets: [
    {
      label: 'Dataset 1',
      data: [
        {
          x: 20,
          y: 30,
          r: 15,
        },
        {
          x: 30,
          y: 20,
          r: 12,
        },
        {
          x: 40,
          y: 10,
          r: 10,
        },
      ],
    },
    {
      label: 'Dataset 2',
      data: [
        {
          x: 15,
          y: 25,
          r: 10,
        },
        {
          x: 32,
          y: 10,
          r: 8,
        },
        {
          x: 38,
          y: 15,
          r: 12,
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
  colorPalette: 'categorical',
  noBorder: false,
  width: null,
  height: null,
};

export const Bubble = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="bubble"
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
