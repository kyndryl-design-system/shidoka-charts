import { describe, expect, it } from 'vitest';
import { buildAreaOption } from './area-option';
import type { ChartTheme } from '../../chart-frame/types';
import type { AreaModel } from '../../../components/chart-area/area.types';

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

const model: AreaModel = {
  categories: ['Q1', 'Q2', 'Q3'],
  series: [
    { name: 'Platform', values: [10, 20, 30] },
    { name: 'Services', values: [5, 15, 25] },
  ],
  categoryLabel: 'Quarter',
  valueLabel: 'Revenue',
  showLegend: true,
  stacked: false,
  smooth: false,
  showPoints: false,
};

interface SeriesDatum {
  type: string;
  name: string;
  data: (number | null)[];
  stack?: string;
  smooth?: boolean;
  showSymbol?: boolean;
  lineStyle?: { color: string; width: number };
  itemStyle?: { color: string };
  areaStyle?: { color: string; opacity: number };
}

function series(option: ReturnType<typeof buildAreaOption>): SeriesDatum[] {
  return option.series as unknown as SeriesDatum[];
}

describe('buildAreaOption', () => {
  it('maps each series name and values in order', () => {
    const data = series(buildAreaOption(model, theme, false));

    expect(data.map((s) => s.name)).toEqual(['Platform', 'Services']);
    expect(data[0].data).toEqual([10, 20, 30]);
    expect(data[1].data).toEqual([5, 15, 25]);
    expect(data.every((s) => s.type === 'line')).toBe(true);
  });

  it('assigns palette colors by index when no explicit color is set', () => {
    const data = series(buildAreaOption(model, theme, false));

    expect(data[0].itemStyle?.color).toBe('#aa0000');
    expect(data[0].areaStyle?.color).toBe('#aa0000');
    expect(data[1].itemStyle?.color).toBe('#00aa00');
  });

  it('respects an explicit series color', () => {
    const withColor: AreaModel = {
      ...model,
      series: [{ name: 'Platform', values: [1, 2, 3], color: '#123456' }],
    };

    const data = series(buildAreaOption(withColor, theme, false));

    expect(data[0].itemStyle?.color).toBe('#123456');
    expect(data[0].areaStyle?.color).toBe('#123456');
  });

  it('sets stack on every series when stacked', () => {
    const data = series(
      buildAreaOption({ ...model, stacked: true }, theme, false)
    );

    expect(data.every((s) => s.stack === 'total')).toBe(true);
  });

  it('raises area opacity when stacked', () => {
    const overlaid = series(buildAreaOption(model, theme, false));
    const stacked = series(
      buildAreaOption({ ...model, stacked: true }, theme, false)
    );

    expect(overlaid[0].areaStyle?.opacity).toBe(0.25);
    expect(stacked[0].areaStyle?.opacity).toBe(0.6);
  });

  it('hides the legend when showLegend is false', () => {
    const shown = buildAreaOption(model, theme, false);
    const hidden = buildAreaOption(
      { ...model, showLegend: false },
      theme,
      false
    );

    expect((shown.legend as { show: boolean }).show).toBe(true);
    expect((hidden.legend as { show: boolean }).show).toBe(false);
  });

  it('disables animation when reduced motion is requested', () => {
    const motion = buildAreaOption(model, theme, false);
    const reduced = buildAreaOption(model, theme, true);

    expect(motion.animation).toBe(true);
    expect(motion.animationDuration).toBeGreaterThan(0);
    expect(reduced.animation).toBe(false);
    expect(reduced.animationDuration).toBe(0);
    expect(reduced.animationDurationUpdate).toBe(0);
  });

  it('merges native overrides into a generated series without dropping data', () => {
    const option = buildAreaOption(model, theme, false, {
      series: [{ lineStyle: { color: '#ff00ff' } }],
    });

    const data = series(option);

    expect(data[0].lineStyle?.color).toBe('#ff00ff');
    expect(data[0].data).toEqual([10, 20, 30]);
  });

  it('always includes an areaStyle', () => {
    const data = series(buildAreaOption(model, theme, false));

    expect(data.every((s) => s.areaStyle !== undefined)).toBe(true);
  });

  it('applies smooth and showSymbol from the model', () => {
    const data = series(
      buildAreaOption(
        { ...model, smooth: true, showPoints: true },
        theme,
        false
      )
    );

    expect(data.every((s) => s.smooth === true)).toBe(true);
    expect(data.every((s) => s.showSymbol === true)).toBe(true);
  });

  it('uses the axis tooltip trigger', () => {
    const option = buildAreaOption(model, theme, false);
    const tooltip = option.tooltip as { trigger?: string };

    expect(tooltip.trigger).toBe('axis');
  });

  it('names the value axis from the model label, and leaves the category axis unnamed', () => {
    const option = buildAreaOption(model, theme, false);

    // The category axis holds arbitrary user strings with no bounded width,
    // so it never gets a `name`: a fixed `nameGap` can't guarantee no overlap
    // with tick labels of unknown length. `categoryLabel` still drives the
    // table/CSV column header instead.
    expect((option.xAxis as { name?: string }).name).toBeUndefined();
    expect((option.yAxis as { name?: string }).name).toBe('Revenue');
  });

  it('does not touch the DOM', () => {
    expect(typeof globalThis.document).toBe('undefined');
  });
});
