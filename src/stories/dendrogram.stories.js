import { html } from 'lit';
import '../components/chart/chart.js';
import argTypes from '../common/config/chartArgTypes';
import treeDataJson from './sampleData/graphTree.json';

/**
 * Dendrogram chart type is available through the integration of the
 * [@sgratzl/chartjs-chart-graph
 * ](https://www.sgratzl.com/chartjs-chart-graph/examples/dendrogram.html) package.
 *
 * For detailed documentation on the available, configurable options, refer to the [plugin's documentation](https://www.sgratzl.com/chartjs-chart-graph/api/classes/DendogramController.html).
 */

export default {
  title: 'Third Party Charts/Graph/Dendrogram',
  component: 'kd-chart',
  argTypes: {
    ...argTypes,
  },
};

const args = {
  colorPalette: 'categorical',
  chartTitle: 'Dendrogram Chart',
  description: 'Hierarchical tree visualization using Chart.js Graph plugin.',
  labels: treeDataJson.map((d) => d.name),
  datasets: [
    {
      label: 'DataSet',
      data: treeDataJson.map((d) => Object.assign({}, d)),
    },
  ],
  options: {},
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
  noBorder: false,
  width: null,
  height: null,
  hideTableControl: false,
  hideFullscreenControl: false,
  hideDownloadControl: false,
};

export const Default = {
  args,
  render: (args) => html`
    <kd-chart
      type="dendrogram"
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{
        colorPalette: args.colorPalette,
        ...args.options,
      }}
      ?hideDescription=${args.hideDescription}
      ?hideCaptions=${args.hideCaptions}
      ?hideHeader=${args.hideHeader}
      ?hideControls=${args.hideControls}
      ?noBorder=${args.noBorder}
      .width=${args.width}
      .height=${args.height}
      ?hideTableControl=${args.hideTableControl}
      ?hideFullscreenControl=${args.hideFullscreenControl}
      ?hideDownloadControl=${args.hideDownloadControl}
    ></kd-chart>
  `,
};
