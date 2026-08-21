import { KDChartChord } from '../../components/chart-chord/chart-chord';

/**
 * Registration entry for `kd-chart-chord`.
 *
 * Importing this module registers exactly one custom element and pulls in the
 * D3 chord bundle. No other chart engine is reachable from here.
 */

export const KD_CHART_CHORD_TAG = 'kd-chart-chord';

// Guarded so the entry can be imported in a non-DOM environment and so a
// duplicate import never throws.
if (
  typeof customElements !== 'undefined' &&
  !customElements.get(KD_CHART_CHORD_TAG)
) {
  customElements.define(KD_CHART_CHORD_TAG, KDChartChord);
}

export { KDChartChord };
export type {
  ChordModel,
  ChordNode,
} from '../../components/chart-chord/chord.types';
