import { html } from 'lit';
import '../components/chart';
import {
  renderHTMLLegend,
  renderCustomLegend,
  renderBoxedLegend,
} from '../common/legend';
import argTypes from '../common/config/chartArgTypes';

export default {
  title: 'Guidelines/Legend',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  argTypes: {
    useHtmlLegend: {
      control: { type: 'boolean' },
      description: 'Use HTML legend instead of Canvas legend',
      defaultValue: false,
    },
    argTypes: {
      ...argTypes,
      useHtmlLegend: {
        table: {
          disable: true,
        },
      },
    },
  },
};

// Sample data for basic legend examples
const basicData = {
  chartTitle: 'Bar Chart',
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
    {
      label: 'Dataset 3',
      data: [5, 12, 8, 3, 9, 7],
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
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  },
  colorPalette: 'categorical',
};

// Many labels and datasets to demonstrate scrolling
const manyLabels = [
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Purple',
  'Orange',
  'Pink',
  'Brown',
  'Gray',
  'Black',
  'Cyan',
  'Magenta',
  'Lime',
  'Indigo',
  'Teal',
  'Lavender',
  'Maroon',
  'Navy',
  'Olive',
  'Coral',
  'Gold',
  'Silver',
  'Turquoise',
  'Violet',
  'Beige',
  'Khaki',
  'Salmon',
  'Plum',
  'Orchid',
  'Crimson',
  'Sienna',
  'Azure',
  'Mint',
  'Ivory',
  'Tan',
  'Indigo',
  'Teal',
  'Lavender',
  'Maroon',
  'Navy',
  'Olive',
  'Coral',
  'Gold',
  'Silver',
  'Turquoise',
  'Violet',
  'Beige',
  'Khaki',
  'Salmon',
  'Plum',
  'Orchid',
  'Crimson',
  'Sienna',
  'Azure',
  'Mint',
  'Ivory',
  'Tan',
  'Indigo',
  'Teal',
  'Lavender',
  'Maroon',
  'Navy',
  'Olive',
  'Coral',
  'Gold',
  'Silver',
  'Turquoise',
  'Violet',
  'Beige',
  'Khaki',
  'Salmon',
  'Plum',
  'Orchid',
  'Crimson',
  'Sienna',
  'Azure',
  'Mint',
  'Ivory',
  'Tan',
];

export const CanvasLegend = {
  args: {
    ...basicData,
    chartTitle: 'Chart with Canvas Legend',
    description: 'Using the built-in Canvas legend (useHtmlLegend="false")',
  },
  render: (args) => {
    return html`
      <kd-chart
        type="bar"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?useHtmlLegend=${args.useHtmlLegend}
        .options=${args.options}
        .colorPalette=${args.colorPalette}
      ></kd-chart>
    `;
  },
};

export const BuiltInHTMLLegend = {
  args: {
    ...basicData,
    useHtmlLegend: true,
    chartTitle: 'Chart with HTML Legend',
    description: 'Using the built-in HTML legend (useHtmlLegend="true")',
  },
  render: (args) => {
    return html`
      <kd-chart
        type="bar"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?useHtmlLegend=${args.useHtmlLegend}
        .options=${args.options}
        .colorPalette=${args.colorPalette}
      ></kd-chart>
    `;
  },
};

