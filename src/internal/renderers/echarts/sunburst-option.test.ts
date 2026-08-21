import { describe, expect, it } from 'vitest';
import { buildSunburstOption } from './sunburst-option';
import type { ChartTheme } from '../../chart-frame/types';
import type { SunburstModel } from '../../../components/chart-sunburst/sunburst.types';

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

const model: SunburstModel = {
  nodes: [
    {
      label: 'Compute',
      children: [
        { label: 'VMs', value: 10 },
        { label: 'Serverless', value: 5 },
      ],
    },
    { label: 'Storage', value: 8 },
    { label: 'Fixed', value: 3, color: '#123456' },
  ],
  categoryLabel: 'Service',
  valueLabel: 'Spend',
  showLabels: true,
  innerRadiusRatio: 0.25,
};

interface Datum {
  name: string;
  value?: number;
  itemStyle?: { color?: string };
  children?: Datum[];
}

function seriesData(option: ReturnType<typeof buildSunburstOption>): Datum[] {
  const series = (option.series as unknown as { data: Datum[] }[])[0];
  return series.data;
}

describe('buildSunburstOption', () => {
  it('maps the hierarchy and keeps authored order', () => {
    const data = seriesData(buildSunburstOption(model, theme, false));

    expect(data.map((node) => node.name)).toEqual([
      'Compute',
      'Storage',
      'Fixed',
    ]);
    expect(data[0].children?.map((child) => child.name)).toEqual([
      'VMs',
      'Serverless',
    ]);
    expect(data[0].value).toBeUndefined();
    expect(data[1].value).toBe(8);
  });

  it('seeds top level colors from the palette and lets branches inherit', () => {
    const data = seriesData(buildSunburstOption(model, theme, false));

    expect(data[0].itemStyle?.color).toBe('#aa0000');
    expect(data[0].children?.[0].itemStyle?.color).toBe('#aa0000');
    expect(data[1].itemStyle?.color).toBe('#00aa00');
  });

  it('respects an explicit node color', () => {
    const data = seriesData(buildSunburstOption(model, theme, false));

    expect(data[2].itemStyle?.color).toBe('#123456');
  });

  it('disables animation when reduced motion is requested', () => {
    const motion = buildSunburstOption(model, theme, false);
    const reduced = buildSunburstOption(model, theme, true);

    expect(motion.animation).toBe(true);
    expect(motion.animationDuration).toBeGreaterThan(0);
    expect(reduced.animation).toBe(false);
    expect(reduced.animationDuration).toBe(0);
    expect(reduced.animationDurationUpdate).toBe(0);
  });

  it('derives the inner radius from the model ratio and clamps it', () => {
    const series = (option: ReturnType<typeof buildSunburstOption>) =>
      (option.series as unknown as { radius: string[] }[])[0].radius;

    expect(series(buildSunburstOption(model, theme, false))[0]).toBe('25%');
    expect(
      series(
        buildSunburstOption({ ...model, innerRadiusRatio: 5 }, theme, false)
      )[0]
    ).toBe('80%');
    expect(
      series(
        buildSunburstOption({ ...model, innerRadiusRatio: -2 }, theme, false)
      )[0]
    ).toBe('0%');
  });

  it('applies theme colors so a color-scheme change changes the option', () => {
    const dark: ChartTheme = {
      ...theme,
      colorScheme: 'dark',
      textColor: '#eeeeee',
      backgroundColor: '#1d1d1d',
    };

    const light = buildSunburstOption(model, theme, false);
    const darkOption = buildSunburstOption(model, dark, false);

    expect(light.textStyle?.color).toBe('#111111');
    expect(darkOption.textStyle?.color).toBe('#eeeeee');
    expect(
      (darkOption.series as unknown as { itemStyle: { borderColor: string } }[])[0]
        .itemStyle.borderColor
    ).toBe('#1d1d1d');
  });

  it('merges native overrides into the generated series without dropping data', () => {
    const option = buildSunburstOption(model, theme, false, {
      series: [{ itemStyle: { borderRadius: 4 } }],
      tooltip: { show: false },
    });

    const series = (
      option.series as unknown as {
        data: Datum[];
        itemStyle: { borderRadius?: number; borderWidth: number };
      }[]
    )[0];

    expect(series.data).toHaveLength(3);
    expect(series.itemStyle.borderRadius).toBe(4);
    expect(series.itemStyle.borderWidth).toBe(2);
    expect((option.tooltip as { show?: boolean }).show).toBe(false);
  });

  it('does not touch the DOM', () => {
    expect(typeof globalThis.document).toBe('undefined');
  });
});
