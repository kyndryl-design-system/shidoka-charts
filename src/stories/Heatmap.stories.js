import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import heatmapData from './sampleData/heatmap';
import divergentHeatmapData from './sampleData/divergentHeatmapData';

export default {
  title: 'Third Party Charts/Heatmap',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/rC5XdRnXVbDmu3vPN8tJ4q/2.1-Edinburgh?node-id=4001-45669&p=f&m=dev',
    },
  },
  argTypes: {
    ...argTypes,
    legendLabels: { control: 'object', defaultValue: undefined },
  },
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const assetTypes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const createMatrixData = (data) => {
  const matrixData = [];
  const dataMap = new Map();
  data.forEach((item) => {
    const key = `${item.assetType}-${item.month}`;
    dataMap.set(key, item.value);
  });
  for (let y = 1; y <= months.length; y++) {
    for (let x = 1; x <= assetTypes.length; x++) {
      const month = months[y - 1];
      const assetType = assetTypes[x - 1];
      const key = `${assetType}-${month}`;
      const value = dataMap.get(key) || 0;
      matrixData.push({ x, y, value });
    }
  }
  return matrixData;
};

const defaultMatrixData = createMatrixData(heatmapData);
const divergentMatrixData = createMatrixData(divergentHeatmapData);

const commonArgs = {
  chartTitle: 'Cost Change by Asset Type and Month',
  description: 'Monthly cost fluctuations across different asset types',
  labels: { y: months, x: assetTypes },
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
  colorPalette: 'sequential02',
  noBorder: false,
  width: null,
  height: null,
};

const defaultDataset = {
  label: 'Value Matrix',
  data: defaultMatrixData,
  metadata: defaultMatrixData.map((item) => {
    const month = months[item.y - 1];
    const assetType = assetTypes[item.x - 1];
    return {
      x: item.x,
      y: item.y,
      Value: item.value,
      AssetType: assetType,
      Month: month,
    };
  }),
};

const divergentDataset = {
  label: 'Divergent Value Matrix',
  data: divergentMatrixData,
  metadata: divergentMatrixData.map((item) => {
    const month = months[item.y - 1];
    const assetType = assetTypes[item.x - 1];
    return {
      x: item.x,
      y: item.y,
      Value: item.value,
      AssetType: assetType,
      Month: month,
    };
  }),
};

export const Default = {
  args: {
    ...commonArgs,
    datasets: [defaultDataset],
    legendLabels: [0, 50, 100],
  },
  render: (args) => {
    const options = {
      colorPalette: args.colorPalette,
      colorScale: {
        min: args.legendLabels ? args.legendLabels[0] : 0,
        neutral: args.legendLabels ? args.legendLabels[1] : 50,
        max: args.legendLabels ? args.legendLabels[2] : 100,
      },
      plugins: {
        gradientLegend: {
          display: true,
          title: 'Legend Title',
          legendLabels: args.legendLabels,
          paletteKey: args.colorPalette,
        },
      },
      scales: {
        x: { title: { text: 'Asset Type' } },
        y: { title: { text: 'Month' } },
      },
    };
    return html`
      <kd-chart
        type="matrix"
        style="min-height: 500px;"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${options}
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

export const Divergent = {
  args: {
    ...commonArgs,
    colorPalette: 'divergent01',
    datasets: [divergentDataset],
    legendLabels: [-100, 0, 100],
  },
  render: (args) => {
    const options = {
      colorPalette: args.colorPalette,
      colorScale: {
        min: args.legendLabels ? args.legendLabels[0] : -100,
        neutral: args.legendLabels ? args.legendLabels[1] : 0,
        max: args.legendLabels ? args.legendLabels[2] : 100,
      },
      plugins: {
        gradientLegend: {
          display: true,
          title: 'Legend Title',
          legendLabels: args.legendLabels,
          paletteKey: args.colorPalette,
        },
      },
      scales: {
        x: { title: { text: 'Asset Type' } },
        y: { title: { text: 'Month' } },
      },
    };
    return html`
      <kd-chart
        type="matrix"
        style="min-height: 500px;"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${options}
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

export const HideLegend = {
  args: {
    ...commonArgs,
    datasets: [defaultDataset],
    legendLabels: [0, 50, 100],
  },
  render: (args) => {
    const options = {
      colorPalette: args.colorPalette,
      colorScale: {
        min: args.legendLabels ? args.legendLabels[0] : 0,
        neutral: args.legendLabels ? args.legendLabels[1] : 50,
        max: args.legendLabels ? args.legendLabels[2] : 100,
      },
      plugins: {
        gradientLegend: {
          display: false,
          title: '',
          legendLabels: args.legendLabels,
          paletteKey: args.colorPalette,
        },
      },
      scales: {
        x: { title: { text: 'Asset Type' } },
        y: { title: { text: 'Month' } },
      },
    };
    return html`
      <kd-chart
        type="matrix"
        style="min-height: 500px;"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${options}
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
