import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';

export default {
  title: 'Charts/Line',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=62%3A2752&mode=dev',
    },
  },
  argTypes: {
    ...argTypes,
    useHtmlLegend: {
      table: {
        disable: true,
      },
    },
  },
};

const args = {
  chartTitle: 'Line Chart',
  description: 'Chart description.',
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
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
  colorPalette: 'categorical',
  noBorder: false,
  width: null,
  height: null,
};

export const Line = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="line"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
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
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
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
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
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
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=64%3A3867&mode=dev',
    },
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
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};
