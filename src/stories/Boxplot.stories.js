import { html } from 'lit';

export default {
  title: 'Third Party Charts/Boxplot & Violin Plot/Boxplot',
  component: 'kd-chart',
  argTypes: {
    colorPalette: {
      options: ['categorical', 'sequential', 'divergent'],
      control: { type: 'select' },
      defaultValue: 'categorical',
    },
    chartOrientation: {
      options: ['vertical', 'horizontal'],
      control: { type: 'select' },
      defaultValue: 'vertical',
    },
  },
};

const generateRandomData = (count, min, max, outliers = 0) => {
  const values = Array.from({ length: count }, () =>
    Math.floor(Math.random() * (max - min) + min)
  ).sort((a, b) => a - b);

  if (outliers > 0) {
    for (let i = 0; i < outliers; i++) {
      if (Math.random() > 0.5) {
        values.push(max + Math.floor(Math.random() * max * 0.5));
      } else {
        values.unshift(
          Math.max(0, min - Math.floor(Math.random() * min * 0.5))
        );
      }
    }
  }

  return values;
};

const Template = (args) => {
  return html`
    <kd-chart
      .chartTitle=${args.chartTitle}
      .description=${args.description}
      type="boxplot"
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{
        indexAxis: args.chartOrientation === 'horizontal' ? 'y' : 'x',
        colorPalette: args.colorPalette,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Categories',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Values',
            },
          },
        },
      }}
    ></kd-chart>
  `;
};

export const Default = Template.bind({});
Default.args = {
  chartTitle: 'Boxplot Example',
  description: 'Boxplot chart with two datasets',
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [
        generateRandomData(30, 10, 100, 2),
        generateRandomData(30, 20, 80, 1),
        generateRandomData(30, 30, 120, 3),
        generateRandomData(30, 40, 90, 2),
        generateRandomData(30, 20, 70, 1),
        generateRandomData(30, 10, 60, 2),
        generateRandomData(30, 30, 80, 1),
      ],
    },
    {
      label: 'Dataset 2',
      data: [
        generateRandomData(30, 20, 120, 1),
        generateRandomData(30, 10, 100, 2),
        generateRandomData(30, 20, 90, 1),
        generateRandomData(30, 30, 110, 3),
        generateRandomData(30, 40, 80, 2),
        generateRandomData(30, 20, 90, 1),
        generateRandomData(30, 30, 70, 0),
      ],
    },
  ],
  chartOrientation: 'vertical',
  colorPalette: 'categorical',
};

export const Horizontal = Template.bind({});
Horizontal.args = {
  ...Default.args,
  chartTitle: 'Horizontal Box Plot Example',
  description: 'Horizontal box plot chart with two datasets',
  chartOrientation: 'horizontal',
};
