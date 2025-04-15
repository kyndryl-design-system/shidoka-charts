import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';

export default {
  title: 'Charts/Pie & Doughnut',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 600px;">${story()}</div> `,
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=64%3A4378&mode=dev',
    },
  },
  argTypes: argTypes,
};

const args = {
  chartTitle: 'Pie Chart',
  description: 'Chart description.',
  labels: ['Blue', 'Red', 'Orange', 'Yellow', 'Green', 'Purple'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [120, 190, 300, 500, 200, 300],
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
  useHtmlLegend: false,
};

export const Pie = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="pie"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        ?useHtmlLegend=${args.useHtmlLegend}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const Doughnut = {
  args: {
    ...args,
    chartTitle: 'Doughnut Chart',
  },
  render: (args) => {
    return html`
      <kd-chart
        type="doughnut"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        ?useHtmlLegend=${args.useHtmlLegend}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=64%3A4703&mode=dev',
    },
  },
};

export const DoughnutCustomCenterLabel = {
  args: {
    ...args,
    chartTitle: 'Doughnut Chart',
    description: 'With custom center labels.',
    options: {
      doughnutLabel: {
        line1text: function (defaultValue, context) {
          // example: add commas to total number
          return defaultValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        line2text: 'Test',
        line2fontSize: '12px',
      },
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
        type="doughnut"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        ?useHtmlLegend=${args.useHtmlLegend}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=64%3A4703&mode=dev',
    },
  },
};

export const DoughnutLegendOverflow = {
  args: {
    ...args,
    labels: [
      'Blue',
      'Red',
      'Orange',
      'Yellow',
      'Green',
      'Purple',
      'Red1',
      'Orange1',
      'Yellow1',
      'Green1',
      'Purple1',
      'Red2',
      'Orange2',
      'Yellow2',
      'Green2',
      'Purple2',
      'Red3',
      'Orange3',
      'Yellow3',
      'Green3',
      'Purple3',
      'Red4',
      'Orange4',
      'Yellow4',
      'Green4',
      'Purple4',
      'Red5',
      'Orange5',
      'Yellow5',
      'Green5',
      'Purple5',
      'Red6',
      'Orange6',
      'Yellow6',
      'Green6',
      'Purple6',
      'Red7',
      'Orange7',
      'Yellow7',
    ],
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          120, 190, 300, 500, 200, 300, 120, 190, 300, 500, 200, 300, 120, 190,
          300, 500, 200, 300, 120, 190, 300, 500, 200, 300, 120, 190, 300, 500,
          200, 300, 120, 190, 300, 500, 200, 300, 120, 190, 300,
        ],
      },
    ],
    chartTitle: 'Doughnut Chart',
    description: 'With over-crowded legend to illustrate overflow.',
    options: {
      doughnutLabel: {
        line1text: function (defaultValue, context) {
          // example: add commas to total number
          return defaultValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        line2text: 'Test',
        line2fontSize: '12px',
      },
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
        type="doughnut"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        ?useHtmlLegend=${true}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=64%3A4703&mode=dev',
    },
  },
};

// export const MultiPie = {
//   args: {
//     ...args,
//     datasets: [
//       {
//         label: 'Dataset 1',
//         data: [12, 19, 3, 5, 2, 3],
//       },
//       {
//         label: 'Dataset 2',
//         data: [8, 15, 7, 9, 6, 13],
//       },
//     ],
//     options: {
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
//       plugins: {
//         datalabels: {
//           display: false,
//         },
//       },
//     },
//   },
//   render: (args) => {
//     return html`
//       <kd-chart
//         type="pie"
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
//         .width=${args.width}
//         .height=${args.height}
//       ></kd-chart>
//     `;
//   },
// };

// export const MultiDoughnut = {
//   args: {
//     ...args,
//     chartTitle: 'Doughnut Chart',
//     datasets: [
//       {
//         label: 'Dataset 1',
//         data: [12, 19, 3, 5, 2, 3],
//       },
//       {
//         label: 'Dataset 2',
//         data: [8, 15, 7, 9, 6, 13],
//       },
//     ],
//     options: {
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
//       plugins: {
//         datalabels: {
//           display: false,
//         },
//       },
//     },
//   },
//   render: (args) => {
//     return html`
//       <kd-chart
//         type="doughnut"
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
//         .width=${args.width}
//         .height=${args.height}
//       ></kd-chart>
//     `;
//   },
// };
