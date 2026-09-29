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
import type {
  CartesianSeries,
  LineModel,
  SeriesBand,
} from '../../../components/chart-line/line.types';

/**
 * Pure ECharts option mapping for the line chart.
 *
 * Every ECharts import here is type-only, so this module is safe to import in
 * Node and can be unit tested without a browser or an engine bundle.
 */

/** Only the line series and the cartesian components are composed into the option type. */
export type LineEChartsOption = ComposeOption<
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
const VALUE_AXIS_NAME_GAP = 44;
/**
 * Extra grid margin reserved for the value axis's name, on top of whatever
 * `containLabel` reserves for tick labels. `containLabel` measures tick
 * labels only, not the axis `name`, so without this the name can run past
 * the canvas edge.
 */
const AXIS_NAME_RESERVE_PX = 64;

/**
 * The `markArea`/`markLine` shapes carried by a line series. Taken from
 * `LineSeriesOption` rather than the top-level `echarts` entry: the two
 * entry points resolve to structurally identical but nominally unrelated
 * declarations, so mixing them fails assignment into the composed option
 * type.
 */
type LineMarkArea = NonNullable<LineSeriesOption['markArea']>;
type LineMarkLine = NonNullable<LineSeriesOption['markLine']>;
type LineMarkAreaData = NonNullable<LineMarkArea['data']>;
type LineMarkLineData = NonNullable<LineMarkLine['data']>;

/** Default fill opacity for a `SeriesBand` when none is given. */
const DEFAULT_BAND_OPACITY = 0.2;
/**
 * Fill opacity used for both the threshold-band fills and the forecast
 * tint. Matches the 10% alpha the Chart.js `thresholdBand` plugin bakes in.
 */
const REFERENCE_BAND_FILL_OPACITY = 0.1;
const FORECAST_FILL_OPACITY = 0.08;

/**
 * Positions a value on the shared category axis by index when `timeAxis` is
 * off, or as a `[time, value]` pair when it is on. Shared by the main series
 * and by the extra series a `SeriesBand` emits, so all of them stay aligned
 * on the same x positions.
 */
function toAxisData(
  model: LineModel,
  values: readonly (number | null)[]
): (number | null | [string, number | null])[] {
  return model.timeAxis
    ? model.categories.map((category, pointIndex) => [
        category,
        values[pointIndex] ?? null,
      ])
    : (values as (number | null)[]);
}

/**
 * Builds the `markArea` fill bands and `markLine` boundary lines that
 * reproduce `src/common/plugins/thresholdBand.js`'s behavior in ECharts.
 * Boundaries are sorted ascending first, since the fill and line order both
 * depend on each boundary's position relative to its neighbors.
 */
function buildReferenceBandMarkers(model: LineModel): {
  areaData: LineMarkAreaData;
  lineData: LineMarkLineData;
} {
  const sorted = [...(model.referenceBands ?? [])].sort(
    (a, b) => a.value - b.value
  );

  // This builder has no access to the rendered axis extent (it runs before
  // the chart mounts), so "the top of the plot" for the topmost, open-ended
  // band is approximated with the highest value already on the chart: the
  // last boundary or the highest plotted point, whichever is greater. That
  // value is already part of the axis's data-driven extent, so using it as
  // a fill boundary does not itself distort the axis scale the way an
  // arbitrary large sentinel would.
  const plottedValues = model.series
    .flatMap((s) => s.values)
    .filter((v): v is number => v != null);
  const highestPlottedValue =
    plottedValues.length > 0 ? Math.max(...plottedValues) : 0;
  const topOfPlot =
    sorted.length > 0
      ? Math.max(highestPlottedValue, ...sorted.map((band) => band.value))
      : highestPlottedValue;

  const areaData: LineMarkAreaData = sorted.map((band, index) => {
    const next = sorted[index + 1];
    // Deliberate parity with the Chart.js `thresholdBand` plugin: the fill
    // between a boundary and the next one uses the NEXT (higher) boundary's
    // color, not its own. The topmost band has no next boundary, so it
    // falls back to its own color.
    const fillColor = next ? next.color : band.color;

    return [
      {
        yAxis: band.value,
        itemStyle: { color: fillColor, opacity: REFERENCE_BAND_FILL_OPACITY },
      },
      { yAxis: next ? next.value : topOfPlot },
    ];
  });

  const lineData: LineMarkLineData = sorted.map((band) => ({
    yAxis: band.value,
    symbol: 'none',
    lineStyle: { color: band.color },
    label: band.label
      ? { show: true, formatter: band.label, color: band.color }
      : { show: false },
  }));

  return { areaData, lineData };
}

/** Resolves `model.forecastFrom` to a category index. A `string` that does not match any category is a no-op. */
function resolveForecastIndex(model: LineModel): number | undefined {
  if (model.forecastFrom === undefined) return undefined;
  if (typeof model.forecastFrom === 'number') return model.forecastFrom;

  const index = model.categories.indexOf(model.forecastFrom);
  return index === -1 ? undefined : index;
}

