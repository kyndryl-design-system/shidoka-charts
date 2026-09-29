import type { ComposeOption } from 'echarts/core';
import type { LineSeriesOption } from 'echarts/charts';
import type {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
// Axis option types are not re-exported from 'echarts/components'; the main
// package's type entry is the only place that carries them. This import is
// type-only, so it does not pull the full bundle into the build.
import type { XAXisComponentOption, YAXisComponentOption } from 'echarts';
import { mergeNativeOverrides } from '../../chart-frame/merge';
import { paletteColor } from '../../chart-frame/palette';
import type { ChartTheme } from '../../chart-frame/types';
import { echartsTooltipDefaults } from './echarts-tooltip';
import type { AreaModel } from '../../../components/chart-area/area.types';

/**
 * Pure ECharts option mapping for the area chart.
 *
 * Every ECharts import here is type-only, so this module is safe to import in
 * Node and can be unit tested without a browser or an engine bundle.
 *
 * Area charts are ECharts line series with `areaStyle` set, so the option
 * type reuses `LineSeriesOption`.
 */

/** Only the line series and the cartesian components are composed into the option type. */
export type AreaEChartsOption = ComposeOption<
  | LineSeriesOption
  | GridComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | XAXisComponentOption
  | YAXisComponentOption
>;

const ANIMATION_DURATION = 600;
/**
 * Gap between the value axis's name and its axis line.
 *
 * `nameGap` is measured from the axis line, the same reference point tick
 * labels use, so it must clear the widest tick label the axis can show or the
 * (rotated) name text overlaps it. Value axis tick labels are short formatted
 * numbers, so a gap this size reliably clears them. The category axis does
 * not get a `name` at all (see below): its tick labels are arbitrary user
 * strings with no bounded width, so no fixed gap could make the same
 * guarantee.
 */
const VALUE_AXIS_NAME_GAP = 32;
/**
 * Extra grid margin reserved for the value axis's name, on top of whatever
 * `containLabel` reserves for tick labels. `containLabel` measures tick
 * labels only, not the axis `name`, so without this the name can run past
 * the canvas edge.
 */
const AXIS_NAME_RESERVE_PX = 40;

/** Builds the ECharts option for an area model. */
export function buildAreaOption(
  model: AreaModel,
  theme: ChartTheme,
  reducedMotion: boolean,
  nativeOptions?: unknown
): AreaEChartsOption {
  const option: AreaEChartsOption = {
    backgroundColor: 'transparent',
    animation: !reducedMotion,
    animationDuration: reducedMotion ? 0 : ANIMATION_DURATION,
    animationDurationUpdate: reducedMotion ? 0 : ANIMATION_DURATION,
    textStyle: {
      color: theme.textColor,
      fontFamily: 'Roboto, sans-serif',
    },
    grid: {
      containLabel: true,
      left: 16 + AXIS_NAME_RESERVE_PX,
      right: 16,
      top: 24,
      bottom: model.showLegend ? 48 : 16,
    },
    xAxis: {
      type: 'category',
      data: model.categories as string[],
      axisLabel: { color: theme.secondaryTextColor },
      axisLine: { lineStyle: { color: theme.borderColor } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: theme.secondaryTextColor },
      splitLine: { lineStyle: { color: theme.borderColor } },
      name: model.valueLabel,
      nameLocation: 'middle',
      nameGap: VALUE_AXIS_NAME_GAP,
      nameTextStyle: { color: theme.textColor },
    },
    legend: model.showLegend
      ? {
          show: true,
          bottom: 0,
          textStyle: { color: theme.textColor },
          data: model.series.map((series) => series.name),
        }
      : { show: false },
    tooltip: echartsTooltipDefaults(theme, {
      trigger: 'axis',
      axisPointer: { type: 'line' },
    }),
    series: model.series.map((series, index) => {
      const color = series.color ?? paletteColor(theme.palette, index);

      return {
        type: 'line',
        name: series.name,
        data: series.values as (number | null)[],
        smooth: model.smooth,
        showSymbol: model.showPoints,
        symbolSize: 6,
        stack: model.stacked ? 'total' : undefined,
        connectNulls: false,
        lineStyle: { color, width: 2 },
        itemStyle: { color },
        areaStyle: { color, opacity: model.stacked ? 0.6 : 0.25 },
      };
    }),
  };

  if (nativeOptions && typeof nativeOptions === 'object') {
    return mergeNativeOverrides(option, nativeOptions);
  }

  return option;
}
