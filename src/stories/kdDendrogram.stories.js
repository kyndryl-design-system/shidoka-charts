import { html } from 'lit';
import '../components/chart/chart.js';
import argTypes, { hideUnusedControls } from '../common/config/chartArgTypes';

import folderIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/folder.svg';
import userIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import settingsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';
import chartIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/analytics.svg';
import tableIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/table-view.svg';
import downloadIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/download.svg';

/**
 * **KD Dendrogram** — a from-scratch Chart.js plugin loaded by
 * `<kd-chart type="kdDendrogram">`. Click any node to expand or collapse
 * its subtree (animated). Hover a node for a scale-up effect.
 *
 * See the *Docs* tab for the full plugin configuration reference.
 */
export default {
  title: 'Custom Charts/Dendrogram',
  component: 'kd-chart',
  argTypes: {
    ...argTypes,
    useHtmlLegend: hideUnusedControls,
  },
};

const basicTree = [
  { id: 'root', name: 'Root' },
  { id: 'a', name: 'Branch A', parent: 'root' },
  { id: 'b', name: 'Branch B', parent: 'root' },
  { id: 'c', name: 'Branch C', parent: 'root' },
  { id: 'a1', name: 'A.1', parent: 'a' },
  { id: 'a2', name: 'A.2', parent: 'a' },
  { id: 'b1', name: 'B.1', parent: 'b' },
  { id: 'b2', name: 'B.2', parent: 'b' },
  { id: 'b3', name: 'B.3', parent: 'b' },
  { id: 'c1', name: 'C.1', parent: 'c' },
  { id: 'c2', name: 'C.2', parent: 'c' },
];

const iconTree = [
  { id: 'org', name: 'Org', icon: folderIcon },
  { id: 'people', name: 'People', parent: 'org', icon: userIcon },
  { id: 'ops', name: 'Ops', parent: 'org', icon: settingsIcon },
  { id: 'insights', name: 'Insights', parent: 'org', icon: chartIcon },
  { id: 'teamA', name: 'Team A', parent: 'people', icon: userIcon },
  { id: 'teamB', name: 'Team B', parent: 'people', icon: userIcon },
  { id: 'pipelines', name: 'Pipelines', parent: 'ops', icon: settingsIcon },
  { id: 'reports', name: 'Reports', parent: 'insights', icon: tableIcon },
  { id: 'exports', name: 'Exports', parent: 'insights', icon: downloadIcon },
];

/* ------------------------------------------------------------------ */
/* Stories — each story has its own visible render code (no template) */
/* ------------------------------------------------------------------ */

