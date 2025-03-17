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
      url: '',
    },
  },
  argTypes: argTypes,
};

// Get unique months and letters in the correct order
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

// Create a clean matrix data structure
const matrixData = [];
// Create a map for quick lookup
const dataMap = new Map();

// First, create a lookup table for each letter/month combination
heatmapData.forEach((item) => {
  const key = `${item.letter}-${item.month}`;
  dataMap.set(key, item.value);
});

// Then create one data point per cell in the expected order
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
  description: 'Monthly value distribution across different letters',
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
};

export const Heatmap = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="matrix"
        style="min-height: 500px;"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{
          colorPalette: args.colorPalette,
          colorScale: {
            min: 0,
            max: 100,
            neutral: 50,
            colors: ['#d3686d', '#e8e8e8', '#5285c5'],
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              grid: {
                display: false,
              },
            },
          },
        }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};
