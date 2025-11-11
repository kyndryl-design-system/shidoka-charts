import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import treeDataJson from './sampleData/graphTree.json';

/**
 * Tree chart type is available through the integration of the
 * [@sgratzl/chartjs-chart-graph
 * ](https://www.sgratzl.com/chartjs-chart-graph/examples/tree.html) package.
 *
 * For detailed documentation on the availble, configurable options, refer to the [plugin's documentation](https://www.sgratzl.com/chartjs-chart-graph/api/classes/TreeChart.html).
 */

export default {
  title: 'Third Party Charts/Tree',
  component: 'kd-chart',
  argTypes: {
    ...argTypes,
  },
};

const args = {
  colorPalette: 'categorical',
  chartTitle: 'Tree Chart Horizontal Orientation',
  description: 'Hierarchical tree structure using chartjs-chart-graph.',
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
      edgeLineBorderWidth: (ctx) => {
        return ctx.dataIndex;
      },
    },
  ],
  options: {
    layout: { padding: 20 },
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

export const RadialWithLabels = {
  args: { ...args, chartTitle: 'Tree Chart Radial Orientation with Labels' },
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
        ...args.options,
        tree: { ...args.options.tree, orientation: 'radial' },
        plugins: {
          ...args.options.plugins,
          legend: { display: false },
          datalabels: {
            display: () => {
              return true;
            },
            align: (context) => {
              const index = context.dataIndex;
              const value = context.dataset.data[index];
              return (-value.angle / Math.PI) * 180;
            },
            rotation: (context) => {
              const index = context.dataIndex;
              const value = context.dataset.data[index];
              return (-value.angle / Math.PI) * 180;
            },
            backgroundColor: 'white',
            color: 'black',
            formatter: (v) => {
              return v.name;
            },
          },
        },
      }}
    ></kd-chart>
  `,
};
