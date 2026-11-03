import { describe, expect, it } from 'vitest';
import { echartsTooltipDefaults } from './echarts-tooltip';
import type { ChartTheme } from '../../chart-frame/types';

const theme: ChartTheme = {
  colorScheme: 'light',
  backgroundColor: '#ffffff',
  textColor: '#111111',
  secondaryTextColor: '#555555',
  borderColor: '#dddddd',
  tooltipBackgroundColor: '#222222',
  tooltipTextColor: '#fafafa',
  palette: ['#aa0000'],
};

describe('echartsTooltipDefaults', () => {
  it('applies shared theme tokens and allows formatter overrides', () => {
    const tooltip = echartsTooltipDefaults(theme, {
      formatter: () => 'detail',
    });

    expect(tooltip).toMatchObject({
      show: true,
      trigger: 'item',
      backgroundColor: '#222222',
      borderWidth: 0,
      textStyle: { color: '#fafafa', fontSize: 12 },
    });
    expect(typeof tooltip.formatter).toBe('function');
  });
});
