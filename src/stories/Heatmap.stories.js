import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import { createMatrixData } from '../common/config/chartTypes/matrix';
import heatmapData from './sampleData/heatmap';
import divergentHeatmapData from './sampleData/divergent-heatmap';
import dualValueHeatmapData from './sampleData/dual-value-heatmap';

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

const defaultMatrixData = createMatrixData(heatmapData, {
  xAxis: assetTypes,
  yAxis: months,
  xKey: 'assetType',
  yKey: 'month',
  valueKey: 'value',
});

const divergentMatrixData = createMatrixData(divergentHeatmapData, {
  xAxis: assetTypes,
  yAxis: months,
  xKey: 'assetType',
  yKey: 'month',
  valueKey: 'value',
});

const dualValueMatrixData = createMatrixData(dualValueHeatmapData, {
  xAxis: assetTypes,
  yAxis: months,
  xKey: 'assetType',
  yKey: 'month',
  valueKey: 'value',
  secondaryValueKey: 'secondaryValue',
});

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

const dualValueDataset = {
  label: 'Dual Value Matrix',
  data: dualValueMatrixData,
  metadata: dualValueMatrixData.map((item) => {
    const month = months[item.y - 1];
    const assetType = assetTypes[item.x - 1];
    return {
      x: item.x,
      y: item.y,
      Value: item.value,
      SecondaryValue: item.secondaryValue,
      AssetType: assetType,
      Month: month,
    };
  }),
};

export const Default = {
  args: {
    ...commonArgs,
    datasets: [defaultDataset],
  },
  render: (args) => {
    const datasets = args.colorPalette.toLowerCase().includes('divergent')
      ? [divergentDataset]
      : [defaultDataset];

    const options = {
      colorPalette: args.colorPalette,
      plugins: {
        gradientLegend: {
          display: true,
          title: 'Legend Title',
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
        .datasets=${datasets}
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
  },
  render: (args) => {
    const datasets = args.colorPalette.toLowerCase().includes('divergent')
      ? [divergentDataset]
      : [defaultDataset];

    const options = {
      colorPalette: args.colorPalette,
      plugins: {
        gradientLegend: {
          display: true,
          title: 'Legend Title',
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
        .datasets=${datasets}
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
  },
  render: (args) => {
    const options = {
      colorPalette: 'sequential04',
      plugins: {
        gradientLegend: {
          display: false,
          title: '',
          paletteKey: '',
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

export const DualValue = {
  args: {
    ...commonArgs,
    chartTitle: 'Heatmap with Dual Values',
    description: 'Showing primary values with secondary values in tooltips',
    datasets: [dualValueDataset],
    colorPalette: 'sequential02',
  },
  render: (args) => {
    const options = {
      colorPalette: 'sequential02',
      plugins: {
        gradientLegend: {
          display: true,
          title: 'Primary Value',
          paletteKey: 'sequential02',
        },
        secondaryValueLabels: {
          display: false,
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
