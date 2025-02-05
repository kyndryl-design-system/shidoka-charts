import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';

export default {
  title: 'Charts/Heatmap',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: argTypes,
};

const args = {
  chartTitle: 'Example Heatmap / Matrix Chart',
  description: 'Shidoka Charts example chart type matrix',

  labels: ['Stark', 'Lannister', 'Targaryen'],
  datasets: [
    {
      label: 'Alliance Matrix',
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
      ],
      relationships: {
        allies: [
          [1, 1],
          [2, 2],
          [3, 3],
        ],
        friends: [
          [1, 3],
          [3, 1],
        ],
        enemies: [
          [1, 2],
          [2, 1],
          [2, 3],
          [3, 2],
        ],
      },
    },
  ],
  options: {
    scales: {
      x: {
        display: true,
        min: 0.5,
        max: 3.5,
        offset: false,
      },
      y: {
        display: true,
        min: 0.5,
        max: 3.5,
      },
    },
  },
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
  colorPalette: 'categorical',
  noBorder: false,
  width: null,
  height: null,
};

export const Heatmap = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="matrix"
        style="min-height: 400px;"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};
