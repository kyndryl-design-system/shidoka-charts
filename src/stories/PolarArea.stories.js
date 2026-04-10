import { html } from 'lit';
import '../components/chart';
import argTypes, { hideUnusedControls } from '../common/config/chartArgTypes';

export default {
  title: 'Charts/Polar Area',
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
  chartTitle: 'Polar Area Chart',
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
};

export const PolarArea = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="polarArea"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};
