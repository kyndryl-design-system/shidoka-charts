import { html } from 'lit';
import '../components/chart';
import argTypes, { hideUnusedControls } from '../common/config/chartArgTypes';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export default {
  title: 'Charts/Bar',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=1%3A4&mode=dev',
    },
  },
  argTypes: {
    ...argTypes,
    useHtmlLegend: hideUnusedControls,
  },
};

const args = {
  chartTitle: 'Bar Chart',
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

export const Vertical = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="bar"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

export const Horizontal = {
  args: {
    ...args,
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          title: {
            text: 'Votes',
          },
        },
        y: {
          title: {
            text: 'Color',
          },
        },
      },
    },
  },
  render: (args) => {
    return html`
      <kd-chart
        type="bar"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

export const Stacked = {
  args: {
    ...args,
    options: {
      scales: {
        x: {
          title: {
            text: 'Color',
          },
          stacked: true,
        },
        y: {
          title: {
            text: 'Votes',
          },
          stacked: true,
        },
      },
    },
  },
  render: (args) => {
    return html`
      <kd-chart
        type="bar"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

export const HorizontalStacked = {
  args: {
    ...args,
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          title: {
            text: 'Votes',
          },
          stacked: true,
        },
        y: {
          title: {
            text: 'Color',
          },
          stacked: true,
        },
      },
    },
  },
  render: (args) => {
    return html`
      <kd-chart
        type="bar"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

export const Floating = {
  args: {
    ...args,
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          [2, 10],
          [12, 19],
          [3, 5],
          [5, 9],
          [2, 11],
          [3, 7],
        ],
      },
      {
        label: 'Dataset 2',
        data: [
          [8, 5],
          [13, 7],
          [3, -3],
          [5, 7],
          [2, 9],
          [3, -1],
        ],
      },
    ],
  },
  render: (args) => {
    return html`
      <kd-chart
        type="bar"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

export const SingleLabel = {
  args: {
    ...args,
    labels: ['Color'],
    datasets: [
      {
        label: 'Red',
        data: [12],
      },
      {
        label: 'Blue',
        data: [8],
      },
      {
        label: 'Yellow',
        data: [15],
      },
      {
        label: 'Green',
        data: [7],
      },
      {
        label: 'Purple',
        data: [9],
      },
      {
        label: 'Orange',
        data: [13],
      },
    ],
    options: {
      scales: {
        x: {
          title: {
            display: false,
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
        type="bar"
        .chartTitle=${args.chartTitle}
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
      ></kd-chart>
    `;
  },
};

export const MeterBar = {
  args: {
    colorPalette: 'statusDark',
    labels: ['Risk Meter'],
    datasets: [
      {
        label: 'Low',
        data: [25],
      },
      {
        label: 'Medium',
        data: [25],
      },
      {
        label: 'High',
        data: [25],
      },
      {
        label: 'Critical',
        data: [25],
      },
    ],
    options: {
      barThickness: 20,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: {
          max: 100, // Indicator scale max value
          title: {
            text: 'Risk Score',
          },
          stacked: true,
          display: false,
        },
        y: {
          title: {
            text: 'Risk',
          },
          stacked: true,
          display: false,
        },
      },
      plugins: {
        annotation: {
          annotations: {
            indicator: {
              type: 'line',
              xMin: 62, // Indicator value
              xMax: 62,
              yMin: -0.065,
              yMax: 0.065,
              borderWidth: 2,
              borderColor: () => {
                return getTokenThemeVal('--kd-color-text-level-primary');
              },
              label: {
                display: true,
                content: ['62', '▼'],
                position: 'start',
                yAdjust: -14,
                backgroundColor: 'transparent',
                color: () => {
                  return getTokenThemeVal('--kd-color-text-level-primary');
                },
                font: { size: 14 },
              },
            },
          },
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        datalabels: {
          display: true,
          formatter: (value, context) => context.dataset.label,
          anchor: 'center',
          align: 'bottom',
          offset: 12,
        },
      },
    },
  },
  render: (args) => {
    return html`
      <kd-chart
        type="bar"
        chartTitle="Stacked Horizontal Bar"
        description="Risk Meter"
        .labels=${args.labels}
        .datasets=${args.datasets}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        hideTableControl
      ></kd-chart>
    `;
  },
};
