import { html } from 'lit';
import '../components/chart';
import argTypes from '../common/config/chartArgTypes';
import { topojson } from 'chartjs-chart-geo';
import capitals from './sampleData/us-capitals.json';

export default {
  title: 'Proof of Concept/Geo',
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
      hoverBorderWidth: 3,
      // hoverBackgroundColor: 'red',
      // hoverBorderColor: '#000000',
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
  hideDescription: false,
  hideCaptions: false,
  colorPalette: 'rainforest',
  noBorder: false,
  width: null,
  height: null,
};

export const USChoropleth = {
  args: {
    ...args,
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 12,
            weight: 'bold',
          },
          display: 'auto',
          align: 'end',
          anchor: 'end',
          formatter: function (value, context) {
            const label = context.dataset.data[context.dataIndex];
            return label.value.toFixed(3);
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
        ?noBorder=${args.noBorder}
        .options=${{ colorPalette: args.colorPalette, ...args.options }}
        .width=${args.width}
        .height=${args.height}
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
        data: countries.map((d) => ({ feature: d, value: Math.random() * 10 })),
        hoverBorderWidth: 3,
      },
    ],
    options: {
      // plugins: {
      //   datalabels: {
      //     font: {
      //       size: 9,
      //       weight: 'bold',
      //     },
      //     display: 'auto',
      //     align: 'end',
      //     anchor: 'end',
      //     formatter: function (value, context) {
      //       const label = context.dataset.data[context.dataIndex];
      //       return label.feature.properties.name;
      //       //return label.value.toFixed(3);
      //     },
      //   },
      // },
      showOutline: true,
      showGraticule: false,
      scales: {
        projection: {
          axis: 'x',
          // projection: 'equalEarth',
          projection: 'equirectangular', // To flattern world choropleth
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
        hoverBorderWidth: 3,
      },
    ],
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 12,
            weight: 'bold',
          },
          display: 'auto',
          anchor: function (context) {
            const item = context.dataset.data[context.dataIndex];
            return item.value < 20 ? 'end' : 'center';
          },
          align: function (context) {
            const item = context.dataset.data[context.dataIndex];
            return item.value < 20 ? 'end' : 'center';
          },
          formatter: function (value, context) {
            const label = context.dataset.data[context.dataIndex];
            return label.value;
          },
        },
      },
      scales: {
        projection: {
          axis: 'x',
          projection: 'albersUsa',
        },
      },
    },
    colorPalette: 'default',
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
