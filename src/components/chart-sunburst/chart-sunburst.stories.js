import { html } from 'lit';
import '../../charts/sunburst';

export default {
  title: 'Echarts/Apache',
  component: 'kd-chart-sunburst',
  decorators: [
    (story) => html` <div style="max-width: 720px;">${story()}</div> `,
  ],
  argTypes: {
    nodes: {
      control: 'object',
      description: 'Semantic hierarchy of segments.',
    },
    categoryLabel: { control: 'text' },
    valueLabel: { control: 'text' },
    showLabels: { control: 'boolean' },
    innerRadiusRatio: {
      control: { type: 'range', min: 0, max: 0.8, step: 0.05 },
    },
    height: { control: { type: 'range', min: 240, max: 720, step: 20 } },
    colorPalette: {
      control: 'select',
      options: ['categorical', 'sequential01', 'sequential02', 'divergent01'],
    },
    hideDescription: { control: 'boolean' },
    hideControls: { control: 'boolean' },
    noBorder: { control: 'boolean' },
    unsafeNativeOptions: {
      control: 'object',
      description:
        'Unstable ECharts-native overrides, merged over the generated option.',
    },
  },
};

const args = {
  chartTitle: 'Cloud spend by service',
  description: 'Monthly committed spend in thousands of USD, current quarter.',
  nodes: [
    {
      label: 'Compute',
      children: [
        { label: 'Virtual machines', value: 412 },
        { label: 'Kubernetes', value: 268 },
        { label: 'Serverless', value: 94 },
      ],
    },
    {
      label: 'Data',
      children: [
        { label: 'Managed SQL', value: 205 },
        { label: 'Warehouse', value: 158 },
        { label: 'Streaming', value: 49 },
      ],
    },
    {
      label: 'Storage',
      children: [
        { label: 'Object', value: 186 },
        { label: 'Block', value: 121 },
        { label: 'Archive', value: 38 },
      ],
    },
    {
      label: 'Network',
      children: [
        { label: 'Egress', value: 143 },
        { label: 'Load balancing', value: 67 },
      ],
    },
    {
      label: 'Security',
      children: [
        { label: 'Identity', value: 72 },
        { label: 'Threat detection', value: 61 },
      ],
    },
  ],
  categoryLabel: 'Service',
  valueLabel: 'Spend (k USD)',
  showLabels: true,
  innerRadiusRatio: 0.25,
  height: 420,
  colorPalette: 'categorical',
  hideDescription: false,
  hideControls: false,
  noBorder: false,
  unsafeNativeOptions: undefined,
};

export const Sunburst = {
  args,
  render: (args) => {
    return html`
      <kd-chart-sunburst
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .nodes=${args.nodes}
        .categoryLabel=${args.categoryLabel}
        .valueLabel=${args.valueLabel}
        .showLabels=${args.showLabels}
        .innerRadiusRatio=${args.innerRadiusRatio}
        .height=${args.height}
        .colorPalette=${args.colorPalette}
        ?hideDescription=${args.hideDescription}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .unsafeNativeOptions=${args.unsafeNativeOptions}
      ></kd-chart-sunburst>
    `;
  },
};
