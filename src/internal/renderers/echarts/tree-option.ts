import type { ComposeOption } from 'echarts/core';
import type { TreeSeriesOption } from 'echarts/charts';
import type { TooltipComponentOption } from 'echarts/components';
import { formatValue } from '../../chart-frame/format';
import { mergeNativeOverrides } from '../../chart-frame/merge';
import { paletteColor } from '../../chart-frame/palette';
import type { ChartTheme } from '../../chart-frame/types';
import { echartsTooltipDefaults } from './echarts-tooltip';
import { treePathKey } from '../../../components/chart-tree/tree-table';
import type {
  TreeModel,
  TreeNode,
} from '../../../components/chart-tree/tree.types';

/**
 * Pure ECharts option mapping for the tree.
 *
 * Every ECharts import here is type-only, so this module is safe to import in
 * Node and can be unit tested without a browser or an engine bundle.
 */

export type TreeEChartsOption = ComposeOption<
  TreeSeriesOption | TooltipComponentOption
>;

interface TreeDatum {
  name: string;
  value?: number;
  collapsed?: boolean;
  itemStyle?: { color?: string };
  children?: TreeDatum[];
}

const ANIMATION_DURATION = 550;
const ANIMATION_DURATION_UPDATE = 750;
const LABEL_FONT_SIZE = 12;
const LABEL_DISTANCE = 6;

/** Series box margins that leave room for horizontal labels beside nodes. */
export function treeSeriesBounds(
  orientation: TreeModel['orientation'],
  layout: TreeModel['layout']
): { top: string; left: string; bottom: string; right: string } {
  if (layout === 'radial') {
    return { top: '12%', left: '12%', bottom: '12%', right: '12%' };
  }

  switch (orientation) {
    case 'LR':
      return { top: '10%', left: '20%', bottom: '10%', right: '22%' };
    case 'RL':
      return { top: '10%', left: '22%', bottom: '10%', right: '20%' };
    case 'TB':
      return { top: '12%', left: '14%', bottom: '18%', right: '14%' };
    case 'BT':
      return { top: '18%', left: '14%', bottom: '12%', right: '14%' };
    default:
      return { top: '10%', left: '20%', bottom: '10%', right: '22%' };
  }
}

function longestLabel(nodes: readonly TreeNode[]): number {
  let max = 0;

  const walk = (items: readonly TreeNode[]): void => {
    for (const node of items) {
      max = Math.max(max, node.label.length);
      if (node.children?.length) walk(node.children);
    }
  };

  walk(nodes);
  return max;
}

/**
 * Extra margin for long labels along the axis labels extend after rotation.
 * Uses an 800px reference so Storybook-sized hosts keep labels inside the canvas.
 */
function labelMarginPercent(
  nodes: readonly TreeNode[],
  axis: 'horizontal' | 'vertical'
): number {
  const charWidthPx = LABEL_FONT_SIZE * 0.58;
  const labelPx = longestLabel(nodes) * charWidthPx + LABEL_DISTANCE + 8;
  const referencePx = axis === 'horizontal' ? 800 : 600;
  const percent = (labelPx / referencePx) * 100;
  const baseline = axis === 'horizontal' ? 14 : 12;

  return Math.min(32, Math.max(0, percent - baseline));
}

function addMarginPercent(base: string, extra: number): string {
  return `${parseFloat(base) + extra}%`;
}

/** Label anchor and rotation that follow ECharts' per-orient defaults. */
function treeLabelStyles(
  orientation: TreeModel['orientation'],
  layout: TreeModel['layout']
): {
  label: NonNullable<TreeSeriesOption['label']>;
  leaves: NonNullable<NonNullable<TreeSeriesOption['leaves']>['label']>;
} {
  const shared = {
    distance: LABEL_DISTANCE,
  };

  if (layout === 'radial') {
    return {
      label: {
        ...shared,
        rotate: 0,
        position: 'top',
        verticalAlign: 'middle',
        align: 'center',
      },
      leaves: {
        ...shared,
        rotate: 0,
        position: 'top',
        verticalAlign: 'middle',
        align: 'center',
      },
    };
  }

  switch (orientation) {
    case 'RL':
      return {
        label: {
          ...shared,
          rotate: 0,
          position: 'right',
          verticalAlign: 'middle',
          align: 'left',
        },
        leaves: {
          ...shared,
          rotate: 0,
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
        },
      };
    case 'TB':
      return {
        label: {
          ...shared,
          rotate: -90,
          position: 'top',
          verticalAlign: 'middle',
          align: 'right',
        },
        leaves: {
          ...shared,
          rotate: -90,
          position: 'bottom',
          verticalAlign: 'middle',
          align: 'left',
        },
      };
    case 'BT':
      return {
        label: {
          ...shared,
          rotate: 90,
          position: 'bottom',
          verticalAlign: 'middle',
          align: 'right',
        },
        leaves: {
          ...shared,
          rotate: 90,
          position: 'top',
          verticalAlign: 'middle',
          align: 'left',
        },
      };
    default:
      return {
        label: {
          ...shared,
          // Keep LR labels horizontal; the orthogonal default rotates along
          // vertical connectors and often clips at the canvas edge.
          rotate: 0,
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
        },
        leaves: {
          ...shared,
          rotate: 0,
          position: 'right',
          verticalAlign: 'middle',
          align: 'left',
        },
      };
  }
}

