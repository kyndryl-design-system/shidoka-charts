import type { ComposeOption } from 'echarts/core';
import type { PieSeriesOption } from 'echarts/charts';
import type {
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import { formatPercent, formatValue } from '../../chart-frame/format';
import { mergeNativeOverrides } from '../../chart-frame/merge';
import { paletteColor } from '../../chart-frame/palette';
import type { ChartTheme } from '../../chart-frame/types';
import { echartsTooltipDefaults } from './echarts-tooltip';
import { sliceTotal } from '../../../components/chart-pie/chart-pie-table';
import type { PieModel } from '../../../components/chart-pie/pie.types';

/**
 * Pure ECharts option mapping for the pie chart.
 *
 * Every ECharts import here is type-only, so this module is safe to import in
 * Node and can be unit tested without a browser or an engine bundle.
 */

/** Only the pie series and its supporting components are composed into the option type. */
export type PieEChartsOption = ComposeOption<
  PieSeriesOption | LegendComponentOption | TooltipComponentOption
>;

const ANIMATION_DURATION = 600;
const OUTER_RADIUS = '70%';

/** Clamps the inner radius ratio to the supported 0 to 0.8 range. */
function clampRatio(ratio: number): number {
  if (!Number.isFinite(ratio)) return 0;
  return Math.min(Math.max(ratio, 0), 0.8);
}

interface PieTooltipParams {
  name?: string;
  value?: number;
}

/** Tooltip text for a pie slice: value and share of the total. */
export function formatPieTooltip(model: PieModel, params: unknown): string {
  const detail = params as PieTooltipParams;
  const total = sliceTotal(model.slices);
  const value = typeof detail.value === 'number' ? detail.value : 0;
  const percent = formatPercent(value, total);

  return `${detail.name ?? ''}<br/>${model.valueLabel}: ${formatValue(value)}${
    percent ? ` (${percent})` : ''
  }`;
}

/** Builds the ECharts option for a pie model. */
export function buildPieOption(
  model: PieModel,
  theme: ChartTheme,
  reducedMotion: boolean,
  nativeOptions?: unknown
): PieEChartsOption {
  const ratio = clampRatio(model.innerRadiusRatio);
  const radius: string | [string, string] =
    ratio > 0 ? [`${Math.round(ratio * 100)}%`, OUTER_RADIUS] : OUTER_RADIUS;

  const option: PieEChartsOption = {
    backgroundColor: 'transparent',
    animation: !reducedMotion,
    animationDuration: reducedMotion ? 0 : ANIMATION_DURATION,
    animationDurationUpdate: reducedMotion ? 0 : ANIMATION_DURATION,
    textStyle: {
      color: theme.textColor,
      fontFamily: 'Roboto, sans-serif',
    },
    tooltip: echartsTooltipDefaults(theme, {
      trigger: 'item',
      formatter: (params: unknown) => formatPieTooltip(model, params),
    }),
    legend: model.showLegend
      ? {
          show: true,
          bottom: 0,
          textStyle: { color: theme.textColor },
          data: model.slices.map((slice) => slice.label),
        }
      : { show: false },
    series: [
      {
        type: 'pie',
        radius,
        center: ['50%', '50%'],
        // A border in the page background color separates adjacent slices of
        // the same or similar palette color, matching the Chart.js pie/doughnut
        // implementation's slice separators and the sunburst chart's ring
        // borders in this same hybrid architecture.
        itemStyle: {
          borderColor: theme.backgroundColor,
          borderWidth: 2,
        },
        data: model.slices.map((slice, index) => ({
          name: slice.label,
          value: slice.value,
          itemStyle: {
            color: slice.color ?? paletteColor(theme.palette, index),
          },
        })),
        label: {
          show: model.showLabels,
          color: theme.textColor,
        },
        emphasis: { focus: 'self' },
      },
    ],
  };

  if (nativeOptions && typeof nativeOptions === 'object') {
    return mergeNativeOverrides(option, nativeOptions);
  }

  return option;
}
