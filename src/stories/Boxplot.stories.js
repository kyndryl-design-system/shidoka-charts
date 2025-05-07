import { html } from 'lit';
import '../components/chart';
import { generateRandomData } from '../common/config/chartTypes/boxplot';
import argTypes from '../common/config/chartArgTypes';

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
  },
};

const args = {
  chartTitle: 'Boxplot Example',
  description: 'Boxplot chart with two datasets',
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
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
  ],
  chartOrientation: 'vertical',
  colorPalette: 'categorical',
  showLegend: false,
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
          scales: {
            x: {
              title: {
                display: true,
                text: 'Categories',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Values',
              },
            },
          },
          plugins: {
            legend: {
              display: args.showLegend,
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
    ...args,
    chartTitle: 'Horizontal Box Plot Example',
    description: 'Horizontal box plot chart with two datasets',
    chartOrientation: 'horizontal',
  },
  render: Default.render,
};
