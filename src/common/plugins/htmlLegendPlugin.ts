import { Chart, Plugin } from 'chart.js';
import { renderHTMLLegend } from '../legend/htmlRenderer';

export interface HtmlLegendPluginOptions {
  containerId: string;
  boxWidth?: number;
  boxHeight?: number;
  borderRadius?: number;
  className?: string;
  itemClassName?: string;
  maxHeight?: number;
  layout?: 'horizontal' | 'vertical';
}

export const htmlLegendPlugin: Plugin = {
  id: 'htmlLegend',
  afterUpdate(chart: Chart, _: any, options: HtmlLegendPluginOptions) {
    const container = document.getElementById(options.containerId);
    if (!container) return;
    renderHTMLLegend(chart, container, {
      boxWidth: options.boxWidth,
      boxHeight: options.boxHeight,
      borderRadius: options.borderRadius,
      className: options.className,
      itemClassName: options.itemClassName,
      maxHeight: options.maxHeight,
      layout: options.layout,
    });
  },
};
