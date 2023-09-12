import { html } from 'lit';
import '../components/chart';

export default {
  title: 'Line',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  design: {
    type: 'figma',
    url: '',
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
    },
  },
  hideDescription: false,
  hideCaptions: false,
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
        .options=${args.options}
      ></kd-chart>
    `;
  },
};

export const Annotated = {
  args: {
    ...args,
    options: {
      plugins: {
        annotation: {
          annotations: {
            threshold: {
              type: 'line',
              label: {
                display: true,
                content: 'Threshold',
              },
              yMin: 13,
              yMax: 13,
              borderColor: 'purple',
              borderWidth: 2,
            },
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
        .options=${args.options}
      ></kd-chart>
    `;
  },
};

export const MultiAxis = {
  args: {
    ...args,
    datasets: [
      {
        label: 'Dataset 1',
        data: [12, 19, 3, 5, 2, 3],
        yAxisID: 'y',
      },
      {
        label: 'Dataset 2',
        data: [8, 15, 7, 9, 6, 13],
        yAxisID: 'y1',
      },
    ],
    options: {
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
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
        .options=${args.options}
      ></kd-chart>
    `;
  },
};

export const Area = {
  args: {
    ...args,
    datasets: [
      {
        label: 'Dataset 1',
        data: [12, 19, 3, 5, 2, 3],
        yAxisID: 'y',
        fill: true,
      },
      {
        label: 'Dataset 2',
        data: [8, 15, 7, 9, 6, 13],
        yAxisID: 'y1',
        fill: true,
      },
    ],
    options: {
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
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
        .options=${args.options}
      ></kd-chart>
    `;
  },
};
