import { html } from 'lit';
import { generateRandomData } from '../common/config/chartTypes/boxplot';
import argTypes from '../common/config/chartArgTypes';

import '../components/chart';

/**
 * Boxplot chart type is available through the integration of the
 * [@sgratzl/chartjs-chart-boxplot](https://www.sgratzl.com/chartjs-chart-boxplot/getting-started.html) package.
 *
 * For detailed documentation on the availble, configurable options, refer to the [plugin's documentation](https://www.sgratzl.com/chartjs-chart-boxplot/api/interfaces/IBoxAndWhiskersOptions.html).
 */

export default {
  title: 'Third Party Charts/Boxplot & Violin Plot/Boxplot',
  component: 'kd-chart',
  argTypes: {
    ...argTypes,
  },
};

const singleDataset = [
  {
    label: 'Dataset 1',
    data: [
      generateRandomData(30, 10, 100, 2),
      generateRandomData(30, 20, 80, 1),
      generateRandomData(30, 30, 120, 3),
      generateRandomData(30, 40, 90, 2),
      generateRandomData(30, 20, 70, 1),
      generateRandomData(30, 10, 60, 2),
      generateRandomData(30, 30, 80, 1),
    ],
  },
];

const doubleDataset = [
  {
    label: 'Dataset 1',
    data: [
      generateRandomData(30, 10, 100, 2),
      generateRandomData(30, 20, 80, 1),
      generateRandomData(30, 30, 120, 3),
      generateRandomData(30, 40, 90, 2),
      generateRandomData(30, 20, 70, 1),
      generateRandomData(30, 10, 60, 2),
      generateRandomData(30, 30, 80, 1),
    ],
  },
  {
    label: 'Dataset 2',
    data: [
      generateRandomData(30, 20, 120, 1),
      generateRandomData(30, 10, 100, 2),
      generateRandomData(30, 20, 90, 1),
      generateRandomData(30, 30, 110, 3),
      generateRandomData(30, 40, 80, 2),
      generateRandomData(30, 20, 90, 1),
      generateRandomData(30, 30, 70, 0),
    ],
  },
];

const quadrupleDataset = [
  {
    label: 'Dataset 1',
    data: [
      generateRandomData(30, 10, 100, 2),
      generateRandomData(30, 20, 80, 1),
      generateRandomData(30, 30, 120, 3),
      generateRandomData(30, 40, 90, 2),
      generateRandomData(30, 20, 70, 1),
      generateRandomData(30, 10, 60, 2),
      generateRandomData(30, 30, 80, 1),
    ],
  },
  {
    label: 'Dataset 2',
    data: [
      generateRandomData(30, 20, 120, 1),
      generateRandomData(30, 10, 100, 2),
      generateRandomData(30, 20, 90, 1),
      generateRandomData(30, 30, 110, 3),
      generateRandomData(30, 40, 80, 2),
      generateRandomData(30, 20, 90, 1),
      generateRandomData(30, 30, 70, 0),
    ],
  },
  {
    label: 'Dataset 3',
    data: [
      generateRandomData(30, 20, 120, 1),
      generateRandomData(30, 10, 100, 2),
      generateRandomData(30, 20, 90, 1),
      generateRandomData(30, 30, 110, 3),
      generateRandomData(30, 40, 80, 2),
      generateRandomData(30, 20, 90, 1),
      generateRandomData(30, 30, 70, 0),
    ],
  },
  {
    label: 'Dataset 4',
    data: [
      generateRandomData(30, 20, 120, 1),
      generateRandomData(30, 10, 100, 2),
      generateRandomData(30, 20, 90, 1),
      generateRandomData(30, 30, 110, 3),
      generateRandomData(30, 40, 80, 2),
      generateRandomData(30, 20, 90, 1),
      generateRandomData(30, 30, 70, 0),
    ],
  },
];

const baseArgs = {
  chartTitle: 'Boxplot Example',
  description: 'Boxplot chart with two datasets',
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: doubleDataset,
  colorPalette: 'categorical',
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
  noBorder: false,
  width: null,
  height: null,
  options: {
    scales: {
      x: {
        title: { display: true, text: 'Categories' },
      },
      y: {
        title: { display: true, text: 'Values' },
      },
    },
  },
};

export const Default = {
  args: baseArgs,
  render: (args) => {
    return html`
      <kd-chart
        type="boxplot"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{
          colorPalette: args.colorPalette,
          plugins: {
            legend: { display: true },
            tooltip: { enabled: true },
          },
          scales: args.options?.scales || {
            x: {
              title: { display: true, text: 'Categories' },
            },
            y: {
              title: { display: true, text: 'Values' },
            },
          },
        }}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const FourDatasetExample = {
  args: {
    ...baseArgs,
    datasets: quadrupleDataset,
  },
  render: (args) => {
    return html`
      <kd-chart
        type="boxplot"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{
          colorPalette: args.colorPalette,
          plugins: {
            legend: { display: true },
            tooltip: { enabled: true },
          },
          scales: args.options?.scales || {
            x: {
              title: { display: true, text: 'Categories' },
            },
            y: {
              title: { display: true, text: 'Values' },
            },
          },
        }}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const Horizontal = {
  args: {
    ...baseArgs,
    chartTitle: 'Horizontal Boxplot Example',
    description: 'Horizontal boxplot chart with two datasets',
    options: {
      scales: {
        x: {
          title: { display: true, text: 'Values' },
        },
        y: {
          title: { display: true, text: 'Categories' },
        },
      },
    },
  },
  render: (args) => {
    return html`
      <kd-chart
        type="boxplot"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{
          colorPalette: args.colorPalette,
          indexAxis: 'y',
          plugins: {
            legend: { display: true },
            tooltip: { enabled: true },
          },
          scales: args.options?.scales || {
            x: {
              title: { display: true, text: 'Values' },
            },
            y: {
              title: { display: true, text: 'Categories' },
            },
          },
        }}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const VerticalSingleDataset = {
  args: {
    ...baseArgs,
    chartTitle: 'Vertical Boxplot Single Dataset Example',
    description: 'Vertical boxplot chart with single dataset',
    colorPalette: 'sequential01',
    datasets: singleDataset,
  },
  render: (args) => {
    return html`
      <kd-chart
        type="boxplot"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{
          colorPalette: args.colorPalette,
          plugins: {
            legend: { display: true },
            tooltip: { enabled: true },
          },
          scales: args.options?.scales || {
            x: {
              title: { display: true, text: 'Categories' },
            },
            y: {
              title: { display: true, text: 'Values' },
            },
          },
        }}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const WithoutLegend = {
  args: {
    ...baseArgs,
    chartTitle: 'Boxplot Without Legend',
    description: 'Boxplot chart with legend hidden',
    colorPalette: 'rag03',
  },
  render: (args) => {
    return html`
      <kd-chart
        type="boxplot"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{
          colorPalette: args.colorPalette,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
          scales: args.options?.scales || {
            x: {
              title: { display: true, text: 'Categories' },
            },
            y: {
              title: { display: true, text: 'Values' },
            },
          },
        }}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};
