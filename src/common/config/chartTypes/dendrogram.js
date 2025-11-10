import { Chart, registerables } from 'chart.js';
import {
  DendrogramController,
  GraphController,
  EdgeLine,
} from 'chartjs-chart-graph';
import { hierarchy } from 'd3-hierarchy';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';
import { getComputedColorPalette } from '../colorPalettes';

Chart.register(
  ...registerables,
  DendrogramController,
  GraphController,
  EdgeLine
);

export const type = 'dendrogram';
const defaultBorderWidth = 2;

export const options = (ctx) => {
  const borderColor = getTokenThemeVal('--kd-color-border-level-tertiary');
  const colorPalette = getComputedColorPalette(
    ctx.options?.colorPalette || 'categorical'
  );
  const nodeColor = colorPalette[0];

  return {
    responsive: true,
    maintainAspectRatio: true,
    tree: {
      mode: 'dendrogram',
      orientation: 'horizontal',
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        enabled: true,
        callbacks: {
          title: () => '',
          label: (ctx) => ctx.raw?.name || ctx.raw?.data?.name || '',
          labelColor: () => {
            return {
              borderColor: borderColor,
              backgroundColor: nodeColor,
              borderWidth: 1,
            };
          },
        },
      },
    },
    elements: {
      line: {
        borderColor,
        borderWidth: defaultBorderWidth,
      },
      point: {
        radius: 6,
        backgroundColor: nodeColor,
        borderColor,
        borderWidth: defaultBorderWidth,
      },
    },
    scales: undefined,
    animation: {
      duration: 100,
      easing: 'easeInOutQuart',
      delay: (context) => {
        const dataIndex = context?.dataIndex || 0;
        const depth = context?.raw?.depth || 0;
        return depth * 300 + dataIndex * 50;
      },
      scale: {
        duration: 1000,
        from: 0,
        to: 1,
        easing: 'easeOutBack',
      },
      opacity: {
        duration: 800,
        from: 0,
        to: 1,
        easing: 'easeInQuart',
      },
      x: {
        duration: 1500,
        easing: 'easeInOutQuart',
      },
      y: {
        duration: 1500,
        easing: 'easeInOutQuart',
      },

      borderWidth: {
        duration: 1000,
        from: 0,
        to: 2,
        easing: 'easeOutQuad',
      },
    },
  };
};

export const datasetOptions = (ctx) => {
  const borderColor = getTokenThemeVal('--kd-color-border-level-tertiary');
  const colorPalette = getComputedColorPalette(
    ctx.options?.colorPalette || 'categorical'
  );
  const nodeColor = colorPalette[0];
  return {
    borderWidth: defaultBorderWidth,
    showLine: true,
    fill: false,
    pointBackgroundColor: nodeColor,
    pointBorderColor: borderColor,
    pointBorderWidth: defaultBorderWidth,
    pointRadius: 6,
    borderColor: borderColor,
    backgroundColor: nodeColor,
    tension: 0, // 0 = straight lines, 1 = maximum curve
  };
};

export const preprocess = (datasets) => {
  return datasets.map((ds, index) => {
    if (!ds.tree) {
      return ds;
    }
    // if already processed
    if (ds.tree.data) {
      return ds;
    }

    try {
      // Create d3 hierarchy
      const rootNode = hierarchy(ds.tree);

      // chartjs-chart-graph expects specific properties on nodes
      let nodeIndex = 0;
      rootNode.each((node) => {
        // Set index property that chartjs-chart-graph expects
        node.index = nodeIndex++;

        // Ensure the node has an ID
        if (!node.data.id) {
          node.data.id = node.data.name || `node-${node.index}`;
        }

        // Set additional properties that may be required
        node.id = node.data.id;
        node.name = node.data.name || node.data.id;
      });

      const descendants = rootNode.descendants();

      return {
        ...ds,
        tree: rootNode,
        data: descendants,
      };
    } catch (error) {
      console.error(`Error processing tree for dataset ${index}:`, error);
      return ds;
    }
  });
};
