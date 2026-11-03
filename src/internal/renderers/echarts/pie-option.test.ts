import { describe, expect, it } from 'vitest';
import { buildPieOption, formatPieTooltip } from './pie-option';
import type { ChartTheme } from '../../chart-frame/types';
import type { PieModel } from '../../../components/chart-pie/pie.types';

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

const model: PieModel = {
  slices: [
    { label: 'Web', value: 40 },
    { label: 'Mobile', value: 35 },
    { label: 'Desktop', value: 25 },
  ],
  categoryLabel: 'Platform',
  valueLabel: 'Share',
  showLabels: true,
  showLegend: true,
  innerRadiusRatio: 0,
};

interface PieDatum {
  name: string;
  value: number;
  itemStyle?: { color: string };
}

function slices(option: ReturnType<typeof buildPieOption>): PieDatum[] {
  const series = option.series as unknown as { data: PieDatum[] }[];
  return series[0].data;
}

describe('buildPieOption', () => {
  it('maps each slice label and value in order', () => {
    const data = slices(buildPieOption(model, theme, false));

    expect(data.map((s) => s.name)).toEqual(['Web', 'Mobile', 'Desktop']);
    expect(data.map((s) => s.value)).toEqual([40, 35, 25]);
  });

  it('assigns palette colors by index when no explicit color is set', () => {
    const data = slices(buildPieOption(model, theme, false));

    expect(data[0].itemStyle?.color).toBe('#aa0000');
    expect(data[1].itemStyle?.color).toBe('#00aa00');
    expect(data[2].itemStyle?.color).toBe('#0000aa');
  });

  it('respects an explicit slice color', () => {
    const withColor: PieModel = {
      ...model,
      slices: [{ label: 'Web', value: 40, color: '#123456' }],
    };

    const data = slices(buildPieOption(withColor, theme, false));

    expect(data[0].itemStyle?.color).toBe('#123456');
  });

  it('uses a plain radius string when innerRadiusRatio is 0', () => {
    const option = buildPieOption(model, theme, false);
    const series = option.series as unknown as { radius: unknown }[];

    expect(series[0].radius).toBe('70%');
  });

  it('uses a donut radius array when innerRadiusRatio is greater than 0', () => {
    const option = buildPieOption(
      { ...model, innerRadiusRatio: 0.4 },
      theme,
      false
    );
    const series = option.series as unknown as { radius: unknown }[];

    expect(series[0].radius).toEqual(['40%', '70%']);
  });

  it('clamps innerRadiusRatio above 0.8 down to 0.8', () => {
    const option = buildPieOption(
      { ...model, innerRadiusRatio: 1.5 },
      theme,
      false
    );
    const series = option.series as unknown as { radius: unknown }[];

    expect(series[0].radius).toEqual(['80%', '70%']);
  });

  it('clamps a negative innerRadiusRatio to 0', () => {
    const option = buildPieOption(
      { ...model, innerRadiusRatio: -0.5 },
      theme,
      false
    );
    const series = option.series as unknown as { radius: unknown }[];

    expect(series[0].radius).toBe('70%');
  });

  it('hides labels when showLabels is false', () => {
    const shown = buildPieOption(model, theme, false);
    const hidden = buildPieOption({ ...model, showLabels: false }, theme, false);
    const shownSeries = shown.series as unknown as {
      label: { show: boolean };
    }[];
    const hiddenSeries = hidden.series as unknown as {
      label: { show: boolean };
    }[];

    expect(shownSeries[0].label.show).toBe(true);
    expect(hiddenSeries[0].label.show).toBe(false);
  });

  it('hides the legend when showLegend is false', () => {
    const shown = buildPieOption(model, theme, false);
    const hidden = buildPieOption({ ...model, showLegend: false }, theme, false);

    expect((shown.legend as { show: boolean }).show).toBe(true);
    expect((hidden.legend as { show: boolean }).show).toBe(false);
  });

  it('computes the correct percent of total in the tooltip formatter', () => {
    const text = formatPieTooltip(model, { name: 'Web', value: 40 });

    expect(text).toContain('Web');
    expect(text).toContain('40');
    expect(text).toContain('40.0%');
  });

  it('uses the item tooltip trigger', () => {
    const option = buildPieOption(model, theme, false);
    const tooltip = option.tooltip as { trigger?: string };

    expect(tooltip.trigger).toBe('item');
  });

  it('disables animation when reduced motion is requested', () => {
    const motion = buildPieOption(model, theme, false);
    const reduced = buildPieOption(model, theme, true);

    expect(motion.animation).toBe(true);
    expect(motion.animationDuration).toBeGreaterThan(0);
    expect(reduced.animation).toBe(false);
    expect(reduced.animationDuration).toBe(0);
    expect(reduced.animationDurationUpdate).toBe(0);
  });

  it('merges native overrides into a generated series without dropping data', () => {
    const option = buildPieOption(model, theme, false, {
      series: [{ itemStyle: { borderWidth: 2 } }],
    });

    const series = option.series as unknown as {
      itemStyle?: { borderWidth?: number };
      data: PieDatum[];
    }[];

    expect(series[0].itemStyle?.borderWidth).toBe(2);
    expect(series[0].data).toHaveLength(3);
  });

  it('does not touch the DOM', () => {
    expect(typeof globalThis.document).toBe('undefined');
  });
});
