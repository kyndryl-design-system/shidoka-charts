import { html } from 'lit';
import '../../charts/line';
import { chartSource } from '../../../.storybook/chart-source.js';

export default {
  title: 'Apache ECharts/Line',
  component: 'kd-chart-line',
  parameters: {
    docs: {
      source: {
        type: 'dynamic',
        transform: (_source, ctx) => chartSource('kd-chart-line', ctx.args),
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
    smooth: { control: 'boolean' },
    showPoints: { control: 'boolean' },
    timeAxis: { control: 'boolean' },
    hideAxes: { control: 'boolean' },
    referenceBands: {
      control: 'object',
      description: 'Horizontal threshold bands drawn across the plot.',
    },
    forecastFrom: {
      control: 'text',
      description: 'Category label or index where the forecast region begins.',
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

const smoothWithGapArgs = {
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
};

const withoutPointsArgs = {
  ...args,
  chartTitle: 'Requests per minute',
  description: 'Line without point markers, for dense series.',
  showPoints: false,
};

const curvedArgs = {
  ...args,
  chartTitle: 'Requests per minute',
  description: 'Monotone-smoothed curve through the same points.',
  smooth: true,
};

const timeScaleArgs = {
  ...args,
  chartTitle: 'Events over time',
  description: 'Points spaced by elapsed time rather than evenly by index.',
  categories: [
    '2025-01-23T06:16:57Z',
    '2025-01-23T06:17:12Z',
    '2025-01-23T06:17:27Z',
    '2025-01-23T06:17:42Z',
    '2025-01-23T06:17:57Z',
    '2025-01-23T06:18:12Z',
    '2025-01-23T06:18:27Z',
  ],
  series: [
    { name: 'Dataset 1', values: [3, 10, 5, 2, 20, 30, 45] },
    { name: 'Dataset 2', values: [20, 15, 62, 172, 30, 50, 25] },
  ],
  categoryLabel: 'Date',
  valueLabel: 'Count',
  timeAxis: true,
};

const sparkArgs = {
  ...args,
  chartTitle: 'Spark line',
  description: 'Compact trend line with no axes, legend or chrome.',
  categories: [
    '2025-01-23T06:16:57Z',
    '2025-01-23T06:17:12Z',
    '2025-01-23T06:17:27Z',
    '2025-01-23T06:17:42Z',
    '2025-01-23T06:17:57Z',
    '2025-01-23T06:18:12Z',
    '2025-01-23T06:18:27Z',
  ],
  series: [{ name: 'Dataset 1', values: [0, 10, 5, 7, 13, 18, 15] }],
  categoryLabel: 'Time',
  valueLabel: 'Value',
  timeAxis: true,
  hideAxes: true,
  showLegend: false,
  showPoints: false,
  hideDescription: true,
  hideControls: true,
  noBorder: true,
  height: 120,
};

const thresholdBandArgs = {
  ...args,
  chartTitle: 'Line chart with threshold bands',
  description: 'Values against colour-coded severity thresholds.',
  categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current Week'],
  series: [
    { name: 'Dataset 1', values: [52, 88, 40, 75, 89] },
    { name: 'Dataset 2', values: [33, 70, 65, 90, 83] },
  ],
  categoryLabel: 'Time Period',
  valueLabel: 'Value',
  referenceBands: [
    { value: 20, color: '#CC1800' },
    { value: 40, color: '#CC1800' },
    { value: 60, color: '#CC1800' },
    { value: 80, color: '#FFD46A' },
    { value: 100, color: 'var(--kd-color-data-viz-divergent-02-positive-60)' },
  ],
};

const fanChartArgs = {
  ...args,
  chartTitle: 'Net income forecast',
  description:
    'Median projection with 1, 2 and 3 sigma confidence bands past Q1.2025.',
  categories: [
    '2023',
    'Q1.2024',
    'Q2.2024',
    'Q3.2024',
    'Q4.2024',
    'Q1.2025',
    'Q2.2025',
    'Q3.2025',
    'Q4.2025',
    'Q1.2026',
    'Q2.2026',
    'Q3.2026',
    'Q4.2026',
    '2027',
  ],
  series: [
    {
      name: 'Net Income',
      values: [
        18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 21.6, 21.6, 25.1, 23.3, 24.5, 24.6,
        26.7, 27.7,
      ],
      bands: [
        {
          lower: [
            18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 20.8, 20.4, 23.2, 20.9, 21.7,
            21.3, 23.2, 24.0,
          ],
          upper: [
            18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 22.2, 22.8, 26.8, 25.6, 27.2,
            27.8, 30.1, 31.4,
          ],
          opacity: 0.4,
        },
        {
          lower: [
            18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 20.4, 19.6, 21.6, 19.1, 20.0,
            19.0, 20.5, 21.2,
          ],
          upper: [
            18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 22.8, 23.6, 28.4, 27.4, 29.2,
            30.4, 32.8, 34.2,
          ],
          opacity: 0.3,
        },
        {
          lower: [
            18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 20.0, 18.8, 20.0, 17.3, 18.3,
            16.9, 18.0, 18.4,
          ],
          upper: [
            18.4, 18.7, 19.4, 22.6, 17.7, 18.3, 23.4, 24.4, 30.0, 29.2, 31.2,
            32.9, 35.4, 37.0,
          ],
          opacity: 0.2,
        },
      ],
    },
  ],
  categoryLabel: 'Period',
  valueLabel: 'Net income (m USD)',
  showLegend: false,
  showPoints: false,
  forecastFrom: 'Q1.2025',
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
    ?timeAxis=${args.timeAxis}
    ?hideAxes=${args.hideAxes}
    .referenceBands=${args.referenceBands}
    .forecastFrom=${args.forecastFrom}
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
  args: stackedArgs,
  render,
};

/** Smoothed curves with a gap where a value is missing. */
export const SmoothWithGap = {
  args: smoothWithGapArgs,
  render,
};

/** Line without point markers, for dense series. */
export const WithoutPoints = {
  args: withoutPointsArgs,
  render,
};

/** Smoothed curve through the same points. */
export const Curved = {
  args: curvedArgs,
  render,
};

/** Real time axis: points are spaced by elapsed time, not evenly by index. */
export const TimeScale = {
  args: timeScaleArgs,
  render,
};

/** Compact spark line with all chrome suppressed. */
export const Spark = {
  args: sparkArgs,
  render,
};

/** Horizontal threshold bands drawn behind the series. */
export const ThresholdBand = {
  args: thresholdBandArgs,
  render,
};

/** Median projection with nested confidence bands and a forecast divider. */
export const FanChart = {
  args: fanChartArgs,
  render,
};
