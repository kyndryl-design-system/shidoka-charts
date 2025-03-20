import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import { topojson } from 'chartjs-chart-geo';
import capitals from './sampleData/us-capitals.json';
import nationCapitals from './sampleData/nation-capitals.json';
import usData from './sampleData/states-10m.json';
import worldData from './sampleData/countries-50m.json';

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
        label: 'Population',
        data: countries.map((d) => ({
          feature: d,
          value: d.properties.name.length * 10,
        })),
      },
    ],
    options: {
      scales: {
        x: {
          title: {
            text: 'Country',
          },
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

export const CountryChoropleth = {
  args: {
    ...args,
    labels: states.map((d) => d.properties.name),
    datasets: [
      {
        label: 'Population',
        outline: nation,
        data: states.map((d) => {
          return {
            feature: d,
            value: d.properties.name.length * 10,
          };
        }),
      },
    ],
    options: {
      scales: {
        projection: {
          axis: 'x',
          projection: 'albersUsa',
        },
        x: {
          title: {
            text: 'State',
          },
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
        label: 'Population',
        outline: countries,
        data: nationCapitals.map((d) =>
          Object.assign(d, { value: d.description.length * 10 })
        ),
      },
    ],
    options: {
      scales: {
        x: {
          title: {
            text: 'Capital City',
          },
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

export const CountryBubbleMap = {
  args: {
    ...args,
    labels: capitals.map((d) => d.description),
    datasets: [
      {
        label: 'Population',
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
        x: {
          title: {
            text: 'Capital City',
          },
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
