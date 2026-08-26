import { property } from 'lit/decorators.js';
import { ChartFrameElement } from '../../internal/chart-frame/chart-frame-element';
import type {
  ChartRenderer,
  ChartTableView,
} from '../../internal/chart-frame/types';
import { formatValue } from '../../internal/chart-frame/format';
import { EChartsTreeRenderer } from '../../internal/renderers/echarts/tree-renderer';
import { buildTreeTable, hierarchyTotal } from './tree-table';
import type {
  TreeLayout,
  TreeModel,
  TreeNode,
  TreeOrientation,
} from './tree.types';

const DATA_PROPERTIES = [
  'nodes',
  'categoryLabel',
  'valueLabel',
  'showLabels',
  'orientation',
  'layout',
  'initialTreeDepth',
  'expandAndCollapse',
] as const;

/**
 * Tree chart for hierarchical data with expandable and collapsible branches.
 *
 * The component takes a semantic hierarchy and owns its renderer. It exposes no
 * engine selector and no universal native configuration; the rendering engine
 * is an implementation detail apart from the documented unsafe escape hatch.
 *
 * @slot controls - Slot for custom controls beside the built in controls.
 * @fires on-chart-interaction - Normalized selection, detail: `{ kind, label, value, path }`.
 * @fires on-view-toggle - Table view toggled, detail: `{ tableView }`.
 */
export class KDChartTree extends ChartFrameElement<TreeModel> {
  /** Top level nodes of the hierarchy. */
  @property({ type: Array })
  accessor nodes: TreeNode[] = [];

  /** Column header used for the category in the table fallback. */
  @property({ type: String })
  accessor categoryLabel = 'Category';

  /** Column header and tooltip suffix used for values. */
  @property({ type: String })
  accessor valueLabel = 'Value';

  /** Draws labels beside nodes. */
  @property({ type: Boolean })
  accessor showLabels = true;

  /** Growth direction relative to the root. */
  @property({ type: String })
  accessor orientation: TreeOrientation = 'LR';

  /** Orthogonal or radial edge routing. */
  @property({ type: String })
  accessor layout: TreeLayout = 'orthogonal';

  /**
   * Depth to expand on first render. `-1` expands every level. `1` shows only
   * the root until a node is expanded.
   */
  @property({ type: Number })
  accessor initialTreeDepth = -1;

  /** Lets users expand and collapse branches by clicking nodes. */
  @property({ type: Boolean })
  accessor expandAndCollapse = true;

  protected override get dataProperties(): readonly string[] {
    return DATA_PROPERTIES;
  }

  protected override get fileNameFallback(): string {
    return 'tree';
  }

  protected override get captionText(): string {
    if (!this.nodes.length) return '';

    return `${this.valueLabel} total: ${formatValue(
      hierarchyTotal(this.nodes)
    )}`;
  }

  protected override createRenderer(): ChartRenderer<TreeModel> {
    return new EChartsTreeRenderer();
  }

  protected override buildModel(): TreeModel | null {
    if (!Array.isArray(this.nodes) || !this.nodes.length) return null;

    return {
      nodes: this.nodes,
      categoryLabel: this.categoryLabel,
      valueLabel: this.valueLabel,
      showLabels: this.showLabels,
      orientation: this.orientation,
      layout: this.layout,
      initialTreeDepth: this.initialTreeDepth,
      expandAndCollapse: this.expandAndCollapse,
    };
  }

  protected override buildTableView(model: TreeModel): ChartTableView {
    return buildTreeTable(model);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kd-chart-tree': KDChartTree;
  }
}
