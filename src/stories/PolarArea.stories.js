import { html } from 'lit';
import '../components/chart';

export default {
  title: 'Future/Polar Area',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 600px;">${story()}</div> `,
  ],
  design: {
    type: 'figma',
    url: '',
  },
};

const args = {
  chartTitle: 'Polar Area Chart',
  description: 'Chart description.',
  labels: ['Blue', 'Red', 'Orange', 'Yellow', 'Green', 'Purple'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [12, 19, 3, 5, 2, 3],
    },
  ],
  hideDescription: false,
  hideCaptions: false,
};

export const PolarArea = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="polarArea"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        .options=${args.options}
      ></kd-chart>
    `;
  },
};
