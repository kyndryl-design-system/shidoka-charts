/**
 * Engine-neutral contracts shared by hybrid chart components.
 *
 * Nothing in this module may import a charting engine. Renderer
 * implementations depend on these contracts; the contracts never depend on a
 * renderer.
 */

/** Image formats a renderer may be able to produce. */
export type ChartImageFormat = 'png' | 'jpeg' | 'svg';

/** Active color scheme resolved from the document. */
export type ChartColorScheme = 'light' | 'dark';

/** Design token values resolved for the active color scheme. */
export interface ChartTheme {
  colorScheme: ChartColorScheme;
  /** Opaque page background, used for image export and segment separators. */
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  borderColor: string;
  tooltipBackgroundColor: string;
  tooltipTextColor: string;
  palette: readonly string[];
}

/** Tabular fallback for a chart, also used as the CSV source of truth. */
export interface ChartTableView {
  columns: readonly string[];
  rows: readonly (readonly (string | number)[])[];
}

/** Viewport coordinates for a frame-managed hover tooltip. */
export interface ChartPointer {
  clientX: number;
  clientY: number;
}

/** Plain-text content rendered by the shared frame tooltip. */
export interface TooltipContent {
  lines: readonly string[];
}

/** Normalized interaction emitted by every renderer. */
export interface ChartInteraction {
  kind: 'select' | 'hover';
  /** Human readable label of the interacted element. */
  label: string;
  /** Numeric value where one exists. */
  value: number | null;
  /** Hierarchy or endpoint path, outermost last. */
  path: readonly string[];
  /**
   * Present on hover when the frame should show a following tooltip. Engine
   * renderers that supply their own tooltip UI omit this field.
   */
  pointer?: ChartPointer;
}

/**
 * What a renderer can do. The frame drives its chrome from these flags so it
 * never has to know which engine is mounted.
 */
export interface RendererCapabilities {
  readonly imageExport: readonly ChartImageFormat[];
  readonly animation: boolean;
}

/** Everything a renderer needs for a mount or update pass. */
export interface RendererContext<TModel> {
  readonly model: TModel;
  readonly theme: ChartTheme;
  readonly reducedMotion: boolean;
  /**
   * Opaque, engine-specific overrides supplied by the consumer. The frame
   * passes this through without inspecting or normalizing it.
   */
  readonly nativeOptions: unknown;
  emit(interaction: ChartInteraction): void;
}

/**
 * Lifecycle a renderer must implement. The renderer owns the contents of the
 * host element it is given and nothing else.
 */
export interface ChartRenderer<TModel> {
  readonly capabilities: RendererCapabilities;
  mount(host: HTMLElement, context: RendererContext<TModel>): void;
  update(context: RendererContext<TModel>): void;
  resize(): void;
  destroy(): void;
  /** Returns null when the requested format is unsupported. */
  toDataUrl(format: ChartImageFormat, backgroundColor: string): string | null;
  /** Unstable escape hatch surfaced through the component. */
  nativeInstance(): unknown;
}
