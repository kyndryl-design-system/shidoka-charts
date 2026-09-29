import { describe, expect, it } from 'vitest';
import { buildLineOption } from './line-option';
import type { ChartTheme } from '../../chart-frame/types';
import type { LineModel } from '../../../components/chart-line/line.types';

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

const model: LineModel = {
  categories: ['Jan', 'Feb', 'Mar'],
  series: [
    { name: 'Web', values: [10, 20, 30] },
    { name: 'Mobile', values: [5, 15, 25] },
  ],
  categoryLabel: 'Month',
  valueLabel: 'Users',
  showLegend: true,
  stacked: false,
  smooth: false,
  showPoints: true,
};

interface SeriesDatum {
  type: string;
  name: string;
  data: (number | null)[];
  stack?: string;
  smooth?: boolean;
  showSymbol?: boolean;
  lineStyle?: { color: string; width: number; opacity?: number };
  itemStyle?: { color: string };
  areaStyle?: { color: string; opacity: number };
  tooltip?: { show: boolean };
  z?: number;
  markArea?: {
    data: [
      {
        yAxis?: number;
        xAxis?: number;
        itemStyle?: { color: string; opacity: number };
      },
      { yAxis?: number; xAxis?: number }
    ][];
  };
  markLine?: {
    data: {
      yAxis?: number;
      xAxis?: number;
      lineStyle?: { color: string; type?: string };
      label?: { show: boolean; formatter?: string; color?: string };
    }[];
  };
}

function series(option: ReturnType<typeof buildLineOption>): SeriesDatum[] {
  return option.series as unknown as SeriesDatum[];
}

describe('buildLineOption', () => {
  it('maps each series name and values in order', () => {
    const data = series(buildLineOption(model, theme, false));

    expect(data.map((s) => s.name)).toEqual(['Web', 'Mobile']);
    expect(data[0].data).toEqual([10, 20, 30]);
    expect(data[1].data).toEqual([5, 15, 25]);
    expect(data.every((s) => s.type === 'line')).toBe(true);
  });

  it('assigns palette colors by index when no explicit color is set', () => {
    const data = series(buildLineOption(model, theme, false));

    expect(data[0].itemStyle?.color).toBe('#aa0000');
    expect(data[0].lineStyle?.color).toBe('#aa0000');
    expect(data[1].itemStyle?.color).toBe('#00aa00');
  });

  it('respects an explicit series color', () => {
    const withColor: LineModel = {
      ...model,
      series: [{ name: 'Web', values: [1, 2, 3], color: '#123456' }],
    };

    const data = series(buildLineOption(withColor, theme, false));

    expect(data[0].itemStyle?.color).toBe('#123456');
    expect(data[0].lineStyle?.color).toBe('#123456');
  });

  it('sets stack on every series when stacked', () => {
    const data = series(
      buildLineOption({ ...model, stacked: true }, theme, false)
    );

    expect(data.every((s) => s.stack === 'total')).toBe(true);
  });

  it('leaves stack undefined when not stacked', () => {
    const data = series(buildLineOption(model, theme, false));

    expect(data.every((s) => s.stack === undefined)).toBe(true);
  });

  it('hides the legend when showLegend is false', () => {
    const shown = buildLineOption(model, theme, false);
    const hidden = buildLineOption(
      { ...model, showLegend: false },
      theme,
      false
    );

    expect((shown.legend as { show: boolean }).show).toBe(true);
    expect((hidden.legend as { show: boolean }).show).toBe(false);
  });

  it('disables animation when reduced motion is requested', () => {
    const motion = buildLineOption(model, theme, false);
    const reduced = buildLineOption(model, theme, true);

    expect(motion.animation).toBe(true);
    expect(motion.animationDuration).toBeGreaterThan(0);
    expect(reduced.animation).toBe(false);
    expect(reduced.animationDuration).toBe(0);
    expect(reduced.animationDurationUpdate).toBe(0);
  });

  it('merges native overrides into a generated series without dropping data', () => {
    const option = buildLineOption(model, theme, false, {
      series: [{ lineStyle: { color: '#ff00ff' } }],
    });

    const data = series(option);

    expect(data[0].lineStyle?.color).toBe('#ff00ff');
    expect(data[0].data).toEqual([10, 20, 30]);
  });

  it('does not add an areaStyle to line series', () => {
    const data = series(buildLineOption(model, theme, false));

    expect(data.every((s) => s.areaStyle === undefined)).toBe(true);
  });

  it('applies smooth and showSymbol from the model', () => {
    const data = series(
      buildLineOption(
        { ...model, smooth: true, showPoints: false },
        theme,
        false
      )
    );

    expect(data.every((s) => s.smooth === true)).toBe(true);
    expect(data.every((s) => s.showSymbol === false)).toBe(true);
  });

  it('uses the axis tooltip trigger', () => {
    const option = buildLineOption(model, theme, false);
    const tooltip = option.tooltip as { trigger?: string };

    expect(tooltip.trigger).toBe('axis');
  });

  it('names the value axis from the model label, and leaves the category axis unnamed', () => {
    const option = buildLineOption(model, theme, false);

    // The category axis holds arbitrary user strings with no bounded width,
    // so it never gets a `name`: a fixed `nameGap` can't guarantee no overlap
    // with tick labels of unknown length. `categoryLabel` still drives the
    // table/CSV column header instead.
    expect((option.xAxis as { name?: string }).name).toBeUndefined();
    expect((option.yAxis as { name?: string }).name).toBe('Users');
  });

  it('uses a category axis with bare values by default', () => {
    const option = buildLineOption(model, theme, false);
    const xAxis = option.xAxis as unknown as { type: string; data?: string[] };

    expect(xAxis.type).toBe('category');
    expect(xAxis.data).toEqual(['Jan', 'Feb', 'Mar']);
    expect((option.series as unknown as { data: unknown[] }[])[0].data).toEqual(
      [10, 20, 30]
    );
  });

  it('uses a time axis with [time, value] pairs when timeAxis is set', () => {
    const option = buildLineOption({ ...model, timeAxis: true }, theme, false);
    const xAxis = option.xAxis as unknown as { type: string; data?: string[] };

    expect(xAxis.type).toBe('time');
    expect(xAxis.data).toBeUndefined();
    expect((option.series as unknown as { data: unknown[] }[])[0].data).toEqual(
      [
        ['Jan', 10],
        ['Feb', 20],
        ['Mar', 30],
      ]
    );
  });

  it('shows both axes by default', () => {
    const option = buildLineOption(model, theme, false);

    expect((option.xAxis as unknown as { show: boolean }).show).toBe(true);
    expect((option.yAxis as unknown as { show: boolean }).show).toBe(true);
  });

  it('hides both axes and collapses the reserved margin when hideAxes is set', () => {
    const option = buildLineOption({ ...model, hideAxes: true }, theme, false);
    const grid = option.grid as unknown as { left: number };

    expect((option.xAxis as unknown as { show: boolean }).show).toBe(false);
    expect((option.yAxis as unknown as { show: boolean }).show).toBe(false);
    expect(grid.left).toBe(16);
  });

  it('does not touch the DOM', () => {
    expect(typeof globalThis.document).toBe('undefined');
  });
});

