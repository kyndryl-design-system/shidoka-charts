import { html } from 'lit';
import '../components/chart/chart.js';
import argTypes from '../common/config/chartArgTypes';
import treeDataJson from './sampleData/graphTree.json';

/**
 * Dendrogram chart type is available through the integration of the
 * [@sgratzl/chartjs-chart-graph
 * ](https://www.sgratzl.com/chartjs-chart-graph/examples/dendrogram.html) package.
 *
 * For detailed documentation on the availble, configurable options, refer to the [plugin's documentation](https://www.sgratzl.com/chartjs-chart-graph/api/classes/DendogramController.html).
 */

export default {
  title: 'Third Party Charts/Dendrogram',
  component: 'kd-chart',
  argTypes: {
    ...argTypes,
  },
};

const args = {
  colorPalette: 'categorical',
  chartTitle: 'Dendrogram Chart Horizontal Orientation',
  description: 'Hierarchical tree visualization using Chart.js Graph plugin.',
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
  noBorder: false,
  width: null,
  height: null,
  datasets: [
    {
      label: 'DataSet',
      data: treeDataJson,
    },
  ],
  options: {
    layout: { padding: 50 },
    tree: {
      orientation: 'horizontal',
    },
    plugins: {
      legend: { display: true },
    },
  },
};

export const Default = {
  args,
  render: (args) => html`
    <kd-chart
      type="tree"
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      .hideDescription=${args.hideDescription}
      .hideCaptions=${args.hideCaptions}
      .hideHeader=${args.hideHeader}
      .hideControls=${args.hideControls}
      .noBorder=${args.noBorder}
      .width=${args.width}
      .height=${args.height}
      .datasets=${args.datasets}
      .options=${{
        colorPalette: args.colorPalette,
        ...args.options,
      }}
    ></kd-chart>
  `,
};

export const Vertical = {
  args: {
    ...args,
    chartTitle: 'Dendrogram Chart Vertical Orientation',
    options: {
      ...args.options,
      tree: {
        ...args.options.tree,
        orientation: 'vertical',
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="tree"
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      .hideDescription=${args.hideDescription}
      .hideCaptions=${args.hideCaptions}
      .hideHeader=${args.hideHeader}
      .hideControls=${args.hideControls}
      .noBorder=${args.noBorder}
      .width=${args.width}
      .height=${args.height}
      .datasets=${args.datasets}
      .options=${{
        colorPalette: args.colorPalette,
        ...args.options,
      }}
    ></kd-chart>
  `,
};

export const Radial = {
  args: {
    ...args,
    chartTitle: 'Dendrogram Chart Radial Orientation',
    options: {
      ...args.options,
      tree: {
        ...args.options.tree,
        orientation: 'radial',
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="tree"
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      .hideDescription=${args.hideDescription}
      .hideCaptions=${args.hideCaptions}
      .hideHeader=${args.hideHeader}
      .hideControls=${args.hideControls}
      .noBorder=${args.noBorder}
      .width=${args.width}
      .height=${args.height}
      .datasets=${args.datasets}
      .options=${{
        colorPalette: args.colorPalette,
        ...args.options,
      }}
    ></kd-chart>
  `,
};
