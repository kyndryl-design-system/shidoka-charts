import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const type = 'kdDendrogram';

/**
 * Configuration for the kd-dendrogram plugin used by
 * `<kd-chart type="kdDendrogram">`. Tree node data is sourced from the
 * first dataset's `data` array — `[{ id?, name, parent?, icon? }]`.
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
      kdDendrogram: { _enabled: true },
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
            ctx.chart.options?.plugins?.kdDendrogram?.orientation || 'vertical';
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
