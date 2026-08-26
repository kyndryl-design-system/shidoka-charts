import { html } from 'lit';
import '../../charts/tree';

export default {
  title: 'Apache ECharts/Tree',
  component: 'kd-chart-tree',
  decorators: [
    (story) => html` <div style="max-width: 960px;">${story()}</div> `,
  ],
  argTypes: {
    nodes: {
      control: 'object',
      description: 'Semantic hierarchy of nodes.',
    },
    categoryLabel: { control: 'text' },
    valueLabel: { control: 'text' },
    showLabels: { control: 'boolean' },
    orientation: {
      control: 'inline-radio',
      options: ['LR', 'RL', 'TB', 'BT'],
    },
    layout: {
      control: 'inline-radio',
      options: ['orthogonal', 'radial'],
    },
    initialTreeDepth: {
      control: { type: 'number', min: -1, max: 6, step: 1 },
      description:
        'Depth expanded on first render. `-1` expands every level; `1` shows only the root until nodes are clicked.',
    },
    expandAndCollapse: {
      control: 'boolean',
      description: 'Click nodes to expand and collapse branches.',
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

const taxonomyNodes = [
  {
    label: 'Incidents',
    children: [
      {
        label: 'Availability',
        children: [
          { label: 'Regional outage', value: 3 },
          { label: 'Dependency failure', value: 8 },
          { label: 'Capacity saturation', value: 5 },
        ],
      },
      {
        label: 'Security',
        children: [
          { label: 'Credential leak', value: 2 },
          { label: 'Policy violation', value: 6 },
        ],
      },
      {
        label: 'Data quality',
        children: [
          { label: 'Schema drift', value: 4 },
          { label: 'Replication lag', value: 7 },
        ],
      },
    ],
  },
];

const taxonomyArgs = {
  chartTitle: 'Incident response taxonomy',
  description:
    'Severity classes and downstream owners. Click a branch to expand or collapse it.',
  nodes: taxonomyNodes,
  categoryLabel: 'Category',
  valueLabel: 'Tickets',
  showLabels: true,
  orientation: 'LR',
  layout: 'orthogonal',
  initialTreeDepth: 2,
  expandAndCollapse: true,
  height: 480,
  colorPalette: 'categorical',
  hideDescription: false,
  hideControls: false,
  noBorder: false,
  unsafeNativeOptions: undefined,
};

const organizationArgs = {
  chartTitle: 'Platform organization',
  description:
    'Engineering teams and their product areas. Click a branch to expand or collapse it.',
  nodes: [
    {
      label: 'Platform engineering',
      children: [
        {
          label: 'Runtime',
          children: [
            { label: 'Kubernetes', value: 42 },
            { label: 'Service mesh', value: 18 },
            { label: 'Observability agents', value: 11 },
          ],
        },
        {
          label: 'Data',
          children: [
            { label: 'Streaming', value: 24 },
            { label: 'Warehouse', value: 31 },
            { label: 'Catalog', value: 9 },
          ],
        },
        {
          label: 'Security',
          children: [
            { label: 'Identity', value: 16 },
            { label: 'Policy automation', value: 12 },
          ],
        },
      ],
    },
    {
      label: 'Product engineering',
      children: [
        {
          label: 'Experience',
          children: [
            { label: 'Design systems', value: 14 },
            { label: 'Web apps', value: 28 },
          ],
        },
        {
          label: 'Growth',
          children: [
            { label: 'Onboarding', value: 10 },
            { label: 'Lifecycle messaging', value: 7 },
          ],
        },
      ],
    },
    {
      label: 'Corporate IT',
      children: [
        { label: 'Endpoint management', value: 19 },
        { label: 'Collaboration tooling', value: 13 },
      ],
    },
  ],
  categoryLabel: 'Team',
  valueLabel: 'Headcount',
  showLabels: true,
  orientation: 'LR',
  layout: 'orthogonal',
  initialTreeDepth: 2,
  expandAndCollapse: true,
  height: 480,
  colorPalette: 'categorical',
  hideDescription: false,
  hideControls: false,
  noBorder: false,
  unsafeNativeOptions: undefined,
};

const render = (args) => html`
  <kd-chart-tree
    .chartTitle=${args.chartTitle}
    .description=${args.description}
    .nodes=${args.nodes}
    .categoryLabel=${args.categoryLabel}
    .valueLabel=${args.valueLabel}
    .showLabels=${args.showLabels}
    .orientation=${args.orientation}
    .layout=${args.layout}
    .initialTreeDepth=${args.initialTreeDepth}
    ?expandAndCollapse=${args.expandAndCollapse}
    .height=${args.height}
    .colorPalette=${args.colorPalette}
    ?hideDescription=${args.hideDescription}
    ?hideControls=${args.hideControls}
    ?noBorder=${args.noBorder}
    .unsafeNativeOptions=${args.unsafeNativeOptions}
  ></kd-chart-tree>
`;

/** Classification hierarchy with expandable branches. */
export const Taxonomy = {
  args: taxonomyArgs,
  render,
};

/** Org-style hierarchy using the same orthogonal tree layout. */
export const Organization = {
  args: organizationArgs,
  render,
};

/**
 * Radial layout with only the root expanded initially. Every branch can still
 * be opened or closed by clicking its node.
 */
export const RadialCollapsed = {
  args: {
    ...taxonomyArgs,
    description: 'The chart starts collapsed; click nodes to explore.',
    layout: 'radial',
    initialTreeDepth: 1,
    height: 520,
  },
  render,
};