describe('buildLineOption referenceBands', () => {
  const bands = [
    { value: 60, color: '#333333' },
    { value: 20, color: '#111111' },
    { value: 40, color: '#222222', label: 'Warning' },
  ];

  it('sorts bands ascending by value regardless of input order', () => {
    const data = series(
      buildLineOption({ ...model, referenceBands: bands }, theme, false)
    );

    const values = data[0].markLine?.data.map((d) => d.yAxis);
    expect(values).toEqual([20, 40, 60]);
  });

  it('produces one markArea pair and one markLine entry per boundary', () => {
    const data = series(
      buildLineOption({ ...model, referenceBands: bands }, theme, false)
    );

    expect(data[0].markArea?.data).toHaveLength(3);
    expect(data[0].markLine?.data).toHaveLength(3);
  });

  it('fills each band with the NEXT boundary color, and the topmost band with its own color', () => {
    const data = series(
      buildLineOption({ ...model, referenceBands: bands }, theme, false)
    );
    const areas = data[0].markArea!.data;

    // Sorted: 20 (#111111) -> 40 (#222222) -> 60 (#333333)
    expect(areas[0][0].itemStyle?.color).toBe('#222222'); // 20-40 band uses 40's color
    expect(areas[1][0].itemStyle?.color).toBe('#333333'); // 40-60 band uses 60's color
    expect(areas[2][0].itemStyle?.color).toBe('#333333'); // topmost band uses its own color
    expect(areas.every((pair) => pair[0].itemStyle?.opacity === 0.1)).toBe(
      true
    );
  });

  it('draws each boundary line in its own full-opacity color, with a label only when provided', () => {
    const data = series(
      buildLineOption({ ...model, referenceBands: bands }, theme, false)
    );
    const lines = data[0].markLine!.data;

    expect(lines[0].lineStyle?.color).toBe('#111111');
    expect(lines[1].lineStyle?.color).toBe('#222222');
    expect(lines[1].label?.formatter).toBe('Warning');
    expect(lines[1].label?.show).toBe(true);
    expect(lines[0].label?.show).toBe(false);
  });

  it('attaches markArea and markLine to the first series only', () => {
    const data = series(
      buildLineOption({ ...model, referenceBands: bands }, theme, false)
    );

    expect(data[0].markArea).toBeDefined();
    expect(data[0].markLine).toBeDefined();
    expect(data[1].markArea).toBeUndefined();
    expect(data[1].markLine).toBeUndefined();
  });
});

