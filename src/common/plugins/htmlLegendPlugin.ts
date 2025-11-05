import { Chart } from 'chart.js';
import { renderHTMLLegend } from '../legend/htmlRenderer';

export interface LegendItemClickInfo {
  item: any;
  chart: Chart;
  isHidden: boolean;
  label: string;
  dataIndex?: number;
  datasetIndex?: number;
  element: HTMLElement;
  event?: Event;
}

export interface HtmlLegendPluginOptions {
  containerId: string;
  boxWidth?: number;
  boxHeight?: number;
  borderRadius?: number;
  className?: string;
  itemClassName?: string;
  maxHeight?: number;
  layout?: 'horizontal' | 'vertical';
  onItemClick?: (info: LegendItemClickInfo) => void;
  adjustChartHeight?: boolean;
  reservedLegendHeight?: number;
  columns?: number;
  labelFormatter?: (label: string, item: any) => string;
  itemClassResolver?: (item: any) => string | null;
  searchEnabled?: boolean;
  searchPlaceholder?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart: Chart, _: any, options: HtmlLegendPluginOptions) {
    const container = document.getElementById(options.containerId);
    if (!container) return;
    renderHTMLLegend(chart, container, options);
  },
};
