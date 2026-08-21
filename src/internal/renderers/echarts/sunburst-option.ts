import type { ComposeOption } from 'echarts/core';
import type { SunburstSeriesOption } from 'echarts/charts';
import type { TooltipComponentOption } from 'echarts/components';
import { formatValue } from '../../chart-frame/format';
import { mergeNativeOverrides } from '../../chart-frame/merge';
import { paletteColor } from '../../chart-frame/palette';
import type { ChartTheme } from '../../chart-frame/types';
import type {
  SunburstModel,
  SunburstNode,
} from '../../../components/chart-sunburst/sunburst.types';
import { nodeTotal } from '../../../components/chart-sunburst/sunburst-table';

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

interface SunburstDatum {
  name: string;
  value?: number;
  itemStyle?: { color?: string };
  children?: SunburstDatum[];
}

const ANIMATION_DURATION = 600;
const LABEL_MIN_ANGLE = 8;

function mapNodes(
  nodes: readonly SunburstNode[],
  theme: ChartTheme,
  depth: number,
  inheritedColor?: string
): SunburstDatum[] {
  return nodes.map((node, index) => {
    // Top level segments seed a palette color; descendants inherit it so a
    // branch reads as one family.
    const color =
      node.color ??
      (depth === 0 ? paletteColor(theme.palette, index) : inheritedColor);

    const datum: SunburstDatum = { name: node.label };

    if (color) {
      datum.itemStyle = { color };
    }

    if (node.children?.length) {
      datum.children = mapNodes(node.children, theme, depth + 1, color);
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

/** Builds the ECharts option for a sunburst model. */
export function buildSunburstOption(
  model: SunburstModel,
  theme: ChartTheme,
  reducedMotion: boolean,
  nativeOptions?: unknown
): SunburstEChartsOption {
  const innerRadius = `${Math.round(clampRatio(model.innerRadiusRatio) * 100)}%`;

  const option: SunburstEChartsOption = {
    backgroundColor: 'transparent',
    animation: !reducedMotion,
    animationDuration: reducedMotion ? 0 : ANIMATION_DURATION,
    animationDurationUpdate: reducedMotion ? 0 : ANIMATION_DURATION,
    textStyle: {
      color: theme.textColor,
      fontFamily: 'Roboto, sans-serif',
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: theme.tooltipBackgroundColor,
      borderWidth: 0,
      textStyle: { color: theme.tooltipTextColor, fontSize: 12 },
      formatter: (params: unknown) => {
        const detail = params as {
          name?: string;
          value?: number;
          treePathInfo?: { name?: string }[];
        };
        const path = (detail.treePathInfo ?? [])
          .slice(1)
          .map((entry) => entry.name ?? '')
          .filter(Boolean);
        const heading = path.length ? path.join(' / ') : detail.name ?? '';

        return `${heading}<br/>${model.valueLabel}: ${formatValue(
          detail.value
        )}`;
      },
    },
    series: [
      {
        type: 'sunburst',
        radius: [innerRadius, '92%'],
        center: ['50%', '50%'],
        nodeClick: false,
        data: mapNodes(model.nodes, theme, 0) as SunburstSeriesOption['data'],
        label: {
          show: model.showLabels,
          color: theme.textColor,
          minAngle: LABEL_MIN_ANGLE,
          overflow: 'truncate',
          fontSize: 12,
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
