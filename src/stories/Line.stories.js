import { html } from 'lit';
import '../components/chart';
import argTypes, { hideUnusedControls } from '../common/config/chartArgTypes';
import { getComputedColorPalette } from '../common/config/colorPalettes';

export default {
  title: 'Charts/Line',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  argTypes: {
    ...argTypes,
    useHtmlLegend: hideUnusedControls,
  },
};

const args = {
  chartTitle: 'Line Chart',
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [12, 19, 3, 5, 2, 3],
    },
    {
      label: 'Dataset 2',
      data: [8, 15, 7, 9, 6, 13],
    },
  ],
  options: {
    scales: {
      x: {
        title: {
          text: 'Color',
        },
      },
      y: {
        title: {
          text: 'Votes',
        },
      },
    },
  },
  colorPalette: 'categorical',
};

export const Line = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="line"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

export const WithoutPoints = {
  args: {
    ...args,
    options: {
      pointStyle: false,
      scales: {
        x: {
          title: {
            text: 'Color',
          },
        },
        y: {
          title: {
            text: 'Votes',
          },
        },
      },
    },
  },
  render: (args) => {
    return html`
      <kd-chart
        type="line"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

export const Curved = {
  args: {
    ...args,
    options: {
      cubicInterpolationMode: 'monotone',
      scales: {
        x: {
          title: {
            text: 'Color',
          },
        },
        y: {
          title: {
            text: 'Votes',
          },
        },
      },
    },
  },
  render: (args) => {
    return html`
      <kd-chart
        type="line"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

// export const Annotated = {
//   args: {
//     ...args,
//     options: {
//       plugins: {
//         annotation: {
//           annotations: {
//             threshold: {
//               type: 'line',
//               label: {
//                 display: true,
//                 content: 'Threshold',
//               },
//               yMin: 13,
//               yMax: 13,
//               borderColor: 'purple',
//               borderWidth: 2,
//             },
//           },
//         },
//       },
//       scales: {
//         x: {
//           title: {
//             text: 'Color',
//           },
//         },
//         y: {
//           title: {
//             text: 'Votes',
//           },
//         },
//       },
//     },
//   },
//   render: (args) => {
//     return html`
//       <kd-chart
//         type="line"
//         .chartTitle=${args.chartTitle}
//         .description=${args.description}
//         .labels=${args.labels}
//         .datasets=${args.datasets}
//         ?hideDescription=${args.hideDescription}
//         ?hideCaptions=${args.hideCaptions}
//         ?hideHeader=${args.hideHeader}
//         ?hideControls=${args.hideControls}
//         ?noBorder=${args.noBorder}
//         .options=${{ colorPalette: args.colorPalette, ...args.options }}
//       ></kd-chart>
//     `;
//   },
// };

export const Area = {
  args: {
    ...args,
    datasets: [
      {
        label: 'Dataset 1',
        data: [12, 19, 3, 5, 2, 3],
        fill: true,
      },
      {
        label: 'Dataset 2',
        data: [8, 15, 7, 9, 6, 13],
        fill: true,
      },
    ],
  },
  render: (args) => {
    return html`
      <kd-chart
        type="line"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

export const TimeScale = {
  args: {
    ...args,
    labels: [],
    options: {
      scales: {
        x: {
          type: 'time',
          title: {
            text: 'Date',
          },
        },
        y: {
          title: {
            text: 'Count',
          },
        },
      },
    },
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          { x: '2025-01-23T06:16:57Z', y: 3 },
          { x: '2025-01-23T06:17:12Z', y: 10 },
          { x: '2025-01-23T06:17:27Z', y: 5 },
          { x: '2025-01-23T06:17:42Z', y: 2 },
          { x: '2025-01-23T06:17:57Z', y: 20 },
          { x: '2025-01-23T06:18:12Z', y: 30 },
          { x: '2025-01-23T06:18:27Z', y: 45 },
        ],
      },
      {
        label: 'Dataset 2',
        data: [
          { x: '2025-01-23T06:16:57Z', y: 20 },
          { x: '2025-01-23T06:17:12Z', y: 15 },
          { x: '2025-01-23T06:17:27Z', y: 62 },
          { x: '2025-01-23T06:17:42Z', y: 172 },
          { x: '2025-01-23T06:17:57Z', y: 30 },
          { x: '2025-01-23T06:18:27Z', y: 50 },
          { x: '2025-01-23T06:18:27Z', y: 25 },
        ],
      },
    ],
  },
  render: (args) => {
    return html`
      <kd-chart
        type="line"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

export const Spark = {
  args: {
    chartTitle: 'Spark Line Chart',
    colorPalette: 'categorical',
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          { x: '2025-01-23T06:16:57Z', y: 0 },
          { x: '2025-01-23T06:17:12Z', y: 10 },
          { x: '2025-01-23T06:17:27Z', y: 5 },
          { x: '2025-01-23T06:17:42Z', y: 7 },
          { x: '2025-01-23T06:17:57Z', y: 13 },
          { x: '2025-01-23T06:18:12Z', y: 18 },
          { x: '2025-01-23T06:18:27Z', y: 15 },
        ],
      },
    ],
    options: {
      pointStyle: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          type: 'time',
          display: false,
          title: {
            text: 'Time',
          },
        },
        y: {
          display: false,
          title: {
            text: 'Value',
          },
        },
      },
    },
    width: 200,
    height: 100,
  },
  render: (args) => {
    return html`
      <kd-chart
        type="line"
        .chartTitle=${args.chartTitle}
        .datasets=${args.datasets}
        hideHeader
        hideControls
        noBorder
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

const fanChartLabels = [
  '2023',
  'Q1.2024',
  'Q2.2024',
  'Q3.2024',
  'Q4.2024',
  'Q1.2025',
  'Q2.2025',
  'Q3.2025',
  'Q4.2025',
  'Q1.2026',
  'Q2.2026',
  'Q3.2026',
  'Q4.2026',
  '2027',
];

const fanChartMedian = [
  18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 21.6, 21.6, 25.1, 23.3, 24.5, 24.6, 26.7,
  27.7,
];

const fanChartSigma1High = [
  18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 22.2, 22.8, 26.8, 25.6, 27.2, 27.8, 30.1,
  31.4,
];

const fanChartSigma1Low = [
  18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 20.8, 20.4, 23.2, 20.9, 21.7, 21.3, 23.2,
  24.0,
];

const fanChartSigma2High = [
  18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 22.8, 23.6, 28.4, 27.4, 29.2, 30.4, 32.8,
  34.2,
];

const fanChartSigma2Low = [
  18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 20.4, 19.6, 21.6, 19.1, 20.0, 19.0, 20.5,
  21.2,
];

const fanChartSigma3High = [
  18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 23.4, 24.4, 30.0, 29.2, 31.2, 32.9, 35.4,
  37.0,
];

const fanChartSigma3Low = [
  18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 20.0, 18.8, 20.0, 17.3, 18.3, 16.9, 18.0,
  18.4,
];

const fanChartForecastStartIndex = fanChartLabels.indexOf('Q1.2025');
const fanChartMedianDatasetIndex = 0;
const fanChartColors = getComputedColorPalette('categorical');
const fanChartLineColor = fanChartColors[0];
const fanChartBandOpacity = 1 / 3;
const fanChartBandColor = `rgba(0, 141, 114, ${fanChartBandOpacity})`;

const fanChartBandDefaults = {
  fill: fanChartMedianDatasetIndex,
  borderColor: 'transparent',
  backgroundColor: fanChartBandColor,
  borderWidth: 0,
  pointRadius: 0,
  pointHoverRadius: 0,
};

export const FanChart = {
  args: {
    chartTitle: 'Predicted net income',
    description:
      'Shaded areas representing 1, 2, and 3 standard deviation confidence intervals.',
    labels: fanChartLabels,
    datasets: [
      {
        label: 'Net Income',
        data: fanChartMedian,
        borderColor: fanChartLineColor,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        order: 0,
      },
      {
        label: '1σ',
        data: fanChartSigma1High,
        ...fanChartBandDefaults,
        order: 3,
      },
      {
        label: '2σ',
        data: fanChartSigma2High,
        ...fanChartBandDefaults,
        order: 2,
      },
      {
        label: '3σ',
        data: fanChartSigma3High,
        ...fanChartBandDefaults,
        order: 1,
      },
      {
        label: '1σ',
        data: fanChartSigma1Low,
        ...fanChartBandDefaults,
        order: 3,
      },
      {
        label: '2σ',
        data: fanChartSigma2Low,
        ...fanChartBandDefaults,
        order: 2,
      },
      {
        label: '3σ',
        data: fanChartSigma3Low,
        ...fanChartBandDefaults,
        order: 1,
      },
    ],
    options: {
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          title: {
            text: 'Quarter',
          },
        },
        y: {
          position: 'right',
          title: {
            text: 'Count',
          },
          min: 0,
          max: 40,
          ticks: {
            stepSize: 10,
            callback: (value) => `${value}M`,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        annotation: {
          annotations: {
            forecastRegion: {
              type: 'box',
              xMin: fanChartForecastStartIndex,
              xMax: fanChartLabels.length - 0.5,
              backgroundColor: 'rgba(0, 141, 114, 0.1)',
              borderWidth: 0,
            },
            forecastDivider: {
              type: 'line',
              xMin: fanChartForecastStartIndex,
              xMax: fanChartForecastStartIndex,
              borderColor: '#FF4B42',
              borderDash: [10, 10],
              borderWidth: 1,
            },
          },
        },
        tooltip: {
          filter: (tooltipItem) => tooltipItem.dataset.label === 'Net Income',
          callbacks: {
            label: (context) => `Net Income: ${context.parsed.y}M NOK`,
            afterBody: (items) => {
              const index = items[0]?.dataIndex;

              if (index >= fanChartForecastStartIndex) {
                const low = fanChartSigma3Low[index];
                const high = fanChartSigma3High[index];
                return `3σ range: ${low}M – ${high}M NOK`;
              }

              return null;
            },
          },
        },
      },
    },
    colorPalette: 'categorical',
  },
  render: (args) => {
    return html`
      <kd-chart
        type="line"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};
