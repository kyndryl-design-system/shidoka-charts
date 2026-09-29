import { html } from 'lit';
import '../../charts/sunburst';

export default {
  title: 'Apache ECharts/Sunburst',
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
    labelStrategy: {
      control: 'inline-radio',
      options: ['inline', 'constrained'],
      description:
        'How labels behave when a sector is too narrow to hold them. `constrained` truncates them and moves the full label and value into a tooltip.',
    },
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
  labelStrategy: 'inline',
  innerRadiusRatio: 0.25,
  height: 420,
  colorPalette: 'categorical',
  hideDescription: false,
  hideControls: false,
  noBorder: false,
  unsafeNativeOptions: undefined,
};

const render = (args) => html`
  <kd-chart-sunburst
    .chartTitle=${args.chartTitle}
    .description=${args.description}
    .nodes=${args.nodes}
    .categoryLabel=${args.categoryLabel}
    .valueLabel=${args.valueLabel}
    .showLabels=${args.showLabels}
    .labelStrategy=${args.labelStrategy}
    .innerRadiusRatio=${args.innerRadiusRatio}
    .height=${args.height}
    .colorPalette=${args.colorPalette}
    ?hideDescription=${args.hideDescription}
    ?hideControls=${args.hideControls}
    ?noBorder=${args.noBorder}
    .unsafeNativeOptions=${args.unsafeNativeOptions}
  ></kd-chart-sunburst>
`;

export const Sunburst = {
  args,
  render,
};

/**
 * Long names in thin sectors. Labels that do not fit are truncated, or replaced
 * by a marker when nothing readable fits, and the full name and value stay
 * available from a `kyn-tooltip` anchor that is reachable by keyboard.
 */
export const ConstrainedLabels = {
  args: {
    ...args,
    chartTitle: 'Support tickets by product area and root cause',
    description:
      'Tickets closed last quarter, grouped by the area that owns the fix.',
    nodes: [
      {
        label: 'Identity and access management',
        children: [
          { label: 'Single sign-on session expiry', value: 184 },
          { label: 'Multi-factor enrollment failure', value: 96 },
          { label: 'Directory synchronization lag', value: 41 },
          { label: 'Role assignment propagation', value: 22 },
        ],
      },
      {
        label: 'Data platform',
        children: [
          { label: 'Warehouse query timeout', value: 133 },
          { label: 'Ingestion schema drift', value: 78 },
          { label: 'Replication checkpoint reset', value: 27 },
          { label: 'Retention policy conflict', value: 14 },
        ],
      },
      {
        label: 'Observability',
        children: [
          { label: 'Alert routing misconfiguration', value: 89 },
          { label: 'Dashboard permission scope', value: 35 },
          { label: 'Trace sampling gap', value: 18 },
        ],
      },
      {
        label: 'Networking',
        children: [
          { label: 'Egress rate limiting', value: 64 },
          { label: 'Certificate rotation', value: 31 },
          { label: 'Private endpoint resolution', value: 12 },
        ],
      },
    ],
    categoryLabel: 'Root cause',
    valueLabel: 'Tickets',
    labelStrategy: 'constrained',
    innerRadiusRatio: 0.2,
    height: 460,
  },
  render,
};
