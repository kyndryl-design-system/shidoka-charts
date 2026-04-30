import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';
import { getComputedColorPalette } from '../colorPalettes';

export const type = 'customDendrogram';

/**
 * Configuration for the custom (from-scratch) dendrogram plugin used by
 * `<kd-chart type="customDendrogram">`. Tree node data is sourced from the
 * first dataset's `data` array — `[{ name, parent?, icon? }]` — or from
 * `options.plugins.customDendrogram.tree`.
 *
 * Labels are rendered by chartjs-plugin-datalabels using the same theme
 * tokens used everywhere else, so they remain readable on dark backgrounds.
 */
export const options = () => {
  const labelBg = getTokenThemeVal('--kd-color-background-container-secondary');
  const labelFg = getTokenThemeVal('--kd-color-text-level-primary');

  return {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    animation: false, // plugin owns its own animation timeline
    plugins: {
      customDendrogram: { _enabled: true },
      legend: { display: false },
      tooltip: {
        enabled: true,
        displayColors: true,
        callbacks: {
          title: () => '',
          label: (ctx) => {
            const val = ctx.raw;
            return val && val.name ? ' ' + val.name : '';
          },
          labelColor: (ctx) => {
            const pluginOpts =
              ctx.chart.options?.plugins?.customDendrogram || {};
            const key =
              ctx.chart.options?.colorPalette ||
              pluginOpts.paletteKey ||
              'categorical';
            let colors;
            try {
              colors = pluginOpts.palette || getComputedColorPalette(key);
            } catch {
              colors = ['#3a5cff'];
            }
            const raw = ctx.raw;
            const branch =
              raw && typeof raw._branch === 'number' ? raw._branch : 0;
            const color = colors[branch % colors.length] || colors[0];
            return {
              borderColor: color,
              backgroundColor: color,
            };
          },
        },
      },
      datalabels: {
        display: false,
        color: labelFg,
        backgroundColor: labelBg,
        borderRadius: 2,
        padding: { top: 2, bottom: 2, left: 4, right: 4 },
        font: { size: 11, weight: '500' },
        anchor: 'center',
        align: (ctx) => {
          const ori =
            ctx.chart.options?.plugins?.customDendrogram?.orientation ||
            'vertical';
          return ori === 'horizontal' ? 'right' : 'bottom';
        },
        offset: 14,
        clamp: true,
        clip: false,
        formatter: (value) => (value && value.name) || '',
      },
    },
    layout: {
      padding: { bottom: 20 },
    },
    scales: {
      x: { display: false, min: -0.02, max: 1.02 },
      y: { display: false, min: -0.02, max: 1.06, reverse: true },
    },
  };
};

export const datasetOptions = () => ({});
