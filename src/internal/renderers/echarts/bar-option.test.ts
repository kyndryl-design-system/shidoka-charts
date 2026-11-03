import { describe, expect, it } from 'vitest';
import { buildBarOption } from './bar-option';
import type { ChartTheme } from '../../chart-frame/types';
import type { BarModel } from '../../../components/chart-bar/bar.types';

const theme: ChartTheme = {
  colorScheme: 'light',
  backgroundColor: '#ffffff',
  textColor: '#111111',
  secondaryTextColor: '#555555',
  borderColor: '#dddddd',
  tooltipBackgroundColor: '#222222',
  tooltipTextColor: '#fafafa',
  palette: ['#aa0000', '#00aa00', '#0000aa'],
};

const model: BarModel = {
  categories: ['Jan', 'Feb', 'Mar'],
  series: [
    { name: 'Web', values: [10, 20, 30] },
    { name: 'Mobile', values: [5, 15, 25] },
  ],
  categoryLabel: 'Month',
  valueLabel: 'Users',
  showLegend: true,
  stacked: false,
  horizontal: false,
};

interface SeriesDatum {
  type: string;
  name: string;
  data: unknown[];
  stack?: string;
  itemStyle?: { color: string };
  barMaxWidth?: number;
  barWidth?: number;
  label?: { show: boolean; position: string; formatter: () => string };
  markLine?: {
    label?: { formatter?: string };
    data: Record<string, number>[];
  };
}

interface AxisLike {
  type: string;
  show?: boolean;
  max?: number;
  name?: string;
}

/** Reads the axis that carries values for the model's orientation. */
function valueAxis(
  option: ReturnType<typeof buildBarOption>,
  horizontal: boolean
): AxisLike {
  return (horizontal ? option.xAxis : option.yAxis) as unknown as AxisLike;
}

function categoryAxis(
  option: ReturnType<typeof buildBarOption>,
  horizontal: boolean
): AxisLike {
  return (horizontal ? option.yAxis : option.xAxis) as unknown as AxisLike;
}

function series(option: ReturnType<typeof buildBarOption>): SeriesDatum[] {
  return option.series as unknown as SeriesDatum[];
}

