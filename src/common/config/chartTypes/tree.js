import { Chart, registerables } from 'chart.js';
import {
  DendrogramController,
  TreeController,
  GraphController,
  EdgeLine,
} from 'chartjs-chart-graph';
import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';
import { getComputedColorPalette } from '../colorPalettes';

Chart.register(
  ...registerables,
  DendrogramController,
  TreeController,
  GraphController,
  EdgeLine
);

export const type = 'tree';
const defaultBorderWidth = 2;

export const options = (ctx) => {
  const borderColor = getTokenThemeVal('--kd-color-border-level-tertiary');
  const colorPalette = getComputedColorPalette(
    ctx.options?.colorPalette || 'categorical'
  );
  const nodeColor = colorPalette[0];

  return {
    plugins: {
      legend: { display: false },
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
    animation: {
      duration: 100,
      easing: 'easeInOutQuart',
      delay: (context) => {
        const dataIndex = context?.dataIndex || 0;
        const depth = context?.raw?.depth || 0;
        return depth * 300 + dataIndex * 50;
      },
      scale: {
        duration: 100,
        from: 0,
        to: 1,
        easing: 'easeOutBack',
      },
      opacity: {
        duration: 400,
        from: 0,
        to: 1,
        easing: 'easeInQuart',
      },
      x: {
        duration: 500,
        easing: 'easeInOutQuart',
      },
      y: {
        duration: 500,
        easing: 'easeInOutQuart',
      },

      borderWidth: {
        duration: 800,
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
    tension: 0.3, // 0 = straight lines, 1 = maximum curve
  };
};
