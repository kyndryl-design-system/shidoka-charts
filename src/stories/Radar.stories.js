import { html } from 'lit';
import '../components/chart';
import argTypes, { hideUnusedControls } from '../common/config/chartArgTypes';

export default {
  title: 'Charts/Radar',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 600px;">${story()}</div> `,
  ],
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    ...argTypes,
    useHtmlLegend: hideUnusedControls,
    colorPalette: hideUnusedControls,
  },
};

const args = {
  chartTitle: 'Radar Chart',
  description: 'Chart description.',
  labels: ['Blue', 'Red', 'Orange', 'Yellow', 'Green', 'Purple'],
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
};

export const Radar = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="radar"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};
