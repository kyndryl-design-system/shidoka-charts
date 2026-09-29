import { html } from 'lit';
import '../../charts/bar';

export default {
  title: 'Apache ECharts/Bar',
  component: 'kd-chart-bar',
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
    horizontal: { control: 'boolean' },
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
  chartTitle: 'Quarterly revenue by region',
  description: 'Revenue in thousands of USD, current fiscal year.',
  categories: ['Q1', 'Q2', 'Q3', 'Q4'],
  series: [
    { name: 'Americas', values: [420, 460, 510, 560] },
    { name: 'EMEA', values: [310, 330, 350, 400] },
    { name: 'APAC', values: [180, 210, 240, 280] },
  ],
  categoryLabel: 'Quarter',
  valueLabel: 'Revenue (k USD)',
  showLegend: true,
  stacked: false,
  horizontal: false,
  height: 420,
  colorPalette: 'categorical',
  hideDescription: false,
  hideControls: false,
  noBorder: false,
  unsafeNativeOptions: undefined,
};

const render = (args) => html`
  <kd-chart-bar
    .chartTitle=${args.chartTitle}
    .description=${args.description}
    .categories=${args.categories}
    .series=${args.series}
    .categoryLabel=${args.categoryLabel}
    .valueLabel=${args.valueLabel}
    ?showLegend=${args.showLegend}
    ?stacked=${args.stacked}
    ?horizontal=${args.horizontal}
    .height=${args.height}
    .colorPalette=${args.colorPalette}
    ?hideDescription=${args.hideDescription}
    ?hideControls=${args.hideControls}
    ?noBorder=${args.noBorder}
    .unsafeNativeOptions=${args.unsafeNativeOptions}
  ></kd-chart-bar>
`;

export const Bar = {
  args,
  render,
};

/** Horizontal bars, useful for long category labels. */
export const Horizontal = {
  args: {
    ...args,
    chartTitle: 'Support tickets by product area',
    description: 'Tickets closed last quarter, by product area.',
    categories: [
      'Identity and access',
      'Data platform',
      'Observability',
      'Networking',
      'Billing',
    ],
    series: [{ name: 'Tickets', values: [343, 252, 142, 107, 88] }],
    categoryLabel: 'Product area',
    valueLabel: 'Tickets',
    showLegend: false,
    horizontal: true,
  },
  render,
};

/** Stacked totals across series instead of grouped bars. */
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
