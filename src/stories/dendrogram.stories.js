import { html } from 'lit';
import '../components/chart/chart.js';
import argTypes from '../common/config/chartArgTypes';

/**
 * Dendrogram chart type is available through the integration of the
 * [@sgratzl/chartjs-chart-dendrogram
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
  chartTitle: 'Dendrogram Chart',
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
      label: 'Dataset',
      tree: {
        id: 'dataset',
        name: 'DataSet',
        children: [
          {
            id: 'dataSet1',
            name: 'DataSet 1',
            children: [
              { id: 'granddataset1', name: 'Grand DataSet 1' },
              { id: 'granddataset2', name: 'Grand DataSet 2' },
            ],
          },
          {
            id: 'dataSet2',
            name: 'DataSet 2',
            children: [
              {
                id: 'granddataset3',
                name: 'Grand DataSet 3',
                children: [
                  { id: 'great1', name: 'Great Grand DataSet 1' },
                  { id: 'great2', name: 'Great Grand DataSet 2' },
                ],
              },
            ],
          },
        ],
      },
      tension: 0.3, // Add slight curve to connecting lines (0 = straight, 1 = maximum curve)
    },
  ],
  options: {
    layout: { padding: 50 },
    tree: {
      orientation: 'horizontal',
      mode: 'dendrogram',
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
      type="dendrogram"
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
      type="dendrogram"
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
      .options=${args.options}
    ></kd-chart>
  `,
};

export const Radial = {
  args: {
    ...args,
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
      type="dendrogram"
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
      .options=${args.options}
    ></kd-chart>
  `,
};
