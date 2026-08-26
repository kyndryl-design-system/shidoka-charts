import { describe, expect, it } from 'vitest';
import {
  buildTreeOption,
  formatTreeTooltip,
  treeSeriesBounds,
} from './tree-option';
import type { ChartTheme } from '../../chart-frame/types';
import type { TreeModel } from '../../../components/chart-tree/tree.types';

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

const model: TreeModel = {
  nodes: [
    {
      label: 'Runtime',
      collapsed: true,
      children: [
        { label: 'Kubernetes', value: 10 },
        { label: 'Service mesh', value: 5 },
      ],
    },
    { label: 'Storage', value: 8 },
    { label: 'Fixed', value: 3, color: '#123456' },
  ],
  categoryLabel: 'Team',
  valueLabel: 'Headcount',
  showLabels: true,
  orientation: 'LR',
  layout: 'orthogonal',
  initialTreeDepth: 2,
  expandAndCollapse: true,
};

interface Datum {
  name: string;
  value?: number;
  collapsed?: boolean;
  itemStyle?: { color?: string };
  children?: Datum[];
}

function seriesData(option: ReturnType<typeof buildTreeOption>): Datum[] {
  const series = (option.series as unknown as { data: Datum[] }[])[0];
  return series.data;
}

function seriesOption(option: ReturnType<typeof buildTreeOption>) {
  return (option.series as unknown as Record<string, unknown>[])[0];
}

describe('buildTreeOption', () => {
  it('maps the hierarchy and keeps authored order', () => {
    const data = seriesData(buildTreeOption(model, theme, false));

    expect(data.map((node) => node.name)).toEqual([
      'Runtime',
      'Storage',
      'Fixed',
    ]);
    expect(data[0].children?.map((child) => child.name)).toEqual([
      'Kubernetes',
      'Service mesh',
    ]);
    expect(data[0].value).toBeUndefined();
    expect(data[1].value).toBe(8);
  });

  it('seeds top level colors from the palette and lets branches inherit', () => {
    const data = seriesData(buildTreeOption(model, theme, false));

    expect(data[0].itemStyle?.color).toBe('#aa0000');
    expect(data[0].children?.[0].itemStyle?.color).toBe('#aa0000');
    expect(data[1].itemStyle?.color).toBe('#00aa00');
  });

  it('respects authored collapsed state and replayed collapsedByPath', () => {
    const data = seriesData(buildTreeOption(model, theme, false));
    expect(data[0].collapsed).toBe(true);

    const replayed = seriesData(
      buildTreeOption(
        {
          ...model,
          nodes: [
            {
              label: 'Runtime',
              children: [
                { label: 'Kubernetes', value: 10 },
                { label: 'Service mesh', value: 5 },
              ],
            },
          ],
          collapsedByPath: {
            Runtime: false,
            'Runtime\u0000Kubernetes': true,
          },
        },
        theme,
        false
      )
    );

    expect(replayed[0].collapsed).toBe(false);
    expect(replayed[0].children?.[0].collapsed).toBe(true);
  });

  it('enables expand and collapse with the requested layout', () => {
    const option = buildTreeOption(model, theme, false);
    const series = seriesOption(option);

    expect(series.expandAndCollapse).toBe(true);
    expect(series.initialTreeDepth).toBe(2);
    expect(series.layout).toBe('orthogonal');
    expect(series.orient).toBe('LR');
    expect(series.label).toMatchObject({ rotate: 0, distance: 6 });
    expect(series.leaves?.label).toMatchObject({ rotate: 0, distance: 6 });
  });

  it('allocates orientation-aware margins with room for long labels', () => {
    const option = buildTreeOption(model, theme, false);
    const series = seriesOption(option);

    expect(treeSeriesBounds('LR', 'orthogonal')).toEqual({
      top: '10%',
      left: '20%',
      bottom: '10%',
      right: '22%',
    });
    expect(series.left).toBe('20%');
    expect(series.right).toBe('22%');

    const wide = buildTreeOption(
      {
        ...model,
        nodes: [
          {
            label: 'Platform engineering and infrastructure operations',
            children: [{ label: 'Kubernetes', value: 10 }],
          },
        ],
      },
      theme,
      false
    );
    const wideSeries = seriesOption(wide);

    expect(parseFloat(String(wideSeries.left))).toBeGreaterThan(20);
  });

  it('maps radial layout and orientation overrides', () => {
    const option = buildTreeOption(
      {
        ...model,
        orientation: 'TB',
        layout: 'radial',
      },
      theme,
      false
    );
    const series = seriesOption(option);

    expect(series.layout).toBe('radial');
    expect(series.orient).toBe('TB');
  });

  it('disables animation when reduced motion is requested', () => {
    const option = buildTreeOption(model, theme, true);

    expect(option.animation).toBe(false);
    expect(option.animationDuration).toBe(0);
    expect(option.animationDurationUpdate).toBe(0);
  });
});

describe('formatTreeTooltip', () => {
  it('formats leaf tooltips with the value label', () => {
    expect(
      formatTreeTooltip(model, {
        name: 'Kubernetes',
        value: 10,
        treeAncestors: [{}, { name: 'Runtime' }, { name: 'Kubernetes' }],
      })
    ).toBe('Runtime / Kubernetes<br/>Headcount: 10');
  });

  it('formats branch tooltips without a value line', () => {
    expect(
      formatTreeTooltip(model, {
        name: 'Runtime',
        treeAncestors: [{}, { name: 'Runtime' }],
      })
    ).toBe('Runtime');
  });
});
