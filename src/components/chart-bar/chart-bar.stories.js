import { html } from 'lit';
import '../../charts/bar';
import { chartSourceTransform } from '../../../.storybook/chart-source-transform.js';

export default {
  title: 'Apache ECharts/Bar',
  component: 'kd-chart-bar',
  parameters: {
    docs: {
      source: {
        type: 'dynamic',
        transform: chartSourceTransform('kd-chart-bar'),
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
    barThickness: {
      control: 'number',
      description: 'Fixed bar thickness in px.',
    },
    valueMax: {
      control: 'number',
      description: 'Upper bound for the value axis.',
    },
    hideAxes: { control: 'boolean' },
    hideTooltip: { control: 'boolean' },
    showSeriesLabels: { control: 'boolean' },
    indicator: {
      control: 'object',
      description: 'Marker drawn at a fixed value on the value axis.',
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

const horizontalArgs = {
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
};

const stackedArgs = {
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
};

const horizontalStackedArgs = {
  ...stackedArgs,
  chartTitle: 'Support tickets by channel',
  description: 'Tickets opened per week, stacked across channels.',
  horizontal: true,
};

const floatingArgs = {
  ...args,
  chartTitle: 'Daily temperature range',
  description: 'Low to high range per colour-coded sensor group.',
  categories: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  series: [
    {
      name: 'Sensor 1',
      values: [
        [2, 10],
        [12, 19],
        [3, 5],
        [5, 9],
        [2, 11],
        [3, 7],
      ],
    },
    {
      name: 'Sensor 2',
      values: [
        [8, 5],
        [13, 7],
        [3, -3],
        [5, 7],
        [2, 9],
        [3, -1],
      ],
    },
  ],
  categoryLabel: 'Group',
  valueLabel: 'Range',
};

const singleLabelArgs = {
  ...args,
  chartTitle: 'Votes by colour',
  description: 'One category, one bar per colour.',
  categories: ['Color'],
  series: [
    { name: 'Red', values: [12] },
    { name: 'Blue', values: [8] },
    { name: 'Yellow', values: [15] },
    { name: 'Green', values: [7] },
    { name: 'Purple', values: [9] },
    { name: 'Orange', values: [13] },
  ],
  categoryLabel: 'Color',
  valueLabel: 'Votes',
};

const meterBarArgs = {
  ...args,
  chartTitle: 'Risk meter',
  description: 'Current risk score against banded thresholds.',
  categories: ['Risk Meter'],
  series: [
    { name: 'Low', values: [25] },
    { name: 'Medium', values: [25] },
    { name: 'High', values: [25] },
    { name: 'Critical', values: [25] },
  ],
  categoryLabel: 'Risk',
  valueLabel: 'Risk Score',
  colorPalette: 'statusDark',
  showLegend: false,
  stacked: true,
  horizontal: true,
  hideAxes: true,
  hideTooltip: true,
  showSeriesLabels: true,
  barThickness: 20,
  valueMax: 100,
  indicator: { value: 62, label: '62' },
  height: 240,
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
    .barThickness=${args.barThickness}
    .valueMax=${args.valueMax}
    ?hideAxes=${args.hideAxes}
    ?hideTooltip=${args.hideTooltip}
    ?showSeriesLabels=${args.showSeriesLabels}
    .indicator=${args.indicator}
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
  args: horizontalArgs,
  render,
};

/** Stacked totals across series instead of grouped bars. */
export const Stacked = {
  args: stackedArgs,
  render,
};

/** Stacked totals drawn as horizontal bars. */
export const HorizontalStacked = {
  args: horizontalStackedArgs,
  render,
};

/** Floating bars: each value is a `[min, max]` range instead of a bar from zero. */
export const Floating = {
  args: floatingArgs,
  render,
};

/** A single category with one bar per series. */
export const SingleLabel = {
  args: singleLabelArgs,
  render,
};

/** Stacked horizontal meter with in-bar segment labels and a value indicator. */
export const MeterBar = {
  args: meterBarArgs,
  render,
};
