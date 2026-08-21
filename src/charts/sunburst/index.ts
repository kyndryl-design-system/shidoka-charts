import { KDChartSunburst } from '../../components/chart-sunburst/chart-sunburst';

/**
 * Registration entry for `kd-chart-sunburst`.
 *
 * Importing this module registers exactly one custom element and pulls in the
 * ECharts sunburst bundle. No other chart engine is reachable from here.
 */

export const KD_CHART_SUNBURST_TAG = 'kd-chart-sunburst';

// Guarded so the entry can be imported in a non-DOM environment and so a
// duplicate import never throws.
if (
  typeof customElements !== 'undefined' &&
  !customElements.get(KD_CHART_SUNBURST_TAG)
) {
  customElements.define(KD_CHART_SUNBURST_TAG, KDChartSunburst);
}

export { KDChartSunburst };
export type {
  SunburstLeaf,
  SunburstModel,
  SunburstNode,
} from '../../components/chart-sunburst/sunburst.types';
