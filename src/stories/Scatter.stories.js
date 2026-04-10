import { html } from 'lit';
import '../components/chart';
import argTypes, { hideUnusedControls } from '../common/config/chartArgTypes';

export default {
  title: 'Charts/Scatter',
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
  argTypes: {
    ...argTypes,
    useHtmlLegend: hideUnusedControls,
  },
};

const args = {
  chartTitle: 'Scatter Chart',
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
  colorPalette: 'categorical',
};

export const Scatter = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="scatter"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};