describe('buildBarOption', () => {
  it('maps each series name and values in order', () => {
    const data = series(buildBarOption(model, theme, false));

    expect(data.map((s) => s.name)).toEqual(['Web', 'Mobile']);
    expect(data[0].data).toEqual([10, 20, 30]);
    expect(data[1].data).toEqual([5, 15, 25]);
    expect(data.every((s) => s.type === 'bar')).toBe(true);
  });

  it('assigns palette colors by index when no explicit color is set', () => {
    const data = series(buildBarOption(model, theme, false));

    expect(data[0].itemStyle?.color).toBe('#aa0000');
    expect(data[1].itemStyle?.color).toBe('#00aa00');
  });

  it('respects an explicit series color', () => {
    const withColor: BarModel = {
      ...model,
      series: [{ name: 'Web', values: [1, 2, 3], color: '#123456' }],
    };

    const data = series(buildBarOption(withColor, theme, false));

    expect(data[0].itemStyle?.color).toBe('#123456');
  });

  it('sets stack on every series when stacked', () => {
    const data = series(
      buildBarOption({ ...model, stacked: true }, theme, false)
    );

    expect(data.every((s) => s.stack === 'total')).toBe(true);
  });

  it('leaves stack undefined when not stacked', () => {
    const data = series(buildBarOption(model, theme, false));

    expect(data.every((s) => s.stack === undefined)).toBe(true);
  });

  it('hides the legend when showLegend is false', () => {
    const shown = buildBarOption(model, theme, false);
    const hidden = buildBarOption(
      { ...model, showLegend: false },
      theme,
      false
    );

    expect((shown.legend as { show: boolean }).show).toBe(true);
    expect((hidden.legend as { show: boolean }).show).toBe(false);
  });

  it('uses a category x-axis and value y-axis by default', () => {
    const option = buildBarOption(model, theme, false);

    expect((option.xAxis as { type?: string }).type).toBe('category');
    expect((option.yAxis as { type?: string }).type).toBe('value');
  });

  it('swaps axis types when horizontal', () => {
    const option = buildBarOption({ ...model, horizontal: true }, theme, false);

    expect((option.xAxis as { type?: string }).type).toBe('value');
    expect((option.yAxis as { type?: string }).type).toBe('category');
    expect((option.yAxis as { data?: string[] }).data).toEqual(
      model.categories
    );
  });

  it('names the value axis from the model label, and leaves the category axis unnamed', () => {
    const option = buildBarOption(model, theme, false);

    // The category axis holds arbitrary user strings with no bounded width,
    // so it never gets a `name`: a fixed `nameGap` can't guarantee no overlap
    // with tick labels of unknown length. `categoryLabel` still drives the
    // table/CSV column header instead.
    expect((option.xAxis as { name?: string }).name).toBeUndefined();
    expect((option.yAxis as { name?: string }).name).toBe('Users');
  });

  it('keeps the value-axis name on whichever axis is the value axis when horizontal', () => {
    const option = buildBarOption({ ...model, horizontal: true }, theme, false);

    expect((option.yAxis as { name?: string }).name).toBeUndefined();
    expect((option.xAxis as { name?: string }).name).toBe('Users');
  });

  it('disables animation when reduced motion is requested', () => {
    const motion = buildBarOption(model, theme, false);
    const reduced = buildBarOption(model, theme, true);

    expect(motion.animation).toBe(true);
    expect(motion.animationDuration).toBeGreaterThan(0);
    expect(reduced.animation).toBe(false);
    expect(reduced.animationDuration).toBe(0);
    expect(reduced.animationDurationUpdate).toBe(0);
  });

  it('uses the axis tooltip trigger with a shadow pointer', () => {
    const option = buildBarOption(model, theme, false);
    const tooltip = option.tooltip as {
      trigger?: string;
      axisPointer?: { type?: string };
    };

    expect(tooltip.trigger).toBe('axis');
    expect(tooltip.axisPointer?.type).toBe('shadow');
  });

  it('merges native overrides into a generated series without dropping data', () => {
    const option = buildBarOption(model, theme, false, {
      series: [{ itemStyle: { color: '#ff00ff' } }],
    });

    const data = series(option);

    expect(data[0].itemStyle?.color).toBe('#ff00ff');
    expect(data[0].data).toEqual([10, 20, 30]);
  });

  it('renders a floating tuple series as a custom series, not a bar series', () => {
    const floating: BarModel = {
      ...model,
      series: [
        {
          name: 'Range',
          values: [
            [2, 10],
            [13, 7],
            [3, -3],
          ],
        },
      ],
    };

    const data = series(buildBarOption(floating, theme, false));

    // A plain bar series would read `[2, 10]` as the point (x=2, y=10) and
    // draw a single bar from the baseline at category index 2, so the
    // floating variant must not be a 'bar'.
    expect(data[0].type).toBe('custom');
  });

  it('encodes floating tuples as [categoryIndex, min, max] without reordering', () => {
    const floating: BarModel = {
      ...model,
      series: [
        {
          name: 'Range',
          values: [
            [2, 10],
            [13, 7],
            [3, -3],
          ],
        },
      ],
    };

    const data = series(buildBarOption(floating, theme, false));

    // min > max and ranges crossing zero are preserved exactly as given.
    expect(data[0].data).toEqual([
      [0, 2, 10],
      [1, 13, 7],
      [2, 3, -3],
    ]);
  });

  it('keeps a gap for a null value in a floating series', () => {
    const floating: BarModel = {
      ...model,
      series: [{ name: 'Range', values: [[2, 10], null, [3, 5]] }],
    };

    const data = series(buildBarOption(floating, theme, false));

    expect(data[0].data).toEqual([
      [0, 2, 10],
      [1, null, null],
      [2, 3, 5],
    ]);
  });

  it('leaves a scalar series as a plain bar series', () => {
    const data = series(buildBarOption(model, theme, false));

    expect(data.every((s) => s.type === 'bar')).toBe(true);
    expect(data[0].data).toEqual([10, 20, 30]);
  });

  it('caps bar width responsively when no thickness is given', () => {
    const data = series(buildBarOption(model, theme, false));

    expect(data[0].barMaxWidth).toBe(48);
    expect(data[0].barWidth).toBeUndefined();
  });

  it('uses a fixed bar width when barThickness is set', () => {
    const data = series(
      buildBarOption({ ...model, barThickness: 20 }, theme, false)
    );

    expect(data[0].barWidth).toBe(20);
    expect(data[0].barMaxWidth).toBeUndefined();
  });

  it('bounds the value axis when valueMax is set', () => {
    const option = buildBarOption({ ...model, valueMax: 100 }, theme, false);

    expect(valueAxis(option, false).max).toBe(100);
  });

  it('leaves the value axis auto scaled when valueMax is absent', () => {
    const option = buildBarOption(model, theme, false);

    expect(valueAxis(option, false).max).toBeUndefined();
  });

  it('shows both axes and the tooltip by default', () => {
    const option = buildBarOption(model, theme, false);

    expect(valueAxis(option, false).show).toBe(true);
    expect(categoryAxis(option, false).show).toBe(true);
    expect((option.tooltip as unknown as { show?: boolean }).show).not.toBe(
      false
    );
  });

  it('hides both axes and collapses the reserved axis-name margin', () => {
    const option = buildBarOption({ ...model, hideAxes: true }, theme, false);
    const grid = option.grid as unknown as { left: number; bottom: number };

    expect(valueAxis(option, false).show).toBe(false);
    expect(categoryAxis(option, false).show).toBe(false);
    expect(grid.left).toBe(16);
    expect(grid.bottom).toBe(48);
  });

  it('suppresses the tooltip when hideTooltip is set', () => {
    const option = buildBarOption(
      { ...model, hideTooltip: true },
      theme,
      false
    );

    expect((option.tooltip as unknown as { show: boolean }).show).toBe(false);
  });

  it('labels each bar with its series name when showSeriesLabels is set', () => {
    const data = series(
      buildBarOption({ ...model, showSeriesLabels: true }, theme, false)
    );

    expect(data[0].label?.show).toBe(true);
    expect(data[0].label?.position).toBe('inside');
    expect(data[0].label?.formatter()).toBe('Web');
    expect(data[1].label?.formatter()).toBe('Mobile');
  });

  it('omits bar labels by default', () => {
    const data = series(buildBarOption(model, theme, false));

    expect(data[0].label).toBeUndefined();
  });

  it('draws the indicator on the value axis of a vertical chart', () => {
    const data = series(
      buildBarOption(
        { ...model, indicator: { value: 62, label: '62' } },
        theme,
        false
      )
    );

    expect(data[0].markLine?.data).toEqual([{ yAxis: 62 }]);
    expect(data[0].markLine?.label?.formatter).toBe('62');
    expect(data[1].markLine).toBeUndefined();
  });

  it('draws the indicator on the value axis of a horizontal chart', () => {
    const data = series(
      buildBarOption(
        { ...model, horizontal: true, indicator: { value: 62 } },
        theme,
        false
      )
    );

    expect(data[0].markLine?.data).toEqual([{ xAxis: 62 }]);
    expect(data[0].markLine?.label?.formatter).toBe('62');
  });

  it('keeps the value axis name on the value axis in both orientations', () => {
    expect(valueAxis(buildBarOption(model, theme, false), false).name).toBe(
      'Users'
    );
    expect(
      valueAxis(
        buildBarOption({ ...model, horizontal: true }, theme, false),
        true
      ).name
    ).toBe('Users');
  });

  it('does not touch the DOM', () => {
    expect(typeof globalThis.document).toBe('undefined');
  });
});

