import type { ChartImageFormat, ChartRenderer, RendererContext } from './types';

/**
 * Owns a renderer instance and everything attached to it. Every observer,
 * animation frame and engine instance created here is released by `destroy`,
 * which is what keeps disconnect and reconnect leak free.
 */
export class RendererController<TModel> {
  private renderer: ChartRenderer<TModel> | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private resizeFrame = 0;

  constructor(private readonly factory: () => ChartRenderer<TModel>) {}

  get mounted(): boolean {
    return this.renderer !== null;
  }

  mount(host: HTMLElement, context: RendererContext<TModel>): void {
    this.destroy();

    const renderer = this.factory();
    renderer.mount(host, context);
    this.renderer = renderer;

    this.resizeObserver = new ResizeObserver(() => this.scheduleResize());
    this.resizeObserver.observe(host);
  }

  update(context: RendererContext<TModel>): void {
    this.renderer?.update(context);
  }

  toDataUrl(format: ChartImageFormat, backgroundColor: string): string | null {
    return this.renderer?.toDataUrl(format, backgroundColor) ?? null;
  }

  nativeInstance(): unknown {
    return this.renderer?.nativeInstance() ?? null;
  }

  destroy(): void {
    if (this.resizeFrame) {
      cancelAnimationFrame(this.resizeFrame);
      this.resizeFrame = 0;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    this.renderer?.destroy();
    this.renderer = null;
  }

  /**
   * Resize is coalesced into a single frame. ResizeObserver can fire many
   * times during a layout pass and engines reflow synchronously.
   */
  private scheduleResize(): void {
    if (this.resizeFrame) return;

    this.resizeFrame = requestAnimationFrame(() => {
      this.resizeFrame = 0;
      this.renderer?.resize();
    });
  }
}
