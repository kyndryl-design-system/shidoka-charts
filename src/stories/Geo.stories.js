import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import { topojson } from 'chartjs-chart-geo';
import capitals from './sampleData/us-capitals.json';

export default {
  title: 'Third Party Charts/Geo',
  component: 'kd-chart',
  design: {
    type: 'figma',
    url: '',
  },
  argTypes: argTypes,
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
    scales: {
      projection: {
        axis: 'x',
        projection: 'naturalEarth1',
      },
    },
  },
  hideDescription: false,
  hideCaptions: false,
  colorPalette: 'sequential01',
  noBorder: false,
  width: null,
  height: null,
};

export const WorldChoropleth = {
  args: {
    ...args,
    labels: countries.map((d) => d.properties.name),
    datasets: [
      {
        label: 'Countries',
        data: countries.map((d) => ({ feature: d, value: Math.random() * 10 })),
      },
    ],
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
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const USChoropleth = {
  args: {
    ...args,
    options: {
      scales: {
        projection: {
          axis: 'x',
          projection: 'albersUsa',
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
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
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

        data: capitals.map((d) =>
          Object.assign(d, { value: Math.round(Math.random() * 100) })
        ),
      },
    ],
    options: {
      scales: {
        projection: {
          axis: 'x',
          projection: 'albersUsa',
        },
      },
    },
    colorPalette: 'categorical',
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
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};
