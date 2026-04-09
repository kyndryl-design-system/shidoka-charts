import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';

const hideUnusedControls = { table: { disable: true } };

export default {
  title: 'Charts/Bubble',
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
    colorPalette: hideUnusedControls,
    hideDescription: hideUnusedControls,
    hideCaptions: hideUnusedControls,
    hideHeader: hideUnusedControls,
    hideControls: hideUnusedControls,
    noBorder: hideUnusedControls,
    width: hideUnusedControls,
    height: hideUnusedControls,
    hideTableControl: hideUnusedControls,
    hideFullscreenControl: hideUnusedControls,
    hideDownloadControl: hideUnusedControls,
    customLabels: hideUnusedControls,
    htmlLegendMaxHeight: hideUnusedControls,
    htmlLegendMaxWidth: hideUnusedControls,
    htmlLegendOptions: hideUnusedControls,
  },
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
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};
