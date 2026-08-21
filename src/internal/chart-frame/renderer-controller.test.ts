import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RendererController } from './renderer-controller';
import type {
  ChartRenderer,
  RendererContext,
  RendererCapabilities,
} from './types';

/**
 * Lifecycle contract for the shared renderer controller. Every observer,
 * animation frame and engine instance created on mount has to be released on
 * destroy, which is what makes disconnect and reconnect leak free.
 */

interface Frame {
  id: number;
  callback: () => void;
}

const observers: FakeResizeObserver[] = [];
let frames: Frame[] = [];
let nextFrameId = 1;

class FakeResizeObserver {
  observed: unknown[] = [];
  disconnected = false;

  constructor(private readonly callback: () => void) {
    observers.push(this);
  }

  observe(target: unknown): void {
    this.observed.push(target);
  }

  disconnect(): void {
    this.disconnected = true;
  }

  trigger(): void {
    this.callback();
  }
}

class FakeRenderer implements ChartRenderer<string> {
  static instances: FakeRenderer[] = [];

  readonly capabilities: RendererCapabilities = {
    imageExport: ['png'],
    animation: true,
  };

  mounted = false;
  destroyed = false;
  resizes = 0;
  updates: string[] = [];

  constructor() {
    FakeRenderer.instances.push(this);
  }

  mount(_host: HTMLElement, context: RendererContext<string>): void {
    this.mounted = true;
    this.updates.push(context.model);
  }

  update(context: RendererContext<string>): void {
    this.updates.push(context.model);
  }

  resize(): void {
    this.resizes += 1;
  }

  destroy(): void {
    this.destroyed = true;
    this.mounted = false;
  }

  toDataUrl(): string | null {
    return 'data:image/png;base64,stub';
  }

  nativeInstance(): unknown {
    return this;
  }
}

function context(model: string): RendererContext<string> {
  return {
    model,
    theme: {
      colorScheme: 'light',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      secondaryTextColor: '#555555',
      borderColor: '#dddddd',
      tooltipBackgroundColor: '#222222',
      tooltipTextColor: '#eeeeee',
      palette: ['#aa0000'],
    },
    reducedMotion: false,
    nativeOptions: undefined,
    emit: () => undefined,
  };
}

const host = {} as HTMLElement;

function flushFrames(): void {
  const pending = frames;
  frames = [];
  for (const frame of pending) frame.callback();
}

beforeEach(() => {
  observers.length = 0;
  FakeRenderer.instances.length = 0;
  frames = [];
  nextFrameId = 1;

  globalThis.ResizeObserver =
    FakeResizeObserver as unknown as typeof ResizeObserver;
  globalThis.requestAnimationFrame = ((callback: () => void) => {
    const id = nextFrameId++;
    frames.push({ id, callback });
    return id;
  }) as unknown as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((id: number) => {
    frames = frames.filter((frame) => frame.id !== id);
  }) as unknown as typeof cancelAnimationFrame;
});

afterEach(() => {
  delete (globalThis as Record<string, unknown>).ResizeObserver;
  delete (globalThis as Record<string, unknown>).requestAnimationFrame;
  delete (globalThis as Record<string, unknown>).cancelAnimationFrame;
});

describe('RendererController', () => {
  it('mounts one renderer and observes the host', () => {
    const controller = new RendererController(() => new FakeRenderer());
    controller.mount(host, context('first'));

    expect(controller.mounted).toBe(true);
    expect(FakeRenderer.instances).toHaveLength(1);
    expect(FakeRenderer.instances[0].updates).toEqual(['first']);
    expect(observers).toHaveLength(1);
    expect(observers[0].observed).toEqual([host]);
  });

  it('coalesces a burst of resize notifications into one frame', () => {
    const controller = new RendererController(() => new FakeRenderer());
    controller.mount(host, context('first'));

    observers[0].trigger();
    observers[0].trigger();
    observers[0].trigger();
    expect(frames).toHaveLength(1);

    flushFrames();
    expect(FakeRenderer.instances[0].resizes).toBe(1);
  });

  it('releases the observer, the pending frame and the renderer on destroy', () => {
    const controller = new RendererController(() => new FakeRenderer());
    controller.mount(host, context('first'));
    observers[0].trigger();

    controller.destroy();

    expect(controller.mounted).toBe(false);
    expect(observers[0].disconnected).toBe(true);
    expect(FakeRenderer.instances[0].destroyed).toBe(true);
    expect(frames).toHaveLength(0);

    // A frame that was already queued must not resize a destroyed renderer.
    flushFrames();
    expect(FakeRenderer.instances[0].resizes).toBe(0);
  });

  it('is safe to destroy repeatedly and when never mounted', () => {
    const controller = new RendererController(() => new FakeRenderer());

    expect(() => controller.destroy()).not.toThrow();
    controller.mount(host, context('first'));
    controller.destroy();
    expect(() => controller.destroy()).not.toThrow();
    expect(FakeRenderer.instances).toHaveLength(1);
  });

  it('remounts with a fresh renderer and observer after destroy', () => {
    const controller = new RendererController(() => new FakeRenderer());

    controller.mount(host, context('first'));
    controller.destroy();
    controller.mount(host, context('second'));

    expect(controller.mounted).toBe(true);
    expect(FakeRenderer.instances).toHaveLength(2);
    expect(FakeRenderer.instances[0].destroyed).toBe(true);
    expect(FakeRenderer.instances[1].destroyed).toBe(false);
    expect(FakeRenderer.instances[1].updates).toEqual(['second']);
    expect(observers).toHaveLength(2);
    expect(observers[0].disconnected).toBe(true);
    expect(observers[1].disconnected).toBe(false);
  });

  it('never leaves two live renderers when mount is called twice', () => {
    const controller = new RendererController(() => new FakeRenderer());

    controller.mount(host, context('first'));
    controller.mount(host, context('second'));

    expect(FakeRenderer.instances).toHaveLength(2);
    expect(FakeRenderer.instances[0].destroyed).toBe(true);
    expect(observers[0].disconnected).toBe(true);
  });

  it('delegates update, export and the native instance while mounted', () => {
    const controller = new RendererController(() => new FakeRenderer());
    controller.mount(host, context('first'));
    controller.update(context('second'));

    expect(FakeRenderer.instances[0].updates).toEqual(['first', 'second']);
    expect(controller.toDataUrl('png', '#ffffff')).toBe(
      'data:image/png;base64,stub'
    );
    expect(controller.nativeInstance()).toBe(FakeRenderer.instances[0]);
  });

  it('reports nothing once unmounted', () => {
    const controller = new RendererController(() => new FakeRenderer());
    controller.mount(host, context('first'));
    controller.destroy();

    expect(controller.toDataUrl('png', '#ffffff')).toBeNull();
    expect(controller.nativeInstance()).toBeNull();
    expect(() => controller.update(context('third'))).not.toThrow();
    expect(FakeRenderer.instances[0].updates).toEqual(['first']);
  });
});
