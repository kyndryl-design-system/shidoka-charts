import { html } from 'lit';
import '../components/chart';
import { generateRandomData } from '../common/config/chartTypes/violin';
import argTypes, { hideUnusedControls } from '../common/config/chartArgTypes';

/**
 * Violin plot chart type is available through the integration of the
 * [@sgratzl/chartjs-chart-boxplot](https://www.sgratzl.com/chartjs-chart-boxplot/getting-started.html) package.
 *
 * For detailed documentation on the availble, configurable options, refer to the [plugin's documentation](https://github.com/sgratzl/chartjs-chart-boxplot/blob/f9f20dad666f1ceac89bccffe38908fdfb9a9146/src/elements/Violin.ts#L12).
 *
 */

export default {
  title: 'Third Party Charts/Boxplot & Violin Plot/Violin Plot',
  component: 'kd-chart',
  argTypes: {
    ...argTypes,
    useHtmlLegend: hideUnusedControls,
    colorPalette: hideUnusedControls,
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

const baseArgs = {
  chartTitle: 'Violin Plot Chart with Two Datasets',
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: doubleDataset,

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
  render: (args) => html`
    <kd-chart
      type="violin"
      .chartTitle=${args.chartTitle}
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
    ></kd-chart>
  `,
};

export const Horizontal = {
  args: {
    ...baseArgs,
    chartTitle: 'Horizontal Violin Plot chart with Two Datasets',
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
  render: (args) => html`
    <kd-chart
      type="violin"
      .chartTitle=${args.chartTitle}
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
    ></kd-chart>
  `,
};

export const VerticalSingleDataset = {
  args: {
    ...baseArgs,
    chartTitle: 'Vertical Violin Plot with Single Dataset',
    colorPalette: 'sequential04',
    datasets: singleDataset,
  },
  render: (args) => html`
    <kd-chart
      type="violin"
      .chartTitle=${args.chartTitle}
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
    ></kd-chart>
  `,
};

export const WithoutLegend = {
  args: {
    ...baseArgs,
    chartTitle: 'Violin Plot without legend',
    colorPalette: 'categorical',
  },
  render: (args) => html`
    <kd-chart
      type="violin"
      .chartTitle=${args.chartTitle}
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
    ></kd-chart>
  `,
};