describe('buildLineOption SeriesBand', () => {
  const bandModel: LineModel = {
    ...model,
    series: [
      {
        name: 'Median',
        values: [10, 20, 30],
        bands: [
          {
            lower: [8, 16, 24],
            upper: [12, 24, 36],
            opacity: 0.4,
            color: '#00ff00',
          },
        ],
      },
      { name: 'Mobile', values: [5, 15, 25] },
    ],
  };

  it('emits exactly two extra series per band, excluded from the legend', () => {
    const option = buildLineOption(bandModel, theme, false);
    const data = series(option);

    const bandSeries = data.filter((s) => s.name.includes('band'));
    expect(bandSeries).toHaveLength(2);

    const legend = option.legend as { data: string[] };
    expect(legend.data).toEqual(['Median', 'Mobile']);
    bandSeries.forEach((s) => {
      expect(legend.data).not.toContain(s.name);
    });
  });

  it('computes the delta series as upper - lower elementwise', () => {
    const data = series(buildLineOption(bandModel, theme, false));
    const lower = data.find((s) => s.name.includes('lower'))!;
    const upper = data.find((s) => s.name.includes('upper'))!;

    expect(lower.data).toEqual([8, 16, 24]);
    expect(upper.data).toEqual([4, 8, 12]);
    expect(upper.areaStyle?.color).toBe('#00ff00');
    expect(upper.areaStyle?.opacity).toBe(0.4);
  });

  it('propagates nulls: either bound missing yields a null delta', () => {
    const withNulls: LineModel = {
      ...model,
      series: [
        {
          name: 'Median',
          values: [10, 20, 30],
          bands: [{ lower: [8, null, 24], upper: [12, 24, null] }],
        },
      ],
    };

    const data = series(buildLineOption(withNulls, theme, false));
    const upper = data.find((s) => s.name.includes('upper'))!;

    expect(upper.data).toEqual([4, null, null]);
  });

  it('excludes band series from the tooltip', () => {
    const data = series(buildLineOption(bandModel, theme, false));
    const bandSeries = data.filter((s) => s.name.includes('band'));

    bandSeries.forEach((s) => {
      expect(s.tooltip?.show).toBe(false);
    });
  });

  it('leaves the parent series data unchanged', () => {
    const data = series(buildLineOption(bandModel, theme, false));
    const parent = data.find((s) => s.name === 'Median')!;

    expect(parent.data).toEqual([10, 20, 30]);
  });

  it('renders band series behind the parent line', () => {
    const data = series(buildLineOption(bandModel, theme, false));
    const bandSeries = data.filter((s) => s.name.includes('band'));
    const parent = data.find((s) => s.name === 'Median')!;

    bandSeries.forEach((s) => {
      // The parent line sets no explicit z, so it takes the ECharts
      // line-series default of 3.
      expect(s.z).toBeLessThan(parent.z ?? 3);
    });
  });

  it('does not disturb the parent series own stack when stacked is set', () => {
    const data = series(
      buildLineOption({ ...bandModel, stacked: true }, theme, false)
    );

    const parents = data.filter((s) => !s.name.includes('band'));
    expect(parents.every((s) => s.stack === 'total')).toBe(true);

    const bandSeries = data.filter((s) => s.name.includes('band'));
    bandSeries.forEach((s) => {
      expect(s.stack).not.toBe('total');
    });
  });
});

describe('buildLineOption forecastFrom', () => {
  it('resolves a category label to its index', () => {
    const data = series(
      buildLineOption({ ...model, forecastFrom: 'Feb' }, theme, false)
    );

    expect(data[0].markLine?.data[0].xAxis).toBe(1);
    expect(data[0].markArea?.data[0][0].xAxis).toBe(1);
    expect(data[0].markArea?.data[0][1].xAxis).toBe(2);
  });

  it('is a no-op when the category label does not match', () => {
    const data = series(
      buildLineOption({ ...model, forecastFrom: 'NotACategory' }, theme, false)
    );

    expect(data[0].markLine).toBeUndefined();
    expect(data[0].markArea).toBeUndefined();
  });

  it('uses a numeric forecastFrom directly as an index', () => {
    const data = series(
      buildLineOption({ ...model, forecastFrom: 2 }, theme, false)
    );

    expect(data[0].markLine?.data[0].xAxis).toBe(2);
  });
});

describe('buildLineOption regression: new optional fields absent', () => {
  it('produces the same option whether the new fields are omitted or explicitly undefined', () => {
    const withoutFields = buildLineOption(model, theme, false);
    const withUndefinedFields = buildLineOption(
      {
        ...model,
        referenceBands: undefined,
        forecastFrom: undefined,
      },
      theme,
      false
    );

    expect(withUndefinedFields).toEqual(withoutFields);
  });

  it('adds no markArea/markLine when there are no reference bands or forecast', () => {
    const data = series(buildLineOption(model, theme, false));

    expect(data.every((s) => s.markArea === undefined)).toBe(true);
    expect(data.every((s) => s.markLine === undefined)).toBe(true);
  });
});
