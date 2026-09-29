import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { D3ChordRenderer } from './chord-renderer';
import type { ChordModel } from '../../../components/chart-chord/chord.types';
import type { RendererContext } from '../../chart-frame/types';

const model: ChordModel = {
  nodes: [{ label: 'A' }, { label: 'B' }],
  matrix: [
    [0, 5],
    [3, 0],
  ],
  valueLabel: 'Flows',
  sourceLabel: 'From',
  targetLabel: 'To',
  showLabels: true,
  padAngle: 0.04,
};

function context(
  overrides: Partial<RendererContext<ChordModel>> = {}
): RendererContext<ChordModel> {
  return {
    model,
    theme: {
      colorScheme: 'light',
      backgroundColor: '#ffffff',
      textColor: '#111111',
      secondaryTextColor: '#555555',
      borderColor: '#dddddd',
      tooltipBackgroundColor: '#222222',
      tooltipTextColor: '#fafafa',
      palette: ['#aa0000', '#00aa00'],
    },
    reducedMotion: false,
    nativeOptions: undefined,
    emit: () => undefined,
    ...overrides,
  };
}

function createHost(): HTMLElement {
  return {
    clientWidth: 480,
    clientHeight: 480,
    appendChild: vi.fn(),
  } as unknown as HTMLElement;
}

function createSvgElement(): SVGSVGElement {
  const children: Element[] = [];
  return {
    setAttribute: vi.fn(),
    style: { display: '' },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    remove: vi.fn(),
    replaceChildren: vi.fn((...nodes: Element[]) => {
      children.length = 0;
      children.push(...nodes);
    }),
    get children() {
      return children;
    },
  } as unknown as SVGSVGElement;
}

function createGroup(): SVGGElement {
  return {
    style: { opacity: '', transition: '' },
    appendChild: vi.fn(),
  } as unknown as SVGGElement;
}

let frames: Array<() => void> = [];

beforeEach(() => {
  frames = [];
  globalThis.requestAnimationFrame = ((callback: () => void) => {
    frames.push(callback);
    return frames.length;
  }) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = vi.fn();

  vi.stubGlobal(
    'document',
    {
      createElementNS: vi.fn((_ns: string | null, name: string) => {
        if (name === 'svg') return createSvgElement();
        if (name === 'g') return createGroup();
        return {
          setAttribute: vi.fn(),
          style: {},
          textContent: '',
          appendChild: vi.fn(),
        } as unknown as SVGElement;
      }),
    } as unknown as Document
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('D3ChordRenderer', () => {
  it('fades in only on the first draw', () => {
    const renderer = new D3ChordRenderer();
    const host = createHost();

    renderer.mount(host, context());
    const svg = (host.appendChild as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as SVGSVGElement;
    const firstRoot = svg.children[0] as SVGGElement;

    expect(firstRoot.style.opacity).toBe('0');
    expect(frames).toHaveLength(1);

    renderer.update(context());
    const secondRoot = svg.children[0] as SVGGElement;

    expect(secondRoot.style.opacity).toBe('');
    expect(frames).toHaveLength(1);

    renderer.resize();
    const thirdRoot = svg.children[0] as SVGGElement;

    expect(thirdRoot.style.opacity).toBe('');
    expect(frames).toHaveLength(1);
  });

  it('skips the entrance fade when reduced motion is preferred', () => {
    const renderer = new D3ChordRenderer();
    const host = createHost();

    renderer.mount(host, context({ reducedMotion: true }));
    const svg = (host.appendChild as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as SVGSVGElement;
    const root = svg.children[0] as SVGGElement;

    expect(root.style.opacity).toBe('');
    expect(frames).toHaveLength(0);
  });
});
