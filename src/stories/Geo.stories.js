import { html } from 'lit';
import '../components/chart';
import { topojson } from 'chartjs-chart-geo';
import capitals from './sampleData/us-capitals.json';

export default {
  title: 'Geo',
  component: 'kd-chart',
  decorators: [
    (story) => html` <div style="max-width: 800px;">${story()}</div> `,
  ],
  design: {
    type: 'figma',
    url: '',
  },
};

const usData = await fetch(
  'https://cdn.jsdelivr.net/npm/us-atlas/states-10m.json'
).then((r) => r.json());
const worldData = await fetch(
  'https://unpkg.com/world-atlas/countries-50m.json'
).then((r) => r.json());

const countries = topojson.feature(
  worldData,
  worldData.objects.countries
).features;
const nation = topojson.feature(usData, usData.objects.nation).features[0];
const states = topojson.feature(usData, usData.objects.states).features;

const args = {
  chartTitle: 'Geo Chart',
  description: 'Chart description.',
  labels: states.map((d) => d.properties.name),
  datasets: [
    {
      label: 'States',
      outline: nation,
      data: states.map((d) => ({ feature: d, value: Math.random() * 10 })),
    },
  ],
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      projection: {
        axis: 'x',
        projection: 'albersUsa',
      },
      color: {
        axis: 'x',
        quantize: 5,
        legend: {
          position: 'bottom-right',
          align: 'bottom',
        },
      },
    },
  },
  hideDescription: false,
  hideCaptions: false,
};

export const USChoropleth = {
  args,
  render: (args) => {
    return html`
      <kd-chart
        type="choropleth"
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

export const WorldChoropleth = {
  args: {
    ...args,
    labels: countries.map((d) => d.properties.name),
    datasets: [
      {
        label: 'Countries',
        data: countries.map((d) => ({ feature: d, value: Math.random() })),
      },
    ],
    options: {
      showOutline: true,
      showGraticule: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        projection: {
          axis: 'x',
          projection: 'equalEarth',
        },
      },
    },
  },
  render: (args) => {
    return html`
      <kd-chart
        type="choropleth"
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

export const BubbleMap = {
  args: {
    ...args,
    labels: capitals.map((d) => d.description),
    datasets: [
      {
        outline: states,
        showOutline: true,
        backgroundColor: 'steelblue',
        data: capitals.map((d) =>
          Object.assign(d, { value: Math.round(Math.random() * 10) })
        ),
      },
    ],
    options: {
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          align: 'top',
          formatter: (v) => {
            return v.description;
          },
        },
      },
      scales: {
        projection: {
          axis: 'x',
          projection: 'albersUsa',
        },
        size: {
          axis: 'x',
          size: [1, 20],
        },
      },
    },
  },
  render: (args) => {
    return html`
      <kd-chart
        type="bubbleMap"
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
