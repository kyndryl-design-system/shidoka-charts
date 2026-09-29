import { html } from 'lit';
import '../../charts/area';

export default {
  title: 'Apache ECharts/Area',
  component: 'kd-chart-area',
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
  chartTitle: 'Cloud spend trend',
  description: 'Monthly committed spend in thousands of USD, current year.',
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [
    { name: 'Compute', values: [412, 430, 448, 468, 490, 512] },
    { name: 'Storage', values: [186, 190, 198, 204, 211, 219] },
    { name: 'Network', values: [93, 97, 101, 104, 108, 112] },
  ],
  categoryLabel: 'Month',
  valueLabel: 'Spend (k USD)',
  showLegend: true,
  stacked: false,
  smooth: false,
  showPoints: false,
  height: 420,
  colorPalette: 'categorical',
  hideDescription: false,
  hideControls: false,
  noBorder: false,
  unsafeNativeOptions: undefined,
};

const render = (args) => html`
  <kd-chart-area
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
  ></kd-chart-area>
`;

export const Area = {
  args,
  render,
};

/** Stacked areas so the total is readable at every category. */
export const Stacked = {
  args: {
    ...args,
    chartTitle: 'Revenue by product line',
    description: 'Quarterly revenue in millions of USD, stacked by product.',
    categories: ['Q1', 'Q2', 'Q3', 'Q4'],
    series: [
      { name: 'Platform', values: [12.4, 13.1, 14.0, 15.2] },
      { name: 'Services', values: [6.2, 6.8, 7.1, 7.9] },
      { name: 'Add-ons', values: [2.1, 2.4, 2.6, 3.0] },
    ],
    categoryLabel: 'Quarter',
    valueLabel: 'Revenue ($M)',
    stacked: true,
  },
  render,
};

/** Smoothed curve with markers and a data gap. */
export const SmoothWithPoints = {
  args: {
    ...args,
    chartTitle: 'Daily active sessions',
    description: 'Sessions per day, with a missing data point.',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      { name: 'App', values: [1200, 1340, null, 1420, 1510, 980, 890] },
    ],
    categoryLabel: 'Day',
    valueLabel: 'Sessions',
    smooth: true,
    showPoints: true,
  },
  render,
};