function treeSeriesMargins(
  orientation: TreeModel['orientation'],
  layout: TreeModel['layout'],
  nodes: readonly TreeNode[]
): { top: string; left: string; bottom: string; right: string } {
  const bounds = treeSeriesBounds(orientation, layout);

  if (layout === 'radial') {
    return bounds;
  }

  const extraHorizontal = labelMarginPercent(nodes, 'horizontal');
  const extraVertical = labelMarginPercent(nodes, 'vertical');

  switch (orientation) {
    case 'LR':
      return { ...bounds, left: addMarginPercent(bounds.left, extraHorizontal) };
    case 'RL':
      return { ...bounds, right: addMarginPercent(bounds.right, extraHorizontal) };
    case 'TB':
      return {
        ...bounds,
        top: addMarginPercent(bounds.top, extraVertical),
        bottom: addMarginPercent(bounds.bottom, extraVertical),
      };
    case 'BT':
      return {
        ...bounds,
        top: addMarginPercent(bounds.top, extraVertical),
        bottom: addMarginPercent(bounds.bottom, extraVertical),
      };
    default:
      return bounds;
  }
}

function collapsedForPath(
  path: readonly string[],
  node: TreeNode,
  collapsedByPath: Readonly<Record<string, boolean>> | undefined
): boolean | undefined {
  const key = treePathKey(path);
  if (collapsedByPath && key in collapsedByPath) {
    return collapsedByPath[key];
  }

  return node.collapsed;
}

function mapNodes(
  nodes: readonly TreeNode[],
  theme: ChartTheme,
  depth: number,
  parentPath: readonly string[],
  collapsedByPath: Readonly<Record<string, boolean>> | undefined,
  inheritedColor?: string
): TreeDatum[] {
  return nodes.map((node, index) => {
    const color =
      node.color ??
      (depth === 0 ? paletteColor(theme.palette, index) : inheritedColor);

    const path = [...parentPath, node.label];
    const datum: TreeDatum = { name: node.label };
    const collapsed = collapsedForPath(path, node, collapsedByPath);

    if (collapsed !== undefined) {
      datum.collapsed = collapsed;
    }

    if (color) {
      datum.itemStyle = { color };
    }

    if (node.children?.length) {
      datum.children = mapNodes(
        node.children,
        theme,
        depth + 1,
        path,
        collapsedByPath,
        color
      );
    } else {
      datum.value = nodeTotal(node);
    }

    return datum;
  });
}

function nodeTotal(node: TreeNode): number {
  if (node.children?.length) {
    return node.children.reduce((sum, child) => sum + nodeTotal(child), 0);
  }

  return Number.isFinite(node.value) ? Number(node.value) : 0;
}

interface TreeTooltipParams {
  name?: string;
  value?: number;
  treeAncestors?: { name?: string }[];
}

function tooltipPath(params: TreeTooltipParams): string[] {
  return (params.treeAncestors ?? [])
    .slice(1)
    .map((entry) => entry.name ?? '')
    .filter(Boolean);
}

/** Tooltip text for a tree node. */
export function formatTreeTooltip(model: TreeModel, params: unknown): string {
  const detail = params as TreeTooltipParams;
  const path = tooltipPath(detail);
  const heading = path.length ? path.join(' / ') : detail.name ?? '';

  if (typeof detail.value === 'number') {
    return `${heading}<br/>${model.valueLabel}: ${formatValue(detail.value)}`;
  }

  return heading;
}

/** Builds the ECharts option for a tree model. */
export function buildTreeOption(
  model: TreeModel,
  theme: ChartTheme,
  reducedMotion: boolean,
  nativeOptions?: unknown
): TreeEChartsOption {
  const margins = treeSeriesMargins(
    model.orientation,
    model.layout,
    model.nodes
  );
  const labelStyles = treeLabelStyles(model.orientation, model.layout);

  const option: TreeEChartsOption = {
    backgroundColor: 'transparent',
    animation: !reducedMotion,
    animationDuration: reducedMotion ? 0 : ANIMATION_DURATION,
    animationDurationUpdate: reducedMotion ? 0 : ANIMATION_DURATION_UPDATE,
    textStyle: {
      color: theme.textColor,
      fontFamily: 'Roboto, sans-serif',
    },
    tooltip: echartsTooltipDefaults(theme, {
      formatter: (params: unknown) => formatTreeTooltip(model, params),
    }),
    series: [
      {
        type: 'tree',
        data: mapNodes(
          model.nodes,
          theme,
          0,
          [],
          model.collapsedByPath
        ) as TreeSeriesOption['data'],
        top: margins.top,
        left: margins.left,
        bottom: margins.bottom,
        right: margins.right,
        layout: model.layout,
        orient: model.orientation,
        symbol: 'emptyCircle',
        symbolSize: 7,
        expandAndCollapse: model.expandAndCollapse,
        initialTreeDepth: model.initialTreeDepth,
        edgeShape: 'curve',
        edgeForkPosition: '63%',
        label: {
          show: model.showLabels,
          color: theme.textColor,
          fontSize: LABEL_FONT_SIZE,
          ...labelStyles.label,
        },
        leaves: {
          label: {
            show: model.showLabels,
            color: theme.textColor,
            fontSize: LABEL_FONT_SIZE,
            ...labelStyles.leaves,
          },
        },
        lineStyle: {
          color: theme.borderColor,
        },
        emphasis: {
          focus: 'descendant',
        },
      },
    ],
  };

  if (nativeOptions && typeof nativeOptions === 'object') {
    return mergeNativeOverrides(option, nativeOptions);
  }

  return option;
}
