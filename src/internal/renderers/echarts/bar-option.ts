import type { ComposeOption } from 'echarts/core';
import type { BarSeriesOption, CustomSeriesOption } from 'echarts/charts';
import type {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
// Axis option types are not re-exported from 'echarts/components'; the main
// package's type entry is the only place that carries them. This import is
// type-only, so it does not pull the full bundle into the build.
import type { XAXisComponentOption, YAXisComponentOption } from 'echarts';
import { formatValue } from '../../chart-frame/format';
import { mergeNativeOverrides } from '../../chart-frame/merge';
import { paletteColor } from '../../chart-frame/palette';
import type { ChartTheme } from '../../chart-frame/types';
import { echartsTooltipDefaults } from './echarts-tooltip';
import type {
  BarModel,
  CartesianSeries,
} from '../../../components/chart-bar/bar.types';

/**
 * Pure ECharts option mapping for the bar chart.
 *
 * Every ECharts import here is type-only, so this module is safe to import in
 * Node and can be unit tested without a browser or an engine bundle.
 */

/**
 * The bar series, the `custom` series used for floating bars, and the
 * cartesian components are composed into the option type.
 */
export type BarEChartsOption = ComposeOption<
  | BarSeriesOption
  | CustomSeriesOption
  | GridComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | XAXisComponentOption
  | YAXisComponentOption
>;

/**
 * Fraction of a category slot a floating bar occupies. ECharts lays out
 * `custom` series itself, so the usual `barWidth`/`barMaxWidth` options do
 * not apply and the width has to be derived from the category slot.
 */
const FLOATING_BAR_WIDTH_RATIO = 0.6;

/**
 * Surface gap in px kept between adjacent floating bars in the same category
 * slot, matching the separation the design guidance calls for between
 * adjacent fills.
 */
const FLOATING_BAR_SURFACE_GAP = 2;

/**
 * The `renderItem` signature carried by a custom series. Derived from
 * `CustomSeriesOption` rather than imported from the top-level `echarts`
 * entry, which resolves to a nominally unrelated declaration.
 */
type CustomRenderItem = NonNullable<CustomSeriesOption['renderItem']>;

const ANIMATION_DURATION = 600;
const BAR_MAX_WIDTH = 48;
/**
 * Gap between the value axis's name and its axis line.
 *
 * `nameGap` is measured from the axis line, the same reference point tick
 * labels use, so it must clear the widest tick label the axis can show or the
 * (rotated, for the value axis when vertical) name text overlaps it. Value
 * axis tick labels are short formatted numbers, so a gap this size reliably
 * clears them. The category axis does not get a `name` at all (see below):
 * its tick labels are arbitrary user strings with no bounded width, so no
 * fixed gap could make the same guarantee.
 */
const VALUE_AXIS_NAME_GAP = 44;
/**
 * Extra grid margin reserved for the value axis's name, on top of whatever
 * `containLabel` reserves for tick labels. `containLabel` measures tick
 * labels only, not the axis `name`, so without this the name can run past
 * the canvas edge. Reserved on both `left` and `bottom` unconditionally,
 * since `horizontal` swaps which side the value axis renders on.
 */
const AXIS_NAME_RESERVE_PX = 64;

/**
 * WCAG relative luminance of a `#rrggbb` hex color, 0 (black) to 1 (white).
 * Returns 1 (treated as light) for any value that is not a 6-digit hex
 * string, e.g. a CSS named color or `rgb()` string, so an unrecognized
 * series color degrades to the theme's normal text color rather than
 * throwing.
 */
function relativeLuminance(hexColor: string): number {
  const match = /^#([0-9a-f]{6})$/i.exec(hexColor);
  if (!match) return 1;

  const channel = (hex: string): number => {
    const value = parseInt(hex, 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };

  const [r, g, b] = [
    match[1].slice(0, 2),
    match[1].slice(2, 4),
    match[1].slice(4, 6),
  ].map(channel);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Picks a legible label color for text drawn on top of `fillColor`: near
 * white on dark fills, the theme's normal text color on light fills.
 */
function legibleLabelColor(fillColor: string, theme: ChartTheme): string {
  return relativeLuminance(fillColor) < 0.5 ? '#ffffff' : theme.textColor;
}

/**
 * The `markLine` shape carried by a bar series. Taken from `BarSeriesOption`
 * rather than the top-level `echarts` entry: the two entry points resolve to
 * structurally identical but nominally unrelated declarations, so mixing them
 * fails assignment into the composed option type.
 */
type BarMarkLine = NonNullable<BarSeriesOption['markLine']>;

/** Builds the `markLine` that renders `model.indicator` on the value axis. */
function buildIndicatorMarkLine(
  model: BarModel,
  theme: ChartTheme
): BarMarkLine {
  const indicator = model.indicator!;
  const axisKey = model.horizontal ? 'xAxis' : 'yAxis';

  return {
    symbol: 'none',
    animation: false,
    lineStyle: { color: theme.textColor },
    label: {
      show: true,
      formatter: indicator.label ?? String(indicator.value),
      color: theme.textColor,
    },
    data: [{ [axisKey]: indicator.value }],
  };
}

/** True when any value in `series` is a `[min, max]` floating range. */
function hasFloatingValues(series: CartesianSeries): boolean {
  return series.values.some((value) => Array.isArray(value));
}

/**
 * Builds the `custom` series that renders `[min, max]` floating bars.
 *
 * A plain `bar` series cannot do this. ECharts reads exactly one value
 * dimension for bar layout and always draws from the axis baseline, so a
 * two-element array is interpreted as a generic `[x, y]` point: `min`
 * becomes a category index and `max` becomes the bar height. The stacked
 * transparent-base workaround also fails, because ECharts accumulates
 * positive and negative stacks separately and so mis-renders any range that
 * crosses zero. A `custom` series with an explicit `renderItem` is the only
 * mechanism that positions both edges directly.
 *
 * Because `custom` series are laid out by `renderItem` and not by the bar
 * layout engine, ECharts does not dodge them within the category slot the way
 * it dodges grouped `bar` series. `floatingIndex` and `floatingCount` supply
 * that layout: each floating series takes an equal sub-slot of the category
 * band, separated by `FLOATING_BAR_SURFACE_GAP`.
 *
 * Known limitation: the index and count are taken over the floating series
 * only. A model that mixes floating and scalar series therefore dodges its
 * floating bars among themselves, while ECharts independently dodges the
 * scalar bars among themselves, so the two groups can overlap each other.
 * There is no shared layout channel between a `custom` series and the bar
 * layout engine, so reconciling them would mean reimplementing the scalar
 * path as `custom` too.
 */
function buildFloatingSeries(
  model: BarModel,
  series: CartesianSeries,
  color: string,
  floatingIndex: number,
  floatingCount: number
): CustomSeriesOption {
  const horizontal = model.horizontal;

  return {
    type: 'custom',
    name: series.name,
    // [categoryIndex, min, max]; nulls are dropped so a gap stays a gap.
    data: series.values.map((value, index) =>
      value === null || value === undefined
        ? [index, null, null]
        : Array.isArray(value)
        ? [index, value[0], value[1]]
        : [index, 0, value]
    ) as unknown as CustomSeriesOption['data'],
    itemStyle: { color },
    renderItem: ((_params, api) => {
      const categoryIndex = api.value(0) as number;
      const low = api.value(1) as number | null;
      const high = api.value(2) as number | null;
      // A null bound is a gap: draw nothing for this category.
      if (low === null || high === null) return { type: 'group', children: [] };

      // `api.coord` takes axis-order pairs, so the category and value
      // positions swap with the orientation.
      const lowPoint = (
        horizontal
          ? api.coord([low, categoryIndex])
          : api.coord([categoryIndex, low])
      ) as number[];
      const highPoint = (
        horizontal
          ? api.coord([high, categoryIndex])
          : api.coord([categoryIndex, high])
      ) as number[];

      const size = (horizontal ? api.size!([0, 1]) : api.size!([1, 0])) as
        | number[]
        | number;
      const slot = Array.isArray(size)
        ? horizontal
          ? size[1]
          : size[0]
        : size;
      // The band the whole floating group occupies inside the category slot.
      // With a single series this collapses to the original
      // `min(slot * ratio, BAR_MAX_WIDTH)` thickness, so single-series
      // floating charts are laid out exactly as before.
      const gapTotal = FLOATING_BAR_SURFACE_GAP * (floatingCount - 1);
      const band = Math.min(
        slot * FLOATING_BAR_WIDTH_RATIO,
        BAR_MAX_WIDTH * floatingCount + gapTotal
      );
      const autoThickness = Math.max((band - gapTotal) / floatingCount, 1);
      // Matches the scalar bar path: an explicit `barThickness` is used
      // verbatim for a single series. When several floating series share the
      // slot it is clamped to the sub-slot, because honoring it verbatim
      // would let adjacent series overlap.
      const thickness =
        model.barThickness === undefined
          ? autoThickness
          : floatingCount === 1
          ? model.barThickness
          : Math.min(model.barThickness, autoThickness);

      // Offset of this series' center from the category center. Zero when
      // there is exactly one floating series.
      const groupWidth = thickness * floatingCount + gapTotal;
      const offset =
        -groupWidth / 2 +
        floatingIndex * (thickness + FLOATING_BAR_SURFACE_GAP) +
        thickness / 2;

      const shape = horizontal
        ? {
            x: Math.min(lowPoint[0], highPoint[0]),
            y: lowPoint[1] + offset - thickness / 2,
            width: Math.abs(highPoint[0] - lowPoint[0]),
            height: thickness,
          }
        : {
            x: lowPoint[0] + offset - thickness / 2,
            y: Math.min(lowPoint[1], highPoint[1]),
            width: thickness,
            height: Math.abs(highPoint[1] - lowPoint[1]),
          };

      return { type: 'rect', shape, style: { fill: color } };
    }) as CustomRenderItem,
  };
}

/** One entry of the array an axis-triggered tooltip passes its formatter. */
interface BarTooltipParam {
  /** Category label for the hovered slot. */
  axisValueLabel?: string;
  axisValue?: string | number;
  seriesName?: string;
  seriesIndex?: number;
  /** Colored bullet ECharts builds from the series color. */
  marker?: string;
  /** A scalar for a `bar` series, `[categoryIndex, min, max]` for a floating one. */
  value?: unknown;
}

/**
 * Tooltip text for a bar chart that contains at least one floating series.
 *
 * The default axis tooltip reads a single value dimension, so a floating
 * datum of `[categoryIndex, min, max]` prints only the category index. This
 * renders floating rows as a `min – max` range and leaves scalar rows as a
 * single formatted value.
 */
export function formatBarTooltip(model: BarModel, params: unknown): string {
  const items = (
    Array.isArray(params) ? params : [params]
  ) as BarTooltipParam[];
  if (items.length === 0) return '';

  const header = String(items[0]?.axisValueLabel ?? items[0]?.axisValue ?? '');

  const rows = items.flatMap((item) => {
    const marker = item.marker ?? '';
    const name = item.seriesName ?? '';
    const source =
      typeof item.seriesIndex === 'number'
        ? model.series[item.seriesIndex]
        : undefined;
    const floating = source ? hasFloatingValues(source) : false;

    if (floating && Array.isArray(item.value)) {
      const [, low, high] = item.value as (number | null | undefined)[];
      // A gap carries null bounds and draws no bar, so it gets no row.
      if (low === null || low === undefined) return [];
      if (high === null || high === undefined) return [];

      return [
        `${marker}${name}: ${formatValue(low)} \u2013 ${formatValue(high)}`,
      ];
    }

    const scalar = typeof item.value === 'number' ? item.value : null;

    return [`${marker}${name}: ${formatValue(scalar)}`];
  });

  return [header, ...rows].filter(Boolean).join('<br/>');
}

/** Builds the ECharts option for a bar model. */
export function buildBarOption(
  model: BarModel,
  theme: ChartTheme,
  reducedMotion: boolean,
  nativeOptions?: unknown
): BarEChartsOption {
  const axisNameReserve = model.hideAxes ? 0 : AXIS_NAME_RESERVE_PX;

  // Position of each floating series among the floating series only, used to
  // dodge them side by side within the category slot.
  const floatingIndexBySeries = new Map<number, number>();
  model.series.forEach((series, index) => {
    if (hasFloatingValues(series)) {
      floatingIndexBySeries.set(index, floatingIndexBySeries.size);
    }
  });
  const floatingCount = floatingIndexBySeries.size;

  const categoryAxis = {
    type: 'category' as const,
    data: model.categories as string[],
    show: !model.hideAxes,
    axisLabel: { color: theme.secondaryTextColor },
    // Without this ECharts pins the category axis (and its labels) to value
    // 0, so bars that cross zero paint over the category labels. Pinning it
    // to the edge of the grid instead is a no-op when no value is negative,
    // because zero is already the edge then.
    axisLine: { onZero: false, lineStyle: { color: theme.borderColor } },
  };

  const valueAxis = {
    type: 'value' as const,
    show: !model.hideAxes,
    max: model.valueMax,
    axisLabel: { color: theme.secondaryTextColor },
    splitLine: { lineStyle: { color: theme.borderColor } },
    name: model.valueLabel,
    nameLocation: 'middle' as const,
    nameGap: VALUE_AXIS_NAME_GAP,
    nameTextStyle: { color: theme.textColor },
  };

  const option: BarEChartsOption = {
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
      left: 16 + axisNameReserve,
      right: 16,
      top: 24,
      bottom: (model.showLegend ? 48 : 16) + axisNameReserve,
    },
    xAxis: model.horizontal ? valueAxis : categoryAxis,
    yAxis: model.horizontal ? categoryAxis : valueAxis,
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
      axisPointer: { type: 'shadow' },
      show: !model.hideTooltip,
      // Only overridden when a floating series is present: the default axis
      // tooltip cannot read the second value dimension of a `custom` series.
      ...(floatingCount > 0
        ? { formatter: (params: unknown) => formatBarTooltip(model, params) }
        : {}),
    }),
    series: model.series.map((series, index) => {
      const color = series.color ?? paletteColor(theme.palette, index);

      const floatingIndex = floatingIndexBySeries.get(index);
      if (floatingIndex !== undefined) {
        return buildFloatingSeries(
          model,
          series,
          color,
          floatingIndex,
          floatingCount
        );
      }

      return {
        type: 'bar',
        name: series.name,
        data: series.values as (number | null)[],
        stack: model.stacked ? 'total' : undefined,
        itemStyle: { color },
        ...(model.barThickness !== undefined
          ? { barWidth: model.barThickness }
          : { barMaxWidth: BAR_MAX_WIDTH }),
        ...(model.showSeriesLabels
          ? {
              label: {
                show: true,
                position: 'inside' as const,
                formatter: () => series.name,
                color: legibleLabelColor(color, theme),
              },
            }
          : {}),
        ...(index === 0 && model.indicator
          ? { markLine: buildIndicatorMarkLine(model, theme) }
          : {}),
      };
    }),
  };

  if (nativeOptions && typeof nativeOptions === 'object') {
    return mergeNativeOverrides(option, nativeOptions);
  }

  return option;
}
