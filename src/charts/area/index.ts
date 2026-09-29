import { KDChartArea } from '../../components/chart-area/chart-area';

/**
 * Registration entry for `kd-chart-area`.
 *
 * Importing this module registers exactly one custom element and pulls in the
 * ECharts area bundle. No other chart engine is reachable from here.
 */

export const KD_CHART_AREA_TAG = 'kd-chart-area';

// Guarded so the entry can be imported in a non-DOM environment and so a
// duplicate import never throws.
if (
  typeof customElements !== 'undefined' &&
  !customElements.get(KD_CHART_AREA_TAG)
) {
  customElements.define(KD_CHART_AREA_TAG, KDChartArea);
}

export { KDChartArea };
export type {
  AreaModel,
  CartesianSeries,
} from '../../components/chart-area/area.types';
