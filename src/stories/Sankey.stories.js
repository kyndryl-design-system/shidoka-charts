import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import { normalizeData } from '../common/config/chartTypes/sankey';

/**
 * Sankey chart type is available through the integration of the
 * [chartjs-chart-sankey](https://github.com/kurkle/chartjs-chart-sankey) package.
 * For detailed documentation on the availble, configurable options, refer to the [plugin's documentation](https://github.com/kurkle/chartjs-chart-sankey/blob/main/README.md).
 */
export default {
  title: 'Third Party Charts/Sankey',
  component: 'kd-chart',
  decorators: [
    (story) => html`<div style="max-width: 800px;">${story()}</div>`,
  ],
  argTypes: {
    ...argTypes,
    labels: { control: { type: 'object' } },
    datasets: { control: { type: 'object' } },
    dataTableHeaderLabels: { control: { type: 'object' } },
  },
  parameters: { design: { type: 'figma', url: '' } },
};

const baseArgs = {
  chartTitle: 'Sankey Chart',
  description: 'Sankey chart showing flows between nodes.',
  datasets: [
    {
      label: 'Flow',
      data: [
        { from: 'a', to: 'b', flow: 10 },
        { from: 'a', to: 'c', flow: 5 },
        { from: 'b', to: 'c', flow: 10 },
        { from: 'd', to: 'c', flow: 7 },
      ],
      colorMode: 'gradient',
      alpha: 0.7,
      labels: { a: 'Label A', b: 'Label B', c: 'Label C', d: 'Label D' },
      priority: { b: 1, d: 0 },
      column: { d: 1 },
      size: 'max',
    },
  ],
  labels: ['Label A', 'Label B', 'Label C', 'Label D'],
  options: {},
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
  noBorder: false,
  width: null,
  height: null,
  colorPalette: 'categorical',
  dataTableHeaderLabels: {
    source: 'Source',
    target: 'Target',
    value: 'Weight',
  },
};

export const Simple = {
  args: baseArgs,
  render: (a) => {
    const { datasets, labels } = normalizeData(a);

    return html`
      <kd-chart
        type="sankey"
        .chartTitle=${a.chartTitle}
        .description=${a.description}
        .labels=${labels}
        .datasets=${datasets}
        ?hideDescription=${a.hideDescription}
        ?hideCaptions=${a.hideCaptions}
        ?hideHeader=${a.hideHeader}
        ?hideControls=${a.hideControls}
        ?noBorder=${a.noBorder}
        .options=${{
          colorPalette: a.colorPalette,
          sankey: {
            dataTableHeaderLabels: a.dataTableHeaderLabels,
            ...(a.options?.sankey || {}),
          },
          ...(a.options || {}),
        }}
        .width=${a.width}
        .height=${a.height}
      ></kd-chart>
    `;
  },
};

export const Complex = {
  args: {
    ...baseArgs,
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          { from: 'leftA', to: 'mid1', flow: 40 },
          { from: 'leftA', to: 'mid2', flow: 20 },
          { from: 'leftB', to: 'mid1', flow: 30 },
          { from: 'leftB', to: 'mid3', flow: 10 },
          { from: 'leftC', to: 'mid2', flow: 15 },
          { from: 'leftC', to: 'mid4', flow: 25 },
          { from: 'mid1', to: 'right1', flow: 35 },
          { from: 'mid1', to: 'right2', flow: 35 },
          { from: 'mid2', to: 'right2', flow: 10 },
          { from: 'mid2', to: 'right3', flow: 25 },
          { from: 'mid3', to: 'right3', flow: 10 },
          { from: 'mid4', to: 'right4', flow: 25 },
          { from: 'mid2', to: 'right5', flow: 5 },
        ],
        labels: {
          leftA: 'Label A',
          leftB: 'Label B',
          leftC: 'Label C',
          mid1: 'Label D',
          mid2: 'Label E',
          mid3: 'Label F',
          mid4: 'Label G',
          right1: 'Label H',
          right2: 'Label I',
          right3: 'Label J',
          right4: 'Label K',
          right5: 'Label L',
          right6: 'Label M',
        },
        priority: { mid1: 1, leftA: 1 },
        column: {
          leftA: 0,
          leftB: 0,
          leftC: 0,
          mid1: 1,
          mid2: 1,
          mid3: 1,
          mid4: 1,
          right1: 2,
          right2: 2,
          right3: 2,
          right4: 2,
          right5: 2,
        },
        alpha: 0.7,
        size: 'max',
        colorMode: 'gradient',
      },
    ],
    labels: [
      'Label A',
      'Label B',
      'Label C',
      'Label D',
      'Label E',
      'Label F',
      'Label G',
      'Label H',
      'Label I',
      'Label J',
      'Label K',
      'Label L',
      'Label M',
    ],
    colorPalette: 'categorical',
  },
  render: (a) => {
    const { datasets, labels } = normalizeData(a);

    return html`
      <kd-chart
        type="sankey"
        .chartTitle=${a.chartTitle}
        .description=${a.description}
        .labels=${labels}
        .datasets=${datasets}
        ?hideDescription=${a.hideDescription}
        ?hideCaptions=${a.hideCaptions}
        ?hideHeader=${a.hideHeader}
        ?hideControls=${a.hideControls}
        ?noBorder=${a.noBorder}
        .options=${{
          colorPalette: a.colorPalette,
          sankey: {
            dataTableHeaderLabels: a.dataTableHeaderLabels,
            ...(a.options?.sankey || {}),
          },
          ...(a.options || {}),
        }}
        .width=${a.width}
        .height=${a.height}
      ></kd-chart>
    `;
  },
};
