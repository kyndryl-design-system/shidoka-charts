import { html } from 'lit';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';
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

export const ThresholdBand = {
  tags: ['new'],
  args: {
    chartTitle: 'Line Chart with Threshold Band',
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current Week'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [52, 88, 40, 75, 89],
      },
      {
        label: 'Dataset 2',
        data: [33, 70, 65, 90, 83],
      },
    ],
    options: {
      scales: {
        x: {
          title: {
            text: 'Time Period',
          },
          offset: true,
        },
        y: {
          title: {
            text: 'Value',
          },
          min: 20,
          max: 100,
          ticks: {
            stepSize: 20,
          },
        },
      },
      plugins: {
        thresholdBands: {
          bands: [
            { value: 20, color: '#CC1800' }, // Supported color formats are Hex : '#90ee90' and shidoka css Shidoka CSS variable: 'var(--kd-color-data-viz-categorical-01-02)'
            { value: 40, color: '#CC1800' },
            { value: 60, color: '#CC1800' },
            { value: 80, color: '#FFD46A' },
            {
              value: 100,
              color: 'var(--kd-color-data-viz-divergent-02-positive-60)',
            },
          ],
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
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
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
const fanChartBandOpacities = {
  '1σ': 0.4,
  '2σ': 0.3,
  '3σ': 0.2,
};

const colorToRgba = (color, alpha) => {
  if (!color || typeof color !== 'string') {
    return color;
  }

  if (color.startsWith('#') && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const rgbMatch = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
  }

  return color;
};

const getConfidenceBandDatasets = (colorPalette = 'categorical') => {
  const colors = getComputedColorPalette(colorPalette);
  const lineColor = colors[0];
  const forecastBandColor = getComputedColorPalette('divergent01')[14];

  const createBandDataset = (label, data, order, opacity) => ({
    label,
    data,
    fill: fanChartMedianDatasetIndex,
    borderColor: 'transparent',
    backgroundColor: colorToRgba(forecastBandColor, opacity),
    borderWidth: 0,
    pointRadius: 0,
    pointHoverRadius: 0,
    order,
  });

  return [
    {
      label: 'Net Income',
      data: fanChartMedian,
      fill: false,
      borderColor: lineColor,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 5,
      clip: false,
      order: 0,
    },
    createBandDataset(
      '1σ upper',
      fanChartSigma1High,
      3,
      fanChartBandOpacities['1σ']
    ),
    createBandDataset(
      '2σ upper',
      fanChartSigma2High,
      2,
      fanChartBandOpacities['2σ']
    ),
    createBandDataset(
      '3σ upper',
      fanChartSigma3High,
      1,
      fanChartBandOpacities['3σ']
    ),
    createBandDataset(
      '1σ lower',
      fanChartSigma1Low,
      3,
      fanChartBandOpacities['1σ']
    ),
    createBandDataset(
      '2σ lower',
      fanChartSigma2Low,
      2,
      fanChartBandOpacities['2σ']
    ),
    createBandDataset(
      '3σ lower',
      fanChartSigma3Low,
      1,
      fanChartBandOpacities['3σ']
    ),
  ];
};

export const FanChart = {
  tags: ['new'],
  args: {
    colorPalette: hideUnusedControls,
    chartTitle: 'Forecast Line chart - Confidence Bands',
    labels: fanChartLabels,
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
              backgroundColor:
                getComputedColorPalette('divergent01')[14] + '10',
              opacity: 0.1,
              borderWidth: 0,
            },
            forecastDivider: {
              type: 'line',
              xMin: fanChartForecastStartIndex,
              xMax: fanChartForecastStartIndex,
              borderColor: getTokenThemeVal('--kd-color-border-variants-focus'),
              borderDash: [10, 10],
              borderWidth: 1,
            },
          },
        },
        tooltip: {
          filter: (tooltipItem) => tooltipItem.dataset.label === 'Net Income',
          callbacks: {
            label: (context) => `Net Income: ${context.parsed.y}M`,
          },
        },
        // pointColumnHighlight: {
        //   datasetIndex: 0,
        //   backgroundColor: '--kd-color-background-container-subtle',
        // },
      },
    },
  },
  render: (args) => {
    return html`
      <kd-chart
        type="line"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${getConfidenceBandDatasets('categorical')}
        .options=${{ ...args.options }}
      ></kd-chart>
    `;
  },
};
