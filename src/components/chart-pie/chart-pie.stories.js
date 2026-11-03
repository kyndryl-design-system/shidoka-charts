import { html } from 'lit';
import '../../charts/pie';
import { chartSourceTransform } from '../../../.storybook/chart-source-transform.js';

export default {
  title: 'Apache ECharts/Pie & Doughnut',
  component: 'kd-chart-pie',
  parameters: {
    docs: {
      source: {
        type: 'dynamic',
        transform: chartSourceTransform('kd-chart-pie'),
      },
    },
  },
  decorators: [
    (story) => html` <div style="max-width: 720px;">${story()}</div> `,
  ],
  argTypes: {
    colorPalette: {
      control: 'select',
      description: 'Shidoka data visualization palette key.',
      options: [
        'categorical',
        'sequential01',
        'sequential02',
        'sequential03',
        'sequential04',
        'sequential05',
        'divergent01',
        'divergent02',
        'statusLight',
        'statusDark',
        'rag03',
        'rag08',
      ],
    },
    slices: {
      control: 'object',
      description: 'Slices of the pie.',
    },
    categoryLabel: { control: 'text' },
    valueLabel: { control: 'text' },
    showLabels: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    innerRadiusRatio: {
      control: { type: 'range', min: 0, max: 0.8, step: 0.05 },
    },
    height: { control: { type: 'range', min: 240, max: 720, step: 20 } },
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
  chartTitle: 'Traffic by acquisition channel',
  description: 'Sessions last 30 days, by acquisition channel.',
  slices: [
    { label: 'Organic search', value: 3820 },
    { label: 'Direct', value: 2140 },
    { label: 'Referral', value: 1360 },
    { label: 'Social', value: 980 },
    { label: 'Email', value: 640 },
  ],
  categoryLabel: 'Channel',
  valueLabel: 'Sessions',
  showLabels: true,
  showLegend: true,
  innerRadiusRatio: 0,
  height: 420,
  colorPalette: 'categorical',
  hideDescription: false,
  hideControls: false,
  noBorder: false,
  unsafeNativeOptions: undefined,
};

const doughnutArgs = {
  ...args,
  chartTitle: 'Cloud spend by service',
  description: 'Monthly committed spend in thousands of USD, current quarter.',
  slices: [
    { label: 'Compute', value: 774 },
    { label: 'Data', value: 412 },
    { label: 'Storage', value: 345 },
    { label: 'Network', value: 210 },
    { label: 'Security', value: 133 },
  ],
  categoryLabel: 'Service',
  valueLabel: 'Spend (k USD)',
  innerRadiusRatio: 0.55,
};

const render = (args) => html`
  <kd-chart-pie
    .chartTitle=${args.chartTitle}
    .description=${args.description}
    .slices=${args.slices}
    .categoryLabel=${args.categoryLabel}
    .valueLabel=${args.valueLabel}
    ?showLabels=${args.showLabels}
    ?showLegend=${args.showLegend}
    .innerRadiusRatio=${args.innerRadiusRatio}
    .height=${args.height}
    .colorPalette=${args.colorPalette}
    ?hideDescription=${args.hideDescription}
    ?hideControls=${args.hideControls}
    ?noBorder=${args.noBorder}
    .unsafeNativeOptions=${args.unsafeNativeOptions}
  ></kd-chart-pie>
`;

export const Pie = {
  args,
  render,
};

/** Doughnut variant, using a nonzero inner radius. */
export const Doughnut = {
  args: doughnutArgs,
  render,
};