export const Vertical = {
  args: {
    colorPalette: 'categorical',
    chartTitle: 'Vertical Dendrogram',
    labels: basicTree.map((n) => n.name),
    datasets: [{ label: 'Tree', data: basicTree }],
    options: {
      plugins: {
        kdDendrogram: { orientation: 'vertical', direction: 'none' },
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="kdDendrogram"
      .chartTitle=${args.chartTitle}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{ colorPalette: args.colorPalette, ...args.options }}
    ></kd-chart>
  `,
};

export const Horizontal = {
  args: {
    colorPalette: 'categorical',
    chartTitle: 'Horizontal Dendrogram',
    labels: basicTree.map((n) => n.name),
    datasets: [{ label: 'Tree', data: basicTree }],
    options: {
      plugins: {
        kdDendrogram: { orientation: 'horizontal', direction: 'none' },
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="kdDendrogram"
      .chartTitle=${args.chartTitle}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{ colorPalette: args.colorPalette, ...args.options }}
    ></kd-chart>
  `,
};

export const Radial = {
  args: {
    colorPalette: 'categorical',
    chartTitle: 'Radial Dendrogram',
    labels: basicTree.map((n) => n.name),
    datasets: [{ label: 'Tree', data: basicTree }],
    options: {
      plugins: {
        kdDendrogram: { orientation: 'radial', direction: 'none' },
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="kdDendrogram"
      .chartTitle=${args.chartTitle}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{ colorPalette: args.colorPalette, ...args.options }}
    ></kd-chart>
  `,
};

export const WithIcons = {
  name: 'With Shidoka Icons',
  args: {
    colorPalette: 'categorical',
    chartTitle: 'With Icons',
    labels: iconTree.map((n) => n.name),
    datasets: [{ label: 'Tree', data: iconTree }],
    options: {
      plugins: {
        kdDendrogram: {
          orientation: 'vertical',
          direction: 'none',
          nodeRadius: 18,
          iconSize: 20,
        },
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="kdDendrogram"
      .chartTitle=${args.chartTitle}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{ colorPalette: args.colorPalette, ...args.options }}
    ></kd-chart>
  `,
};

export const ForwardArrows = {
  name: 'Forward Arrows (parent → child)',
  args: {
    colorPalette: 'categorical',
    chartTitle: 'Forward Arrows',
    labels: basicTree.map((n) => n.name),
    datasets: [{ label: 'Tree', data: basicTree }],
    options: {
      plugins: {
        kdDendrogram: { orientation: 'vertical', direction: 'forward' },
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="kdDendrogram"
      .chartTitle=${args.chartTitle}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{ colorPalette: args.colorPalette, ...args.options }}
    ></kd-chart>
  `,
};

export const ReverseArrows = {
  name: 'Reverse Arrows (child → parent)',
  args: {
    colorPalette: 'categorical',
    chartTitle: 'Reverse Arrows',
    labels: basicTree.map((n) => n.name),
    datasets: [{ label: 'Tree', data: basicTree }],
    options: {
      plugins: {
        kdDendrogram: { orientation: 'vertical', direction: 'reverse' },
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="kdDendrogram"
      .chartTitle=${args.chartTitle}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{ colorPalette: args.colorPalette, ...args.options }}
    ></kd-chart>
  `,
};

export const BothArrows = {
  name: 'Bi-directional Arrows',
  args: {
    colorPalette: 'categorical',
    chartTitle: 'Bi-directional Arrows',
    labels: iconTree.map((n) => n.name),
    datasets: [{ label: 'Tree', data: iconTree }],
    options: {
      plugins: {
        kdDendrogram: {
          orientation: 'horizontal',
          direction: 'both',
          nodeRadius: 18,
          iconSize: 20,
        },
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="kdDendrogram"
      .chartTitle=${args.chartTitle}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{ colorPalette: args.colorPalette, ...args.options }}
    ></kd-chart>
  `,
};

const perNodeDirectionTree = [
  { id: 'server', name: 'Server' },
  { id: 'auth', name: 'Auth Service', parent: 'server', direction: 'forward' },
  { id: 'data', name: 'Data Service', parent: 'server', direction: 'both' },
  { id: 'logging', name: 'Logging', parent: 'server', direction: 'reverse' },
  { id: 'oauth', name: 'OAuth', parent: 'auth', direction: 'forward' },
  { id: 'ldap', name: 'LDAP', parent: 'auth', direction: 'forward' },
  { id: 'readDb', name: 'Read DB', parent: 'data', direction: 'forward' },
  { id: 'writeDb', name: 'Write DB', parent: 'data', direction: 'reverse' },
  { id: 'cloudLogs', name: 'Cloud Logs', parent: 'logging', direction: 'both' },
];

export const PerNodeDirection = {
  name: 'Per-node Arrow Direction',
  args: {
    colorPalette: 'categorical',
    chartTitle: 'Per-node Arrow Direction',
    labels: perNodeDirectionTree.map((n) => n.name),
    datasets: [{ label: 'Tree', data: perNodeDirectionTree }],
    options: {
      plugins: {
        kdDendrogram: { orientation: 'vertical', direction: 'none' },
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="kdDendrogram"
      .chartTitle=${args.chartTitle}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{ colorPalette: args.colorPalette, ...args.options }}
    ></kd-chart>
  `,
};

export const WithDatalabels = {
  args: {
    colorPalette: 'categorical',
    chartTitle: 'Dendrogram with Datalabels',
    labels: basicTree.map((n) => n.name),
    datasets: [{ label: 'Tree', data: basicTree }],
    options: {
      plugins: {
        kdDendrogram: { orientation: 'vertical', direction: 'none' },
        datalabels: { display: true },
      },
    },
  },
  render: (args) => html`
    <kd-chart
      type="kdDendrogram"
      .chartTitle=${args.chartTitle}
      .labels=${args.labels}
      .datasets=${args.datasets}
      .options=${{ colorPalette: args.colorPalette, ...args.options }}
    ></kd-chart>
  `,
};
