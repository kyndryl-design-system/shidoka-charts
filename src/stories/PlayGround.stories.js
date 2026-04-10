import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';

export default {
  title: 'Playground/Chart',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  argTypes: {
    ...argTypes,
    type: {
      control: { type: 'text' },
    },
  },
};

const defaultArgs = {
  type: 'bar',
  chartTitle: 'Chart',
  description: 'Chart description.',
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
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
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
  colorPalette: 'categorical',
  noBorder: false,
  width: null,
  height: null,
  hideTableControl: false,
  hideFullscreenControl: false,
  hideDownloadControl: false,
  customLabels: {},
  useHtmlLegend: false,
  htmlLegendMaxHeight: null,
  htmlLegendOptions: {},
};

export const Chart = {
  args: defaultArgs,
  render: (args) => {
    return html`
      <kd-chart
        .type=${args.type}
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
        ?hideTableControl=${args.hideTableControl}
        ?hideFullscreenControl=${args.hideFullscreenControl}
        ?hideDownloadControl=${args.hideDownloadControl}
        .customLabels=${args.customLabels}
        ?useHtmlLegend=${args.useHtmlLegend}
        .htmlLegendMaxHeight=${args.htmlLegendMaxHeight}
        .htmlLegendOptions=${args.htmlLegendOptions}
      ></kd-chart>
    `;
  },
};
