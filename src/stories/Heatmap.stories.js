import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import heatmapData from './sampleData/heatmap.json';

export default {
  title: 'Charts/Heatmap',
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
    gradientLegendDisplay: {
      control: { type: 'boolean' },
    },
    gradientLegendTitle: {
      control: { type: 'text' },
    },
    gradientLegendShowPercentage: {
      control: { type: 'boolean' },
    },
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
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const matrixData = [];
const dataMap = new Map();

heatmapData.forEach((item) => {
  const key = `${item.letter}-${item.month}`;
  dataMap.set(key, item.value);
});

for (let y = 1; y <= months.length; y++) {
  for (let x = 1; x <= letters.length; x++) {
    const month = months[y - 1];
    const letter = letters[x - 1];
    const key = `${letter}-${month}`;
    const value = dataMap.get(key) || 0;

    matrixData.push({
      x,
      y,
      value,
    });
  }
}

const args = {
  chartTitle: 'Cost Change by Asset Type and Month',
  description: 'Monthly cost fluctuations across different asset types',
  labels: {
    y: months,
    x: letters,
  },
  datasets: [
    {
      label: 'Value Matrix',
      data: matrixData,
      metadata: matrixData.map((item) => {
        const month = months[item.y - 1];
        const letter = letters[item.x - 1];
        return {
          x: item.x,
          y: item.y,
          Value: item.value,
          Letter: letter,
          Month: month,
        };
      }),
    },
  ],
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
  colorPalette: 'categorical',
  noBorder: false,
  width: null,
  height: null,
  gradientLegendDisplay: true,
  gradientLegendTitle: 'Legend Title',
  gradientLegendShowPercentage: true,
};

export const Heatmap = {
  args,
  render: (args) => {
    const options = {
      colorPalette: args.colorPalette,
      colorScale: {
        min: 0,
        max: 100,
        neutral: 50,
      },
      plugins: {
        gradientLegend: {
          display: args.gradientLegendDisplay,
          title: args.gradientLegendTitle,
          showPercentage: args.gradientLegendShowPercentage,
        },
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