/** Rect produced by a floating series' `renderItem`. */
interface RenderedRect {
  type: string;
  shape?: { x: number; y: number; width: number; height: number };
}

type RenderItemFn = (params: unknown, api: unknown) => RenderedRect;

const CATEGORY_SLOT = 100;

/**
 * Minimal stand-in for the `renderItem` API. The category axis maps index
 * `i` to pixel `50 + i * CATEGORY_SLOT`, and the value axis maps value `v`
 * to pixel `300 - v * 10`, so a rect's geometry is exactly predictable.
 */
function fakeApi(datum: (number | null)[], horizontal: boolean) {
  return {
    value: (dimension: number) => datum[dimension],
    coord: ([first, second]: number[]) =>
      horizontal
        ? [300 - first * 10, 50 + second * CATEGORY_SLOT]
        : [50 + first * CATEGORY_SLOT, 300 - second * 10],
    size: () => (horizontal ? [30, CATEGORY_SLOT] : [CATEGORY_SLOT, 30]),
  };
}

/** Renders the first datum of series `index` and returns its rect. */
function renderFirstRect(
  option: ReturnType<typeof buildBarOption>,
  index: number,
  horizontal = false
): RenderedRect {
  const entry = (
    option.series as unknown as {
      data: (number | null)[][];
      renderItem: RenderItemFn;
    }[]
  )[index];

  return entry.renderItem({}, fakeApi(entry.data[0], horizontal));
}

