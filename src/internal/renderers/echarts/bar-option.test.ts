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
  data: (number | null)[];
  stack?: string;
  itemStyle?: { color: string };
  barMaxWidth?: number;
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
    const hidden = buildBarOption({ ...model, showLegend: false }, theme, false);

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

  it('does not touch the DOM', () => {
    expect(typeof globalThis.document).toBe('undefined');
  });
});
