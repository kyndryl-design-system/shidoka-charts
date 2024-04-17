import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import { topojson } from 'chartjs-chart-geo';
import capitals from './sampleData/us-capitals.json';
import nationCapitals from './sampleData/nation-capitals.json';

export default {
  title: 'Third Party Charts/Geo',
  component: 'kd-chart',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=1652%3A2709&mode=dev',
    },
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
  hideDescription: false,
  hideCaptions: false,
  hideHeader: false,
  hideControls: false,
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
        data: countries.map((d) => ({
          feature: d,
          value: d.properties.name.length * 10,
        })),
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
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const CountryChoropleth = {
  args: {
    ...args,
    labels: states.map((d) => d.properties.name),
    datasets: [
      {
        label: 'States',
        outline: nation,
        data: states.map((d) => ({
          feature: d,
          value: d.properties.name.length * 10,
        })),
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
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const WorldBubbleMap = {
  args: {
    ...args,
    labels: nationCapitals.map((d) => d.description),
    datasets: [
      {
        outline: countries,
        label: 'Countries',
        data: nationCapitals.map((d) =>
          Object.assign(d, { value: d.description.length * 10 })
        ),
      },
    ],
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
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};

export const CountryBubbleMap = {
  args: {
    ...args,
    labels: capitals.map((d) => d.description),
    datasets: [
      {
        outline: states,
        data: capitals.map((d) =>
          Object.assign(d, { value: d.description.length * 10 })
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
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `;
  },
};
