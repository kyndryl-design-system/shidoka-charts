import type { ComposeOption } from 'echarts/core';
import type { SunburstSeriesOption } from 'echarts/charts';
import type { TooltipComponentOption } from 'echarts/components';
import { formatValue } from '../../chart-frame/format';
import { mergeNativeOverrides } from '../../chart-frame/merge';
import { paletteColor } from '../../chart-frame/palette';
import type { ChartTheme } from '../../chart-frame/types';
import { echartsTooltipDefaults } from './echarts-tooltip';
import type {
  SunburstModel,
  SunburstNode,
} from '../../../components/chart-sunburst/sunburst.types';
import { nodeTotal } from '../../../components/chart-sunburst/sunburst-table';
import {
  labelPathKey,
  LABEL_FONT_SIZE_PX,
  OUTER_RADIUS_FRACTION,
  planSunburstLabels,
  suppressedLabelKeys,
} from '../../../components/chart-sunburst/sunburst-labels';

/**
 * Pure ECharts option mapping for the sunburst.
 *
 * Every ECharts import here is type-only, so this module is safe to import in
 * Node and can be unit tested without a browser or an engine bundle.
 */

/** Only the sunburst series and tooltip are composed into the option type. */
export type SunburstEChartsOption = ComposeOption<
  SunburstSeriesOption | TooltipComponentOption
>;

interface HiddenLabel {
  label: { show: false };
}

interface SunburstDatum {
  name: string;
  value?: number;
  itemStyle?: { color?: string };
  label?: { show: false };
  emphasis?: HiddenLabel;
  select?: HiddenLabel;
  blur?: HiddenLabel;
  children?: SunburstDatum[];
}

const ANIMATION_DURATION = 600;
const LABEL_MIN_ANGLE = 8;
/** Sunburst sweeps clockwise from 12 o'clock, matching the label planner. */
const START_ANGLE = 90;

function mapNodes(
  nodes: readonly SunburstNode[],
  theme: ChartTheme,
  depth: number,
  parentPath: readonly string[],
  suppressed: ReadonlySet<string> | null,
  inheritedColor?: string
): SunburstDatum[] {
  return nodes.map((node, index) => {
    // Top level segments seed a palette color; descendants inherit it so a
    // branch reads as one family.
    const color =
      node.color ??
      (depth === 0 ? paletteColor(theme.palette, index) : inheritedColor);

    const path = [...parentPath, node.label];
    const datum: SunburstDatum = { name: node.label };

    if (color) {
      datum.itemStyle = { color };
    }

    // Constrained labels are drawn by the component overlay instead, so the
    // chart must not paint its own copy underneath. Each interaction state
    // carries its own label config, so hiding only the normal state lets the
    // label return the moment the sector is hovered, selected or blurred.
    if (suppressed?.has(labelPathKey(path))) {
      datum.label = { show: false };
      datum.emphasis = { label: { show: false } };
      datum.select = { label: { show: false } };
      datum.blur = { label: { show: false } };
    }

    if (node.children?.length) {
      datum.children = mapNodes(
        node.children,
        theme,
        depth + 1,
        path,
        suppressed,
        color
      );
    } else {
      datum.value = nodeTotal(node);
    }

    return datum;
  });
}

function clampRatio(ratio: number): number {
  if (!Number.isFinite(ratio)) return 0;
  return Math.min(Math.max(ratio, 0), 0.8);
}

interface SunburstTooltipParams {
  name?: string;
  value?: number;
  treePathInfo?: { name?: string }[];
}

function tooltipPath(params: SunburstTooltipParams): string[] {
  return (params.treePathInfo ?? [])
    .slice(1)
    .map((entry) => entry.name ?? '')
    .filter(Boolean);
}

/**
 * Tooltip text for a sunburst sector. Overlay-owned sectors return nothing so
 * the chart does not compete with the component's anchors.
 */
export function formatSunburstTooltip(
  model: SunburstModel,
  params: unknown,
  suppressed: ReadonlySet<string> | null
): string | undefined {
  const detail = params as SunburstTooltipParams;
  const path = tooltipPath(detail);

  if (suppressed?.has(labelPathKey(path))) {
    return undefined;
  }

  const heading = path.length ? path.join(' / ') : detail.name ?? '';

  return `${heading}<br/>${model.valueLabel}: ${formatValue(detail.value)}`;
}

/** Builds the ECharts option for a sunburst model. */
export function buildSunburstOption(
  model: SunburstModel,
  theme: ChartTheme,
  reducedMotion: boolean,
  nativeOptions?: unknown
): SunburstEChartsOption {
  const innerRadius = `${Math.round(
    clampRatio(model.innerRadiusRatio) * 100
  )}%`;
  const outerRadius = `${Math.round(OUTER_RADIUS_FRACTION * 100)}%`;
  const constrained = model.showLabels && model.labelStrategy === 'constrained';
  const suppressed = constrained
    ? suppressedLabelKeys(planSunburstLabels(model))
    : null;

  const option: SunburstEChartsOption = {
    backgroundColor: 'transparent',
    animation: !reducedMotion,
    animationDuration: reducedMotion ? 0 : ANIMATION_DURATION,
    animationDurationUpdate: reducedMotion ? 0 : ANIMATION_DURATION,
    textStyle: {
      color: theme.textColor,
      fontFamily: 'Roboto, sans-serif',
    },
    tooltip: echartsTooltipDefaults(theme, {
      formatter: (params: unknown) =>
        formatSunburstTooltip(model, params, suppressed),
    }),
    series: [
      {
        type: 'sunburst',
        radius: [innerRadius, outerRadius],
        center: ['50%', '50%'],
        // Order, start angle and direction are pinned so the label planner's
        // geometry matches what the chart draws.
        startAngle: START_ANGLE,
        clockwise: true,
        sort: (a, b) => a.dataIndex - b.dataIndex,
        nodeClick: false,
        data: mapNodes(
          model.nodes,
          theme,
          0,
          [],
          suppressed
        ) as SunburstSeriesOption['data'],
        label: {
          show: model.showLabels,
          color: theme.textColor,
          minAngle: model.labelStrategy === 'constrained' ? 0 : LABEL_MIN_ANGLE,
          // Radial text is both the sunburst default and what the label
          // planner measures against, so it is pinned here too.
          rotate: 'radial',
          overflow: 'truncate',
          fontSize: LABEL_FONT_SIZE_PX,
        },
        labelLayout: { hideOverlap: true },
        itemStyle: {
          borderColor: theme.backgroundColor,
          borderWidth: 2,
        },
        emphasis: { focus: 'ancestor' },
      },
    ],
  };

  if (nativeOptions && typeof nativeOptions === 'object') {
    return mergeNativeOverrides(option, nativeOptions);
  }

  return option;
}