export const HTMLLegendOverflow = {
  args: {
    chartTitle: 'Pie Chart with Many Legend Items',
    description:
      'HTML legend with many items to demonstrate scrolling behavior',
    useHtmlLegend: true,
    labels: manyLabels.slice(0, 65),
    datasets: [
      {
        label: 'Dataset 1',
        data: Array.from({ length: 65 }, () => Math.floor(Math.random() * 100)),
      },
    ],
    options: {
      scales: {
        y: {
          title: {
            text: 'Votes',
          },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
    colorPalette: 'categorical',
  },
  render: (args) => {
    return html`
      <kd-chart
        type="pie"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?useHtmlLegend=${args.useHtmlLegend}
        .options=${args.options}
        .colorPalette=${args.colorPalette}
      ></kd-chart>
    `;
  },
};

export const DoughnutLegendOverflow = {
  args: {
    chartTitle: 'Doughnut Chart with Many Legend Items',
    description: 'HTML legend with many items demonstrating scrollable legend',
    useHtmlLegend: true,
    labels: manyLabels.slice(0, 55),
    datasets: [
      {
        label: 'Dataset 1',
        data: Array.from({ length: 55 }, () => Math.floor(Math.random() * 100)),
      },
    ],
    options: {
      scales: {
        y: {
          title: {
            text: 'Votes',
          },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
        },
        htmlLegend: {
          containerClass: 'overflow-legend-container',
          maxHeight: 200, // Force a max height to ensure overflow
        },
      },
    },
    colorPalette: 'categorical',
  },
  render: (args) => {
    return html`
      <style>
        /* Custom CSS to ensure overflow works in story */
        .overflow-legend-container .shidoka-legend-scroll-content {
          max-height: 200px !important;
          overflow-y: auto !important;
          border: 1px solid #eee;
          border-radius: 4px;
          padding: 8px;
        }
      </style>
      <kd-chart
        type="doughnut"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?useHtmlLegend=${args.useHtmlLegend}
        .options=${args.options}
        .colorPalette=${args.colorPalette}
      ></kd-chart>
    `;
  },
};

export const ExternalHTMLLegend = {
  args: {
    ...basicData,
    useHtmlLegend: false,
    chartTitle: 'Chart with External HTML Legend',
    description: 'Using custom external HTML legend with renderHTMLLegend()',
  },
  render: (args) => {
    setTimeout(() => {
      const chart = document.getElementById('external-html-chart').chart;
      if (chart) {
        const container = document.getElementById('external-html-legend');

        renderHTMLLegend(chart, container, {
          maxHeight: 100,
          boxWidth: 16,
          boxHeight: 16,
          borderRadius: 2,
          className: 'shidoka-legend',
          itemClassName: 'shidoka-legend-item',
        });
      }
    }, 100);

    return html`
      <div>
        <kd-chart
          id="external-html-chart"
          type="bar"
          .chartTitle=${args.chartTitle}
          .description=${args.description}
          .labels=${args.labels}
          .datasets=${args.datasets}
          ?useHtmlLegend=${args.useHtmlLegend}
          .options=${{
            ...args.options,
            plugins: {
              ...args.options.plugins,
              legend: {
                display: false,
              },
            },
          }}
          .colorPalette=${args.colorPalette}
        ></kd-chart>

        <div id="external-html-legend" style="margin-top: 20px;"></div>

        <div
          style="margin-top: 10px; font-size: 14px; color: var(--kd-color-text-level-secondary, #555);"
        >
          External HTML legend created with renderHTMLLegend()
        </div>
      </div>
    `;
  },
};

export const CustomStyledLegend = {
  args: {
    ...basicData,
    useHtmlLegend: false,
    chartTitle: 'Chart with Custom Styled Legend',
    description: 'Using custom external legend with renderCustomLegend()',
  },
  render: (args) => {
    setTimeout(() => {
      const chart = document.getElementById('custom-styled-chart').chart;
      if (chart) {
        const container = document.getElementById('custom-styled-legend');

        renderCustomLegend(chart, container, {
          maxHeight: 100,
          boxWidth: 16,
          boxHeight: 16,
          className: 'custom-legend',
          itemClassName: 'custom-legend-item',
        });
      }
    }, 100);

    return html`
      <style>
        #custom-styled-legend .custom-legend {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }
        #custom-styled-legend .custom-legend-item {
          display: flex;
          align-items: center;
          background-color: var(
            --kd-color-background-ui-default-light,
            #f0f0f0
          );
          border-radius: 4px;
          padding: 6px 10px;
          transition: all 0.2s ease;
          font-family: var(--kd-font-family-body, inherit);
        }
        #custom-styled-legend .custom-legend-item:hover {
          background-color: var(--kd-color-background-ui-hover, #e0e0e0);
          transform: translateY(-2px);
        }
        #custom-styled-legend .custom-legend-item.hidden {
          opacity: 0.5;
          text-decoration: line-through;
        }
      </style>
      <div>
        <kd-chart
          id="custom-styled-chart"
          type="bar"
          .chartTitle=${args.chartTitle}
          .description=${args.description}
          .labels=${args.labels}
          .datasets=${args.datasets}
          ?useHtmlLegend=${args.useHtmlLegend}
          .options=${{
            ...args.options,
            plugins: {
              ...args.options.plugins,
              legend: {
                display: false,
              },
            },
          }}
          .colorPalette=${args.colorPalette}
        ></kd-chart>

        <div id="custom-styled-legend" style="margin-top: 20px;"></div>

        <div
          style="margin-top: 10px; font-size: 14px; color: var(--kd-color-text-level-secondary, #555);"
        >
          Custom styled legend with hover effects using renderCustomLegend()
        </div>
      </div>
    `;
  },
};

export const BoxedLegend = {
  args: {
    ...basicData,
    useHtmlLegend: false,
    chartTitle: 'Chart with Boxed Legend',
    description:
      'Using external boxed legend with renderBoxedLegend() - notice the different styling from CustomStyledLegend',
  },
  render: (args) => {
    setTimeout(() => {
      const chart = document.getElementById('boxed-legend-chart').chart;
      if (chart) {
        const container = document.getElementById('boxed-legend-container');

        renderBoxedLegend(chart, container, {
          maxHeight: 150,
        });
      }
    }, 100);

    return html`
      <style>
        #boxed-legend-container .my-custom-legend {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          background-color: #f5f7fa;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        #boxed-legend-container .my-custom-legend-item {
          display: flex;
          align-items: center;
          cursor: pointer;
          background-color: white;
          padding: 8px 12px;
          border-radius: 4px;
          transition: all 0.2s ease;
          font-size: 11px;
          font-family: var(--kd-font-family-body, inherit);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        #boxed-legend-container .my-custom-legend-item:hover {
          background-color: #f8f8f8;
          transform: translateY(-2px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }
        #boxed-legend-container .my-custom-legend-item.hidden {
          opacity: 0.5;
          text-decoration: line-through;
        }
        #boxed-legend-container .color-box {
          width: 16px;
          height: 16px;
          border-radius: 3px;
          display: inline-block;
          margin-right: 8px;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
      </style>
      <div>
        <kd-chart
          id="boxed-legend-chart"
          type="bar"
          .chartTitle=${args.chartTitle}
          .description=${args.description}
          .labels=${args.labels}
          .datasets=${args.datasets}
          ?useHtmlLegend=${args.useHtmlLegend}
          .options=${{
            ...args.options,
            plugins: {
              ...args.options.plugins,
              legend: {
                display: false,
              },
            },
          }}
          .colorPalette=${args.colorPalette}
        ></kd-chart>

        <div id="boxed-legend-container" style="margin-top: 20px;"></div>

        <div
          style="margin-top: 10px; font-size: 14px; color: var(--kd-color-text-level-secondary, #555);"
        >
          Boxed legend with distinct styling using renderBoxedLegend()
        </div>
      </div>
    `;
  },
};
