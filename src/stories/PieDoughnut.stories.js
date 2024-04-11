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
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
      <br /><br />
      Doughnut center labels can be customized by passing in
      "options.doughnutLabel.line1text" and/or
      "options.doughnutLabel.line2text". These options will accept a string,
      number, or a function that returns a string/number. If passing a function,
      the first parameter will give you the default value, and the second
      parameter the context/chart.
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
