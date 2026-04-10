import { html } from 'lit';
import '../components/chart';
import argTypes, { hideUnusedControls } from '../common/config/chartArgTypes';

export default {
  title: 'Charts/Meter',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 600px;">${story()}</div> `,
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/uwR7B1xbaRXA5spwPvzzFO/Florence-Release?node-id=2051%3A93&mode=dev',
    },
  },
  argTypes: {
    ...argTypes,
    useHtmlLegend: hideUnusedControls,
    colorPalette: hideUnusedControls,
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
        .options=${{ colorPalette: 'statusDark', ...args.options }}
      ></kd-chart>
    `;
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=64%3A4703&mode=dev',
    },
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
        .options=${{ colorPalette: 'statusDark', ...args.options }}
      ></kd-chart>
    `;
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=64%3A4703&mode=dev',
    },
  },
};