const twoFloating: BarModel = {
  ...model,
  series: [
    {
      name: 'Sensor 1',
      values: [
        [2, 10],
        [3, 5],
        [4, 9],
      ],
    },
    {
      name: 'Sensor 2',
      values: [
        [6, 14],
        [4, 9],
        [7, 13],
      ],
    },
  ],
};

describe('buildBarOption floating bar layout', () => {
  it('dodges two floating series into non-overlapping, gapped sub-slots', () => {
    const option = buildBarOption(twoFloating, theme, false);

    const first = renderFirstRect(option, 0).shape!;
    const second = renderFirstRect(option, 1).shape!;

    // Category 0 is centered on pixel 50.
    expect(first.width).toBe(second.width);
    expect(first.x).toBeLessThan(second.x);
    // Non-overlapping, separated by the 2px surface gap.
    expect(second.x - (first.x + first.width)).toBeCloseTo(2, 6);
    // The pair stays centered on the category.
    expect((first.x + second.x + second.width) / 2).toBeCloseTo(50, 6);
    // Both still span their own value range: 2..10 and 6..14.
    expect(first.y).toBeCloseTo(300 - 10 * 10, 6);
    expect(first.height).toBeCloseTo(80, 6);
    expect(second.y).toBeCloseTo(300 - 14 * 10, 6);
    expect(second.height).toBeCloseTo(80, 6);
  });

  it('dodges two floating series in the horizontal orientation too', () => {
    const option = buildBarOption(
      { ...twoFloating, horizontal: true },
      theme,
      false
    );

    const first = renderFirstRect(option, 0, true).shape!;
    const second = renderFirstRect(option, 1, true).shape!;

    expect(first.height).toBe(second.height);
    expect(second.y - (first.y + first.height)).toBeCloseTo(2, 6);
    expect((first.y + second.y + second.height) / 2).toBeCloseTo(50, 6);
  });

  it('leaves a single floating series centered at the original thickness', () => {
    const option = buildBarOption(
      { ...model, series: [twoFloating.series[0]] },
      theme,
      false
    );

    const rect = renderFirstRect(option, 0).shape!;

    // min(slot * 0.6, BAR_MAX_WIDTH) === min(60, 48) === 48, centered on 50.
    expect(rect.width).toBeCloseTo(48, 6);
    expect(rect.x).toBeCloseTo(50 - 24, 6);
  });

  it('honors an explicit barThickness for a single floating series', () => {
    const option = buildBarOption(
      { ...model, series: [twoFloating.series[0]], barThickness: 12 },
      theme,
      false
    );

    const rect = renderFirstRect(option, 0).shape!;

    expect(rect.width).toBeCloseTo(12, 6);
    expect(rect.x).toBeCloseTo(50 - 6, 6);
  });

  it('clamps an overflowing explicit barThickness so dodged bars cannot overlap', () => {
    const option = buildBarOption(
      { ...twoFloating, barThickness: 96 },
      theme,
      false
    );

    const first = renderFirstRect(option, 0).shape!;
    const second = renderFirstRect(option, 1).shape!;

    expect(first.x + first.width).toBeLessThanOrEqual(second.x);
    expect(second.x - (first.x + first.width)).toBeCloseTo(2, 6);
  });

  it('draws nothing for a null gap in a floating series', () => {
    const option = buildBarOption(
      { ...model, series: [{ name: 'Range', values: [null, [1, 2], [3, 4]] }] },
      theme,
      false
    );

    const entry = (
      option.series as unknown as {
        data: (number | null)[][];
        renderItem: RenderItemFn;
      }[]
    )[0];

    expect(entry.renderItem({}, fakeApi(entry.data[0], false)).type).toBe(
      'group'
    );
  });
});

