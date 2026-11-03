import * as echarts from 'echarts/core';
import { TreeChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsType } from 'echarts/core';
import type { TreeSeriesOption } from 'echarts/charts';
import type {
  ChartImageFormat,
  ChartRenderer,
  RendererCapabilities,
  RendererContext,
} from '../../chart-frame/types';
import { treePathKey } from '../../../components/chart-tree/tree-table';
import type { TreeModel } from '../../../components/chart-tree/tree.types';
import { buildTreeOption } from './tree-option';

/**
 * ECharts tree renderer.
 *
 * Only the tree chart, the tooltip component and the canvas renderer are
 * registered, so no other ECharts chart type is pulled into the bundle.
 *
 * Expand/collapse is driven by ECharts `expandAndCollapse`. Collapsed state is
 * read from the live series data before each update so a later `setOption` can
 * replay user interactions. This follows the workaround discussed in
 * https://github.com/apache/echarts/issues/19289 (persist `collapsed` on series
 * data rather than relying on a full rerender).
 */

let registered = false;

function registerEcharts(): void {
  if (registered) return;

  echarts.use([TreeChart, TooltipComponent, CanvasRenderer]);
  registered = true;
}

const CAPABILITIES: RendererCapabilities = {
  imageExport: ['png', 'jpeg'],
  animation: true,
};

interface TreeDatum {
  name?: string;
  collapsed?: boolean;
  children?: TreeDatum[];
}

interface TreeClickParams {
  name?: string;
  value?: number;
  data?: TreeDatum;
  treeAncestors?: { name?: string }[];
}

function pathFromAncestors(
  ancestors: { name?: string }[] | undefined
): string[] {
  return (ancestors ?? [])
    .slice(1)
    .map((entry) => entry.name ?? '')
    .filter(Boolean);
}

function recordCollapsedState(
  collapsedByPath: Record<string, boolean>,
  data: TreeDatum[] | undefined
): void {
  if (!data?.length) return;

  const walk = (nodes: TreeDatum[], parentPath: readonly string[]): void => {
    for (const node of nodes) {
      const path = [...parentPath, node.name ?? ''];
      if (node.collapsed !== undefined) {
        collapsedByPath[treePathKey(path)] = node.collapsed;
      }

      if (node.children?.length) {
        walk(node.children, path);
      }
    }
  };

  walk(data, []);
}

export class EChartsTreeRenderer implements ChartRenderer<TreeModel> {
  readonly capabilities = CAPABILITIES;

  private instance: EChartsType | null = null;
  private host: HTMLElement | null = null;
  private context: RendererContext<TreeModel> | null = null;
  private collapsedByPath: Record<string, boolean> = {};

  mount(host: HTMLElement, context: RendererContext<TreeModel>): void {
    registerEcharts();
    this.host = host;
    this.context = context;
    this.ensureInstance();
  }

  update(context: RendererContext<TreeModel>): void {
    this.context = context;
    this.syncCollapsedFromChart();

    if (!this.ensureInstance()) return;

    this.instance?.setOption(
      buildTreeOption(
        this.modelWithCollapsedState(context.model),
        context.theme,
        context.reducedMotion,
        context.nativeOptions
      ),
      { notMerge: true }
    );
  }

  resize(): void {
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
      this.instance.off('treeExpandAndCollapse');
      this.instance.dispose();
      this.instance = null;
    }

    if (this.host) {
      this.host.replaceChildren();
      this.host = null;
    }

    this.context = null;
    this.collapsedByPath = {};
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

  private modelWithCollapsedState(model: TreeModel): TreeModel {
    if (!Object.keys(this.collapsedByPath).length) return model;

    return {
      ...model,
      collapsedByPath: { ...this.collapsedByPath },
    };
  }

  private hasUsableSize(): boolean {
    if (!this.host) return false;

    return this.host.clientWidth > 0 && this.host.clientHeight > 0;
  }

  private syncCollapsedFromChart(): void {
    if (!this.instance) return;

    const series = (this.instance.getOption().series as TreeSeriesOption[])[0];
    recordCollapsedState(this.collapsedByPath, series?.data as TreeDatum[]);
  }

  private ensureInstance(): boolean {
    if (this.instance) return true;
    if (!this.host || !this.context || !this.hasUsableSize()) return false;

    const instance = echarts.init(this.host, undefined, {
      renderer: 'canvas',
    });

    instance.on('click', (params: unknown) => {
      const detail = params as TreeClickParams;
      const path = pathFromAncestors(detail.treeAncestors);

      this.context?.emit({
        kind: 'select',
        label: detail.name ?? path[path.length - 1] ?? '',
        value: typeof detail.value === 'number' ? detail.value : null,
        path,
      });
    });

    instance.on('treeExpandAndCollapse', (params: unknown) => {
      const detail = params as TreeClickParams;
      const path = pathFromAncestors(detail.treeAncestors);

      if (detail.data?.collapsed !== undefined) {
        this.collapsedByPath[treePathKey(path)] = detail.data.collapsed;
      }
    });

    this.instance = instance;

    instance.setOption(
      buildTreeOption(
        this.modelWithCollapsedState(this.context.model),
        this.context.theme,
        this.context.reducedMotion,
        this.context.nativeOptions
      ),
      { notMerge: true }
    );

    return true;
  }
}
