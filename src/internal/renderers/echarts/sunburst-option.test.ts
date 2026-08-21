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
  labelStrategy: 'inline',
  innerRadiusRatio: 0.25,
};

interface Datum {
  name: string;
  value?: number;
  itemStyle?: { color?: string };
  label?: { show: boolean };
  emphasis?: { label: { show: boolean } };
  select?: { label: { show: boolean } };
  blur?: { label: { show: boolean } };
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
      (
        darkOption.series as unknown as { itemStyle: { borderColor: string } }[]
      )[0].itemStyle.borderColor
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

  it('leaves label drawing to the chart with the inline strategy', () => {
    const data = seriesData(buildSunburstOption(model, theme, false));
    const series = (
      option: ReturnType<typeof buildSunburstOption>
    ): { label: { show: boolean; minAngle: number } } =>
      (
        option.series as unknown as {
          label: { show: boolean; minAngle: number };
        }[]
      )[0];

    expect(series(buildSunburstOption(model, theme, false)).label.show).toBe(
      true
    );
    expect(
      series(buildSunburstOption(model, theme, false)).label.minAngle
    ).toBeGreaterThan(0);
    expect(data.every((node) => node.label === undefined)).toBe(true);
  });

  const constrained: SunburstModel = {
    ...model,
    labelStrategy: 'constrained',
    nodes: [
      {
        label: 'Identity and access management',
        children: [{ label: 'Directory synchronization lag', value: 3 }],
      },
      { label: 'Data', value: 200 },
    ],
  };

  it('hides chart-drawn labels only where the constrained strategy needs an anchor', () => {
    const data = seriesData(buildSunburstOption(constrained, theme, false));

    expect(data[0].label?.show).toBe(false);
    expect(data[0].children?.[0].label?.show).toBe(false);
    expect(data[1].label).toBeUndefined();
  });

  it('keeps a suppressed label hidden in every interaction state', () => {
    const data = seriesData(buildSunburstOption(constrained, theme, false));
    const suppressed = [data[0], data[0].children![0]];

    for (const datum of suppressed) {
      expect(datum.label?.show).toBe(false);
      expect(datum.emphasis?.label.show).toBe(false);
      expect(datum.select?.label.show).toBe(false);
      expect(datum.blur?.label.show).toBe(false);
    }
  });

  it('leaves interaction states alone for sectors whose label fits', () => {
    const fitting = seriesData(
      buildSunburstOption(constrained, theme, false)
    )[1];

    expect(fitting.label).toBeUndefined();
    expect(fitting.emphasis).toBeUndefined();
    expect(fitting.select).toBeUndefined();
    expect(fitting.blur).toBeUndefined();
  });

  it('switches off its own tooltip when the overlay anchors own hover detail', () => {
    const tooltip = (option: ReturnType<typeof buildSunburstOption>) =>
      option.tooltip as { show?: boolean };

    expect(tooltip(buildSunburstOption(model, theme, false)).show).toBe(true);
    expect(tooltip(buildSunburstOption(constrained, theme, false)).show).toBe(
      false
    );
  });

  it('keeps its own tooltip when constrained labels are turned off entirely', () => {
    const option = buildSunburstOption(
      { ...constrained, showLabels: false },
      theme,
      false
    );

    expect((option.tooltip as { show?: boolean }).show).toBe(true);
  });

  it('gives each suppressed datum its own state objects', () => {
    const data = seriesData(buildSunburstOption(constrained, theme, false));

    expect(data[0].emphasis).not.toBe(data[0].children?.[0].emphasis);
  });

  it('keeps chart-drawn labels when labels are turned off entirely', () => {
    const data = seriesData(
      buildSunburstOption(
        { ...model, labelStrategy: 'constrained', showLabels: false },
        theme,
        false
      )
    );

    expect(data.every((node) => node.label === undefined)).toBe(true);
  });

  it('pins geometry so planned anchor positions match what is drawn', () => {
    const series = (
      buildSunburstOption(model, theme, false).series as unknown as {
        startAngle: number;
        clockwise: boolean;
        radius: string[];
        sort: (a: { dataIndex: number }, b: { dataIndex: number }) => number;
      }[]
    )[0];

    expect(series.startAngle).toBe(90);
    expect(series.clockwise).toBe(true);
    expect(series.radius[1]).toBe('92%');
    expect(series.sort({ dataIndex: 2 }, { dataIndex: 0 })).toBeGreaterThan(0);
  });

  it('does not touch the DOM', () => {
    expect(typeof globalThis.document).toBe('undefined');
  });
});
