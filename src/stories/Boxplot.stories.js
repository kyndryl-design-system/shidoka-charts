import { html } from 'lit';
import { generateRandomData } from '../common/config/chartTypes/boxplot';
import argTypes from '../common/config/chartArgTypes';

import '../components/chart';

export default {
  title: 'Third Party Charts/Boxplot & Violin Plot/Boxplot',
  component: 'kd-chart',
  argTypes: {
    ...argTypes,
    chartOrientation: {
      options: ['vertical', 'horizontal'],
      control: { type: 'select' },
      defaultValue: 'vertical',
    },
    showLegend: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
    showTooltip: {
      control: { type: 'boolean' },
      defaultValue: true,
    },
    xAxisTitle: {
      control: { type: 'text' },
      defaultValue: 'Categories',
    },
    yAxisTitle: {
      control: { type: 'text' },
      defaultValue: 'Values',
    },
    xAxisMin: {
      control: { type: 'number' },
    },
    xAxisMax: {
      control: { type: 'number' },
    },
    yAxisMin: {
      control: { type: 'number' },
    },
    yAxisMax: {
      control: { type: 'number' },
    },
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

const args = {
  chartTitle: 'Boxplot Example',
  description: 'Boxplot chart with two datasets',
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: doubleDataset,
  chartOrientation: 'vertical',
  colorPalette: 'categorical',
  showLegend: false,
  showTooltip: true,
  xAxisTitle: 'Categories',
  yAxisTitle: 'Values',
  xAxisMin: null,
  xAxisMax: null,
  yAxisMin: null,
  yAxisMax: null,
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
  noBorder: false,
  width: null,
  height: null,
};

export const Default = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="boxplot"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{
          indexAxis: args.chartOrientation === 'horizontal' ? 'y' : 'x',
          colorPalette: args.colorPalette,
          showLegend: args.showLegend,
          showTooltip: args.showTooltip,
          xAxisTitle: args.xAxisTitle,
          yAxisTitle: args.yAxisTitle,
          xAxisMin: args.xAxisMin,
          xAxisMax: args.xAxisMax,
          yAxisMin: args.yAxisMin,
          yAxisMax: args.yAxisMax,
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
    ...args,
    chartTitle: 'Horizontal Boxplot Example',
    description: 'Horizontal boxplot chart with two datasets',
    chartOrientation: 'horizontal',
  },
  render: Default.render,
};

export const VerticalSingleDataset = {
  args: {
    ...args,
    chartTitle: 'Vertical Boxplot Single Dataset Example',
    description: 'Vertical boxplot chart with single dataset',
    chartOrientation: 'vertical',
    colorPalette: 'sequential01',
    datasets: singleDataset,
  },
  render: Default.render,
};

export const VerticalWithLegend = {
  args: {
    ...args,
    chartTitle: 'Vertical Boxplot with Legend',
    description: 'Vertical boxplot chart with two datasets',
    showLegend: true,
    colorPalette: 'rag03',
  },
  render: Default.render,
};
