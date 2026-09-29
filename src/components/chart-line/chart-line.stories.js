import { html } from 'lit';
import '../../charts/line';

export default {
  title: 'Apache ECharts/Line',
  component: 'kd-chart-line',
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
    categories: {
      control: 'object',
      description: 'Category labels along the shared axis.',
    },
    series: {
      control: 'object',
      description: 'Series plotted against `categories`.',
    },
    categoryLabel: { control: 'text' },
    valueLabel: { control: 'text' },
    showLegend: { control: 'boolean' },
    stacked: { control: 'boolean' },
    smooth: { control: 'boolean' },
    showPoints: { control: 'boolean' },
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
  chartTitle: 'Monthly active users',
  description: 'Active users by platform, current fiscal year.',
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [
    { name: 'Web', values: [820, 932, 901, 934, 1290, 1330] },
    { name: 'Mobile', values: [620, 632, 701, 734, 890, 990] },
    { name: 'Desktop', values: [220, 182, 191, 234, 290, 330] },
  ],
  categoryLabel: 'Month',
  valueLabel: 'Users (thousands)',
  showLegend: true,
  stacked: false,
  smooth: false,
  showPoints: true,
  height: 420,
  colorPalette: 'categorical',
  hideDescription: false,
  hideControls: false,
  noBorder: false,
  unsafeNativeOptions: undefined,
};

const render = (args) => html`
  <kd-chart-line
    .chartTitle=${args.chartTitle}
    .description=${args.description}
    .categories=${args.categories}
    .series=${args.series}
    .categoryLabel=${args.categoryLabel}
    .valueLabel=${args.valueLabel}
    ?showLegend=${args.showLegend}
    ?stacked=${args.stacked}
    ?smooth=${args.smooth}
    ?showPoints=${args.showPoints}
    .height=${args.height}
    .colorPalette=${args.colorPalette}
    ?hideDescription=${args.hideDescription}
    ?hideControls=${args.hideControls}
    ?noBorder=${args.noBorder}
    .unsafeNativeOptions=${args.unsafeNativeOptions}
  ></kd-chart-line>
`;

export const Line = {
  args,
  render,
};

/** Stacked totals across series instead of overlaid lines. */
export const Stacked = {
  args: {
    ...args,
    chartTitle: 'Support tickets by channel',
    description: 'Tickets opened per week, stacked across channels.',
    categories: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    series: [
      { name: 'Email', values: [120, 132, 101, 134, 90, 130] },
      { name: 'Chat', values: [220, 182, 191, 234, 290, 330] },
      { name: 'Phone', values: [150, 232, 201, 154, 190, 130] },
    ],
    categoryLabel: 'Week',
    valueLabel: 'Tickets',
    stacked: true,
  },
  render,
};

/** Smoothed curves with a gap where a value is missing. */
export const SmoothWithGap = {
  args: {
    ...args,
    chartTitle: 'Server response time',
    description: 'Median response time in milliseconds, with a data gap.',
    categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    series: [
      { name: 'Region A', values: [42, 38, null, 51, 47, 44] },
      { name: 'Region B', values: [55, 52, 49, null, 58, 60] },
    ],
    categoryLabel: 'Time',
    valueLabel: 'Latency (ms)',
    smooth: true,
  },
  render,
};
