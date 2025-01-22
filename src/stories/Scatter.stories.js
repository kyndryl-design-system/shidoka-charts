import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';

export default {
  title: 'Provisional/Scatter',
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
  chartTitle: 'Scatter Chart',
  description: 'Chart description.',
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
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
  disableView: false,
  disableFullScreen: false,
  disableDownload: false,
  colorPalette: 'categorical',
  noBorder: false,
  width: null,
  height: null,
};

export const Scatter = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="scatter"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        ?disableView=${args.disableView}
        ?disableFullScreen=${args.disableFullScreen}
        ?disableDownload=${args.disableDownload}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};
