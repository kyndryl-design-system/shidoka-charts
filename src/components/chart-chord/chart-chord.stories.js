import { html } from 'lit';
import '../../charts/chord';

export default {
  title: 'D3/Chord',
  component: 'kd-chart-chord',
  decorators: [
    (story) => html` <div style="max-width: 720px;">${story()}</div> `,
  ],
  argTypes: {
    nodes: { control: 'object', description: 'Endpoints around the circle.' },
    matrix: { control: 'object', description: 'Square flow matrix.' },
    valueLabel: { control: 'text' },
    sourceLabel: { control: 'text' },
    targetLabel: { control: 'text' },
    showLabels: { control: 'boolean' },
    padAngle: { control: { type: 'range', min: 0, max: 0.2, step: 0.01 } },
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
        'Unstable SVG-native attribute overrides applied to the generated elements.',
    },
  },
};

const args = {
  chartTitle: 'Cross-region service traffic',
  description:
    'API calls per minute between hosting regions, aggregated over the last 24 hours.',
  nodes: [
    { label: 'Americas' },
    { label: 'EMEA' },
    { label: 'APAC' },
    { label: 'Japan' },
    { label: 'India' },
  ],
  // Source region by target region.
  matrix: [
    [0, 2840, 1120, 340, 980],
    [2210, 0, 760, 180, 1450],
    [1310, 690, 0, 1620, 870],
    [280, 210, 1480, 0, 190],
    [1040, 1610, 930, 160, 0],
  ],
  valueLabel: 'Calls per minute',
  sourceLabel: 'From region',
  targetLabel: 'To region',
  showLabels: true,
  padAngle: 0.04,
  height: 680,
  colorPalette: 'categorical',
  hideDescription: false,
  hideControls: false,
  noBorder: false,
  unsafeNativeOptions: undefined,
};

export const Chord = {
  args,
  render: (args) => {
    return html`
      <kd-chart-chord
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .nodes=${args.nodes}
        .matrix=${args.matrix}
        .valueLabel=${args.valueLabel}
        .sourceLabel=${args.sourceLabel}
        .targetLabel=${args.targetLabel}
        .showLabels=${args.showLabels}
        .padAngle=${args.padAngle}
        .height=${args.height}
        .colorPalette=${args.colorPalette}
        ?hideDescription=${args.hideDescription}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .unsafeNativeOptions=${args.unsafeNativeOptions}
      ></kd-chart-chord>
    `;
  },
};
