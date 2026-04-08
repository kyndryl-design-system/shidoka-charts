import { html } from 'lit';
import '../components/chart/chart.js';
import argTypes from '../common/config/chartArgTypes';
import graphDataJson from './sampleData/miserables.json';

/**
 * Force Directed Graph chart type is available through the integration of the
 * [@sgratzl/chartjs-chart-graph
 * ](https://www.sgratzl.com/chartjs-chart-graph/examples/force.html) package.
 *
 * For detailed documentation on the available, configurable options, refer to the [plugin's documentation](https://www.sgratzl.com/chartjs-chart-graph/api/classes/ForceDirectedGraphController.html).
 */

export default {
  title: 'Third Party Charts/Graph/Force Directed Graph',
  component: 'kd-chart',
  argTypes: {
    ...argTypes,
  },
};

const args = {
  colorPalette: 'categorical',
  chartTitle: 'Force Directed Graph Chart',
  description: 'Hierarchical tree visualization using Chart.js Graph plugin.',
  labels: graphDataJson.nodes.map((d) => d.id),
  datasets: [
    {
      label: 'DataSet',
      data: graphDataJson.nodes,
      edges: graphDataJson.links,
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
      type="forceDirectedGraph"
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
