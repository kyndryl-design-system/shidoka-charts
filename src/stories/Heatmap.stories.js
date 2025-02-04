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
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.5)',
      backgroundColor: ({ raw }) => {
        const x = raw.x;
        const y = raw.y;
        if (x === y) return 'rgba(0, 100, 0, 0.7)';
        if ((x === 1 && y === 3) || (x === 3 && y === 1))
          return 'rgba(218, 165, 32, 0.7)';
        return 'rgba(139, 0, 0, 0.7)';
      },
      width: ({ chart }) => (chart.chartArea || {}).width / 3 - 1,
      height: ({ chart }) => (chart.chartArea || {}).height / 3 - 1,
    },
  ],
  options: {
    scales: {
      x: {
        display: true,
        min: 0.5,
        max: 3.5,
        offset: false,
        ticks: {
          callback: (value) => ['', 'Stark', 'Lannister', 'Targaryen'][value],
        },
      },
      y: {
        display: true,
        min: 0.5,
        max: 3.5,
        ticks: {
          callback: (value) => ['', 'Stark', 'Lannister', 'Targaryen'][value],
        },
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