/** Builds the dashed divider and faint tint that mark a forecast region from `index` to the end of the plot. */
function buildForecastMarkers(
  model: LineModel,
  theme: ChartTheme,
  index: number
): { areaData: LineMarkAreaData; lineData: LineMarkLineData } {
  const lastIndex = model.categories.length - 1;

  return {
    areaData: [
      [
        {
          xAxis: index,
          itemStyle: {
            color: theme.borderColor,
            opacity: FORECAST_FILL_OPACITY,
          },
        },
        { xAxis: lastIndex },
      ],
    ],
    lineData: [
      {
        xAxis: index,
        symbol: 'none',
        lineStyle: { color: theme.borderColor, type: 'dashed' },
      },
    ],
  };
}

/**
 * Builds the two extra stacked series a `SeriesBand` needs: a transparent
 * base at `lower` and a delta at `upper - lower` with the band's fill. Both
 * stack under an id unique to this (series, band) pair, so they never bleed
 * into the parent series' own `stack` (used when `model.stacked` is set) or
 * into another band's stack. Rendered with `z: 1`, below the ECharts line-series default of `z: 3`
 * of the parent line, so they never draw over it regardless of array order.
 */
function buildSeriesBandEntries(
  model: LineModel,
  parentSeries: CartesianSeries,
  parentIndex: number,
  band: SeriesBand,
  bandIndex: number,
  theme: ChartTheme
): LineSeriesOption[] {
  const color =
    band.color ??
    parentSeries.color ??
    paletteColor(theme.palette, parentIndex);
  const opacity = band.opacity ?? DEFAULT_BAND_OPACITY;
  const stack = `__band-${parentIndex}-${bandIndex}`;

  const delta = band.upper.map((upperValue, i) => {
    const lowerValue = band.lower[i];
    return upperValue == null || lowerValue == null
      ? null
      : upperValue - lowerValue;
  });

  const shared = {
    type: 'line' as const,
    stack,
    symbol: 'none' as const,
    showSymbol: false,
    silent: true,
    legendHoverLink: false,
    tooltip: { show: false },
    z: 1,
    lineStyle: { opacity: 0 },
    connectNulls: false,
  };

  return [
    {
      ...shared,
      name: `${parentSeries.name} band ${bandIndex} lower`,
      data: toAxisData(model, band.lower),
    },
    {
      ...shared,
      name: `${parentSeries.name} band ${bandIndex} upper`,
      data: toAxisData(model, delta),
      areaStyle: { color, opacity },
    },
  ];
}

/** Builds the ECharts option for a line model. */
export function buildLineOption(
  model: LineModel,
  theme: ChartTheme,
  reducedMotion: boolean,
  nativeOptions?: unknown
): LineEChartsOption {
  const axisNameReserve = model.hideAxes ? 0 : AXIS_NAME_RESERVE_PX;

  const option: LineEChartsOption = {
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
      bottom: model.showLegend ? 48 : 16,
    },
    xAxis: model.timeAxis
      ? {
          type: 'time',
          show: !model.hideAxes,
          axisLabel: { color: theme.secondaryTextColor },
          axisLine: { lineStyle: { color: theme.borderColor } },
        }
      : {
          type: 'category',
          data: model.categories as string[],
          show: !model.hideAxes,
          axisLabel: { color: theme.secondaryTextColor },
          axisLine: { lineStyle: { color: theme.borderColor } },
        },
    yAxis: {
      type: 'value',
      show: !model.hideAxes,
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
    series: model.series.flatMap((series, index) => {
      const color = series.color ?? paletteColor(theme.palette, index);

      const mainSeries: LineSeriesOption = {
        type: 'line',
        name: series.name,
        // A time axis needs explicit [time, value] pairs; a category axis
        // takes bare values positioned by index.
        data: toAxisData(model, series.values),
        smooth: model.smooth,
        showSymbol: model.showPoints,
        symbolSize: 6,
        stack: model.stacked ? 'total' : undefined,
        connectNulls: false,
        lineStyle: { color, width: 2 },
        itemStyle: { color },
      };

      // Reference bands and the forecast divider both span the whole plot,
      // so they are attached to the first logical series only; attaching to
      // every series would draw the same markers once per series.
      if (index === 0) {
        const areaData: LineMarkAreaData = [];
        const lineData: LineMarkLineData = [];

        if (model.referenceBands?.length) {
          const bands = buildReferenceBandMarkers(model);
          areaData.push(...bands.areaData);
          lineData.push(...bands.lineData);
        }

        const forecastIndex = resolveForecastIndex(model);
        if (forecastIndex !== undefined) {
          const forecast = buildForecastMarkers(model, theme, forecastIndex);
          areaData.push(...forecast.areaData);
          lineData.push(...forecast.lineData);
        }

        if (areaData.length) {
          mainSeries.markArea = { silent: true, data: areaData };
        }
        if (lineData.length) {
          mainSeries.markLine = {
            silent: true,
            symbol: 'none',
            data: lineData,
          };
        }
      }

      const bandSeries = (series.bands ?? []).flatMap((band, bandIndex) =>
        buildSeriesBandEntries(model, series, index, band, bandIndex, theme)
      );

      // Band series are placed before the parent line so the transparent
      // base is stacked under its delta before the parent line is added;
      // `z: 1` on band series (vs. the ECharts line default of `z: 3`) is what actually
      // keeps them visually behind the parent line.
      return [...bandSeries, mainSeries];
    }),
  };

  if (nativeOptions && typeof nativeOptions === 'object') {
    return mergeNativeOverrides(option, nativeOptions);
  }

  return option;
}
