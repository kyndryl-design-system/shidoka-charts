import { Chart } from 'chart.js';
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

export const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart: Chart, _: any, options: HtmlLegendPluginOptions) {
    const container = document.getElementById(options.containerId);
    if (!container) return;
    renderHTMLLegend(chart, container, options);
  },
};
