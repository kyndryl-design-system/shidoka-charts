import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsType } from 'echarts/core';
import type {
  ChartImageFormat,
  ChartRenderer,
  RendererCapabilities,
  RendererContext,
} from '../../chart-frame/types';
import type { PieModel } from '../../../components/chart-pie/pie.types';
import { buildPieOption } from './pie-option';

/**
 * ECharts pie renderer.
 *
 * Only the pie chart, the legend/tooltip components and the canvas renderer
 * are registered, so no other ECharts chart type is pulled into the bundle.
 */

let registered = false;

function registerEcharts(): void {
  if (registered) return;

  echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);
  registered = true;
}

const CAPABILITIES: RendererCapabilities = {
  imageExport: ['png', 'jpeg'],
  animation: true,
};

interface PieClickParams {
  name?: string;
  value?: number;
}

export class EChartsPieRenderer implements ChartRenderer<PieModel> {
  readonly capabilities = CAPABILITIES;

  private instance: EChartsType | null = null;
  private host: HTMLElement | null = null;
  private context: RendererContext<PieModel> | null = null;

  mount(host: HTMLElement, context: RendererContext<PieModel>): void {
    registerEcharts();
    this.host = host;
    this.context = context;
    this.ensureInstance();
  }

  update(context: RendererContext<PieModel>): void {
    this.context = context;

    if (!this.ensureInstance()) return;

    this.instance?.setOption(
      buildPieOption(
        context.model,
        context.theme,
        context.reducedMotion,
        context.nativeOptions
      ),
      { notMerge: true }
    );
  }

  resize(): void {
    // A hidden host reports zero size; resizing then would blank the canvas.
    if (!this.hasUsableSize()) return;

    if (!this.instance) {
      this.ensureInstance();
      return;
    }

    this.instance.resize();
  }

  destroy(): void {
    if (this.instance) {
      this.instance.off('click');
      this.instance.dispose();
      this.instance = null;
    }

    // ECharts created every child of the host, so clearing it leaves the frame
    // owned host element itself untouched.
    if (this.host) {
      this.host.replaceChildren();
      this.host = null;
    }

    this.context = null;
  }

  toDataUrl(format: ChartImageFormat, backgroundColor: string): string | null {
    if (!this.instance) return null;
    if (!CAPABILITIES.imageExport.includes(format)) return null;

    return this.instance.getDataURL({
      type: format as 'png' | 'jpeg',
      pixelRatio: 2,
      backgroundColor,
    });
  }

  nativeInstance(): unknown {
    return this.instance;
  }

  private hasUsableSize(): boolean {
    if (!this.host) return false;

    return this.host.clientWidth > 0 && this.host.clientHeight > 0;
  }

  /**
   * Initialization is deferred until the host has a measurable box, which
   * happens when a chart mounts inside a collapsed or hidden container.
   */
  private ensureInstance(): boolean {
    if (this.instance) return true;
    if (!this.host || !this.context || !this.hasUsableSize()) return false;

    const instance = echarts.init(this.host, undefined, {
      renderer: 'canvas',
    });

    instance.on('click', (params: unknown) => {
      const detail = params as PieClickParams;

      this.context?.emit({
        kind: 'select',
        label: detail.name ?? '',
        value: typeof detail.value === 'number' ? detail.value : null,
        path: [detail.name].filter((part): part is string => Boolean(part)),
      });
    });

    this.instance = instance;

    instance.setOption(
      buildPieOption(
        this.context.model,
        this.context.theme,
        this.context.reducedMotion,
        this.context.nativeOptions
      ),
      { notMerge: true }
    );

    return true;
  }
}
