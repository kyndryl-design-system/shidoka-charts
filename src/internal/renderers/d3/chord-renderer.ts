import type {
  ChartImageFormat,
  ChartRenderer,
  RendererCapabilities,
  RendererContext,
} from '../../chart-frame/types';
import { formatValue } from '../../chart-frame/format';
import type { ChordModel } from '../../../components/chart-chord/chord.types';
import { buildChordGeometry } from './chord-layout';

/**
 * D3 chord renderer.
 *
 * D3 is used for layout and path geometry only. This renderer owns a single
 * SVG subtree inside the host supplied by the frame and touches nothing else in
 * the document.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const FADE_DURATION_MS = 300;
const LABEL_FONT_SIZE = 12;

const CAPABILITIES: RendererCapabilities = {
  imageExport: ['svg'],
  animation: true,
};

/**
 * Engine-native overrides for the chord renderer. These are raw SVG
 * presentation attributes applied verbatim to the generated elements, not a
 * cross-engine option shape.
 */
interface ChordNativeOptions {
  arcAttributes?: Record<string, string>;
  ribbonAttributes?: Record<string, string>;
  labelAttributes?: Record<string, string>;
}

function nativeOptionsOf(value: unknown): ChordNativeOptions {
  return value && typeof value === 'object'
    ? (value as ChordNativeOptions)
    : {};
}

function applyAttributes(
  element: Element,
  attributes: Record<string, string> | undefined
): void {
  if (!attributes) return;

  for (const [name, value] of Object.entries(attributes)) {
    if (typeof value === 'string') element.setAttribute(name, value);
  }
}

function createElement<K extends keyof SVGElementTagNameMap>(
  name: K
): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, name);
}

function appendTitle(parent: SVGElement, text: string): void {
  const title = createElement('title');
  title.textContent = text;
  parent.appendChild(title);
}

export class D3ChordRenderer implements ChartRenderer<ChordModel> {
  readonly capabilities = CAPABILITIES;

  private host: HTMLElement | null = null;
  private svg: SVGSVGElement | null = null;
  private context: RendererContext<ChordModel> | null = null;
  private pointerListener: ((event: Event) => void) | null = null;
  private clickListener: ((event: Event) => void) | null = null;
  private fadeFrame = 0;
  private hasDrawn = false;

