import { KDChartPie } from '../../components/chart-pie/chart-pie';

/**
 * Registration entry for `kd-chart-pie`.
 *
 * Importing this module registers exactly one custom element and pulls in the
 * ECharts pie bundle. No other chart engine is reachable from here.
 */

export const KD_CHART_PIE_TAG = 'kd-chart-pie';

// Guarded so the entry can be imported in a non-DOM environment and so a
// duplicate import never throws.
if (
  typeof customElements !== 'undefined' &&
  !customElements.get(KD_CHART_PIE_TAG)
) {
  customElements.define(KD_CHART_PIE_TAG, KDChartPie);
}

export { KDChartPie };
export type { PieSlice, PieModel } from '../../components/chart-pie/pie.types';
