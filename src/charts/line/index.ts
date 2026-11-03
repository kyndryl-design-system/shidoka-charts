import { KDChartLine } from '../../components/chart-line/chart-line';

/**
 * Registration entry for `kd-chart-line`.
 *
 * Importing this module registers exactly one custom element and pulls in the
 * ECharts line bundle. No other chart engine is reachable from here.
 */

export const KD_CHART_LINE_TAG = 'kd-chart-line';

// Guarded so the entry can be imported in a non-DOM environment and so a
// duplicate import never throws.
if (
  typeof customElements !== 'undefined' &&
  !customElements.get(KD_CHART_LINE_TAG)
) {
  customElements.define(KD_CHART_LINE_TAG, KDChartLine);
}

export { KDChartLine };
export type {
  CartesianSeries,
  LineModel,
} from '../../components/chart-line/line.types';
