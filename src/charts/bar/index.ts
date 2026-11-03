import { KDChartBar } from '../../components/chart-bar/chart-bar';

/**
 * Registration entry for `kd-chart-bar`.
 *
 * Importing this module registers exactly one custom element and pulls in the
 * ECharts bar bundle. No other chart engine is reachable from here.
 */

export const KD_CHART_BAR_TAG = 'kd-chart-bar';

// Guarded so the entry can be imported in a non-DOM environment and so a
// duplicate import never throws.
if (
  typeof customElements !== 'undefined' &&
  !customElements.get(KD_CHART_BAR_TAG)
) {
  customElements.define(KD_CHART_BAR_TAG, KDChartBar);
}

export { KDChartBar };
export type { CartesianSeries, BarModel } from '../../components/chart-bar/bar.types';
