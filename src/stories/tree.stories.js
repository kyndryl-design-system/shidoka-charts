import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import treeDataJson from './sampleData/graphTree.json';

/**
 * Tree chart type is available through the integration of the
 * [@sgratzl/chartjs-chart-graph
 * ](https://www.sgratzl.com/chartjs-chart-graph/examples/tree.html) package.
 *
 * For detailed documentation on the available, configurable options, refer to the [plugin's documentation](https://www.sgratzl.com/chartjs-chart-graph/api/classes/TreeController.html).
 */

export default {
  title: 'Third Party Charts/Graph/Tree',
  component: 'kd-chart',
  argTypes: {
    ...argTypes,
  },
};

const args = {
  colorPalette: 'categorical',
  chartTitle: 'Tree Chart Horizontal Orientation',
  description: 'Hierarchical tree structure using chartjs-chart-graph.',
  labels: treeDataJson.map((d) => d.name),
  datasets: [
    {
      label: 'DataSet',
      data: treeDataJson.map((d) => Object.assign({}, d)),
    },
  ],
  options: {},
};

export const Default = {
  args,
  render: (args) => html`
    <kd-chart
      type="tree"
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{
        ...args.options,
        colorPalette: args.colorPalette,
      }}
    ></kd-chart>
  `,
};

export const Vertical = {
  args: {
    ...args,
    chartTitle: 'Tree Chart Vertical Orientation',
    options: {
      ...args.options,
      tree: {
        orientation: 'vertical',
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="tree"
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{
        ...args.options,
        colorPalette: args.colorPalette,
      }}
    ></kd-chart>
  `,
};

export const Radial = {
  args: {
    ...args,
    chartTitle: 'Tree Chart Radial Orientation',
    options: {
      ...args.options,
      tree: {
        orientation: 'radial',
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="tree"
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{
        ...args.options,
        colorPalette: args.colorPalette,
      }}
    ></kd-chart>
  `,
};

export const Directed = {
  args: {
    ...args,
    chartTitle: 'Directed Tree Chart',
    datasets: [
      {
        label: 'DataSet',
        data: treeDataJson,
        directed: true,
      },
    ],
    options: {
      edgeLineBorderWidth: 1,
    },
  },
  render: (args) => html`
    <kd-chart
      type="tree"
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{
        ...args.options,
        colorPalette: args.colorPalette,
      }}
    ></kd-chart>
  `,
};

/**
 * Tree chart type is available through the integration of the
 * [@sgratzl/chartjs-chart-graph
 * ](https://www.sgratzl.com/chartjs-chart-graph/examples/label.html) package.
 *
 * For detailed documentation on the availble, configurable options, refer to the [plugin's documentation](https://www.sgratzl.com/chartjs-chart-graph/api/classes/TreeChart.html).
 */

export const WithLabels = {
  args: {
    ...args,
    chartTitle: 'Tree Chart Radial Orientation with Labels',
    options: {
      tree: { orientation: 'radial', edgeLineBorderWidth: 2 },
      plugins: {
        datalabels: {
          display: true,
        },
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="tree"
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{
        ...args.options,
        edgeLineBorderWidth: 1,
        colorPalette: args.colorPalette,
      }}
    ></kd-chart>
  `,
};
