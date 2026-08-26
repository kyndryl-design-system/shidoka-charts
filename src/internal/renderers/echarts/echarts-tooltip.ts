import type { TooltipComponentOption } from 'echarts/components';
import type { ChartTheme } from '../../chart-frame/types';

/** Shared ECharts tooltip defaults themed from the chart frame tokens. */
export function echartsTooltipDefaults(
  theme: ChartTheme,
  overrides: Partial<TooltipComponentOption> = {}
): TooltipComponentOption {
  return {
    show: true,
    trigger: 'item',
    backgroundColor: theme.tooltipBackgroundColor,
    borderWidth: 0,
    textStyle: { color: theme.tooltipTextColor, fontSize: 12 },
    ...overrides,
  };
}
