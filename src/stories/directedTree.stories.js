import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import treeDataJson from './sampleData/graphTree.json';

/**
 * Directed Tree chart type is available through the integration of the
 * [@sgratzl/chartjs-chart-graph
 * ](https://www.sgratzl.com/chartjs-chart-graph/examples/directed.html) package.
 *
 * For detailed documentation on the availble, configurable options, refer to the [plugin's documentation](https://www.sgratzl.com/chartjs-chart-graph/api/classes/TreeChart.html).
 */

export default {
  title: 'Third Party Charts/DirectedTree',
  component: 'kd-chart',
  argTypes: {
    ...argTypes,
  },
};

const args = {
  colorPalette: 'categorical',
  chartTitle: 'Directed Tree Chart Horizontal Orientation',
  description:
    'Hierarchical directed tree structure using chartjs-chart-graph.',
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
      directed: true,
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
      .options=${{ colorPalette: args.colorPalette, ...args.options }}
    ></kd-chart>
  `,
};

export const Vertical = {
  args: { ...args, chartTitle: 'Directed Tree Chart Vertical Orientation' },
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
        tree: { ...args.options.tree, orientation: 'vertical' },
      }}
    ></kd-chart>
  `,
};

export const Radial = {
  args: { ...args, chartTitle: 'Directed Tree Chart Radial Orientation' },
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
        tree: { ...args.options.tree, orientation: 'radial' },
      }}
    ></kd-chart>
  `,
};
