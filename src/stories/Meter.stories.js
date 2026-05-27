import { html } from 'lit';
import '../components/chart';
import argTypes, { hideUnusedControls } from '../common/config/chartArgTypes';

export default {
  title: 'Charts/Meter',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 600px;">${story()}</div> `,
  ],
  argTypes: {
    ...argTypes,
    useHtmlLegend: hideUnusedControls,
  },
};

const args = {
  chartTitle: 'Meter Chart',
  labels: ['LOW', 'MED', 'HIGH'],
  datasets: [
    {
      label: 'Segment Size',
      data: [30, 30, 30],
      // Required needleValue to show needle
      needleValue: 40,
    },
  ],
  options: {
    // x-axis title will display below needle
    scales: {
      x: {
        title: {
          text: 'RISK',
        },
      },
    },
  },
  colorPalette: 'statusDark',
};

export const Meter = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="meter"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

export const MeterCritical = {
  args: {
    ...args,
    labels: ['LOW', 'MED', 'HIGH', 'CRITICAL'],
    datasets: [
      {
        label: 'Segment Size',
        data: [30, 30, 30, 30],
        // Required needleValue to show needle
        needleValue: 100,
      },
    ],
  },
  render: (args) => {
    return html`
      <kd-chart
        type="meter"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};