describe('buildBarOption floating tooltip', () => {
  type TooltipFormatter = (params: unknown) => string;

  function formatterFor(candidate: BarModel): TooltipFormatter | undefined {
    return (
      buildBarOption(candidate, theme, false).tooltip as unknown as {
        formatter?: TooltipFormatter;
      }
    ).formatter;
  }

  it('renders a floating series row as a min to max range', () => {
    const text = formatterFor(twoFloating)!([
      {
        axisValueLabel: 'Jan',
        seriesIndex: 0,
        seriesName: 'Sensor 1',
        value: [0, 2, 10],
        marker: '',
      },
      {
        axisValueLabel: 'Jan',
        seriesIndex: 1,
        seriesName: 'Sensor 2',
        value: [0, 6, 14],
        marker: '',
      },
    ]);

    expect(text).toBe(
      'Jan<br/>Sensor 1: 2 \u2013 10<br/>Sensor 2: 6 \u2013 14'
    );
  });

  it('keeps a single value for a scalar series sharing the tooltip', () => {
    const mixed: BarModel = {
      ...model,
      series: [twoFloating.series[0], { name: 'Mobile', values: [5, 15, 25] }],
    };

    const text = formatterFor(mixed)!([
      {
        axisValueLabel: 'Jan',
        seriesIndex: 0,
        seriesName: 'Sensor 1',
        value: [0, 2, 10],
      },
      { axisValueLabel: 'Jan', seriesIndex: 1, seriesName: 'Mobile', value: 5 },
    ]);

    expect(text).toBe('Jan<br/>Sensor 1: 2 \u2013 10<br/>Mobile: 5');
  });

  it('omits the row for a floating gap', () => {
    const text = formatterFor(twoFloating)!([
      {
        axisValueLabel: 'Feb',
        seriesIndex: 0,
        seriesName: 'Sensor 1',
        value: [1, null, null],
      },
      {
        axisValueLabel: 'Feb',
        seriesIndex: 1,
        seriesName: 'Sensor 2',
        value: [1, 4, 9],
      },
    ]);

    expect(text).toBe('Feb<br/>Sensor 2: 4 \u2013 9');
  });

  it('includes the series marker when ECharts supplies one', () => {
    const text = formatterFor(twoFloating)!([
      {
        axisValueLabel: 'Jan',
        seriesIndex: 0,
        seriesName: 'Sensor 1',
        value: [0, 2, 10],
        marker: '<i></i>',
      },
    ]);

    expect(text).toBe('Jan<br/><i></i>Sensor 1: 2 \u2013 10');
  });

  it('adds no formatter when no series is floating', () => {
    expect(formatterFor(model)).toBeUndefined();
  });

  it('still suppresses the tooltip for a floating model when hideTooltip is set', () => {
    const tooltip = buildBarOption(
      { ...twoFloating, hideTooltip: true },
      theme,
      false
    ).tooltip as unknown as { show: boolean; backgroundColor: string };

    expect(tooltip.show).toBe(false);
    // Theming from echartsTooltipDefaults survives the formatter override.
    expect(tooltip.backgroundColor).toBe('#222222');
  });
});

describe('buildBarOption category axis placement', () => {
  it('pins the category axis to the grid edge, not to value zero', () => {
    const vertical = buildBarOption(model, theme, false);
    const horizontal = buildBarOption(
      { ...model, horizontal: true },
      theme,
      false
    );

    expect(
      (
        categoryAxis(vertical, false) as unknown as {
          axisLine: { onZero: boolean };
        }
      ).axisLine.onZero
    ).toBe(false);
    expect(
      (
        categoryAxis(horizontal, true) as unknown as {
          axisLine: { onZero: boolean };
        }
      ).axisLine.onZero
    ).toBe(false);
  });
});
