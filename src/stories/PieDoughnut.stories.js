import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';

export default {
  title: 'Charts/Pie & Doughnut',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 600px;">${story()}</div> `,
  ],
  design: {
    type: 'figma',
    url: '',
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
      data: [12, 19, 3, 5, 2, 3],
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
  colorPalette: 'default',
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
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
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
//         ?noBorder=${args.noBorder}
//         .options=${{ colorPalette: args.colorPalette, ...args.options }}
//         .width=${args.width}
//         .height=${args.height}
//       ></kd-chart>
//     `;
//   },
// };