  mount(host: HTMLElement, context: RendererContext<ChordModel>): void {
    this.host = host;
    this.context = context;

    const svg = createElement('svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    // The frame host carries the accessible name; the table view carries the
    // data, so the drawing itself is presentational.
    svg.setAttribute('aria-hidden', 'true');
    svg.style.display = 'block';

    this.clickListener = (event: Event) => this.emitFromEvent(event, 'select');
    this.pointerListener = (event: Event) => this.emitFromEvent(event, 'hover');
    svg.addEventListener('click', this.clickListener);
    svg.addEventListener('pointerover', this.pointerListener);

    host.appendChild(svg);
    this.svg = svg;

    this.draw();
  }

  update(context: RendererContext<ChordModel>): void {
    this.context = context;
    this.draw();
  }

  resize(): void {
    this.draw();
  }

  destroy(): void {
    if (this.fadeFrame) {
      cancelAnimationFrame(this.fadeFrame);
      this.fadeFrame = 0;
    }

    if (this.svg) {
      if (this.clickListener) {
        this.svg.removeEventListener('click', this.clickListener);
      }
      if (this.pointerListener) {
        this.svg.removeEventListener('pointerover', this.pointerListener);
      }
      this.svg.remove();
      this.svg = null;
    }

    this.clickListener = null;
    this.pointerListener = null;
    this.host = null;
    this.context = null;
    this.hasDrawn = false;
  }

  toDataUrl(format: ChartImageFormat, backgroundColor: string): string | null {
    if (format !== 'svg' || !this.svg) return null;

    const clone = this.svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', SVG_NS);
    clone.removeAttribute('aria-hidden');

    const viewBox = clone.getAttribute('viewBox');
    if (viewBox) {
      const [x, y, width, height] = viewBox.split(/\s+/);
      const background = createElement('rect');
      background.setAttribute('x', x);
      background.setAttribute('y', y);
      background.setAttribute('width', width);
      background.setAttribute('height', height);
      background.setAttribute('fill', backgroundColor);
      clone.insertBefore(background, clone.firstChild);
    }

    const markup = new XMLSerializer().serializeToString(clone);

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  }

  nativeInstance(): unknown {
    return this.svg;
  }

  private emitFromEvent(event: Event, kind: 'select' | 'hover'): void {
    const target = event.target as Element | null;
    const element = target?.closest?.('[data-chord-label]');
    if (!element || !this.context) return;

    const rawValue = element.getAttribute('data-chord-value');
    const parsed = rawValue === null ? Number.NaN : Number(rawValue);
    const path = (element.getAttribute('data-chord-path') ?? '')
      .split('\u001f')
      .filter(Boolean);

    this.context.emit({
      kind,
      label: element.getAttribute('data-chord-label') ?? '',
      value: Number.isFinite(parsed) ? parsed : null,
      path,
    });
  }

  private draw(): void {
    if (!this.svg || !this.context || !this.host) return;

    const width = this.host.clientWidth;
    const height = this.host.clientHeight;
    if (width <= 0 || height <= 0) return;

    const { model, theme, reducedMotion } = this.context;
    const native = nativeOptionsOf(this.context.nativeOptions);
    const geometry = buildChordGeometry(model, theme, Math.min(width, height));

    this.svg.setAttribute(
      'viewBox',
      `${-width / 2} ${-height / 2} ${width} ${height}`
    );

    const root = createElement('g');

    const ribbonLayer = createElement('g');
    for (const ribbon of geometry.ribbons) {
      const path = createElement('path');
      path.setAttribute('d', ribbon.path);
      path.setAttribute('fill', ribbon.color);
      path.setAttribute('fill-opacity', '0.62');
      path.setAttribute('stroke', theme.backgroundColor);
      path.setAttribute('stroke-width', '0.5');
      path.setAttribute('data-chord-label', ribbon.sourceLabel);
      path.setAttribute('data-chord-value', String(ribbon.value));
      path.setAttribute(
        'data-chord-path',
        `${ribbon.sourceLabel}\u001f${ribbon.targetLabel}`
      );
      path.style.cursor = 'pointer';
      applyAttributes(path, native.ribbonAttributes);
      appendTitle(
        path,
        `${ribbon.sourceLabel} → ${ribbon.targetLabel}\n${
          model.valueLabel
        }: ${formatValue(ribbon.value)}`
      );
      ribbonLayer.appendChild(path);
    }
    root.appendChild(ribbonLayer);

    const arcLayer = createElement('g');
    for (const arc of geometry.arcs) {
      const path = createElement('path');
      path.setAttribute('d', arc.path);
      path.setAttribute('fill', arc.color);
      path.setAttribute('stroke', theme.backgroundColor);
      path.setAttribute('stroke-width', '1');
      path.setAttribute('data-chord-label', arc.label);
      path.setAttribute('data-chord-value', String(arc.value));
      path.setAttribute('data-chord-path', arc.label);
      path.style.cursor = 'pointer';
      applyAttributes(path, native.arcAttributes);
      appendTitle(
        path,
        `${arc.label}\n${model.valueLabel}: ${formatValue(arc.value)}`
      );
      arcLayer.appendChild(path);
    }
    root.appendChild(arcLayer);

    if (model.showLabels) {
      const labelLayer = createElement('g');
      for (const arc of geometry.arcs) {
        const text = createElement('text');
        text.setAttribute('transform', arc.labelTransform);
        text.setAttribute('text-anchor', arc.labelAnchor);
        text.setAttribute('dy', '0.35em');
        text.setAttribute('fill', theme.textColor);
        text.setAttribute('font-size', String(LABEL_FONT_SIZE));
        text.setAttribute('font-family', 'Roboto, sans-serif');
        text.textContent = arc.label;
        applyAttributes(text, native.labelAttributes);
        labelLayer.appendChild(text);
      }
      root.appendChild(labelLayer);
    }

    if (this.fadeFrame) {
      cancelAnimationFrame(this.fadeFrame);
      this.fadeFrame = 0;
    }

    const animateEntrance = !this.hasDrawn && !reducedMotion;

    if (animateEntrance) {
      root.style.opacity = '0';
      root.style.transition = `opacity ${FADE_DURATION_MS}ms ease-out`;
    }

    this.svg.replaceChildren(root);
    this.hasDrawn = true;

    if (animateEntrance) {
      // A single frame, tracked so disconnect cannot leave one pending.
      this.fadeFrame = requestAnimationFrame(() => {
        this.fadeFrame = 0;
        root.style.opacity = '1';
      });
    }
  }
}
