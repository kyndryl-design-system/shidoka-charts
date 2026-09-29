import { KDChartTree } from '../../components/chart-tree/chart-tree';

/**
 * Registration entry for `kd-chart-tree`.
 *
 * Importing this module registers exactly one custom element and pulls in the
 * ECharts tree bundle. No other chart engine is reachable from here.
 */

export const KD_CHART_TREE_TAG = 'kd-chart-tree';

if (
  typeof customElements !== 'undefined' &&
  !customElements.get(KD_CHART_TREE_TAG)
) {
  customElements.define(KD_CHART_TREE_TAG, KDChartTree);
}

export { KDChartTree };
export type {
  TreeLeaf,
  TreeLayout,
  TreeModel,
  TreeNode,
  TreeOrientation,
} from '../../components/chart-tree/tree.types';
