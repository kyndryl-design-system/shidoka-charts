import { describe, expect, it } from 'vitest';
import * as echarts from 'echarts';
import { buildBarOption } from './bar-option';
import type { ChartTheme } from '../../chart-frame/types';
import type { BarModel } from '../../../components/chart-bar/bar.types';

/**
 * Server-side render checks for the floating bar variant.
 *
 * The option-level tests cannot catch this class of bug: an option object
 * can look correct and still lay out wrongly, which is exactly what happened
 * when floating bars were first built as a plain `bar` series with `[min,
 * max]` data. These tests render through ECharts and measure the resulting
 * geometry, so a regression in the layout mechanism fails here.
 */

const theme: ChartTheme = {
  colorScheme: 'light',
  backgroundColor: '#ffffff',
  textColor: '#111111',
  secondaryTextColor: '#555555',
  borderColor: '#dddddd',
  tooltipBackgroundColor: '#222222',
  tooltipTextColor: '#fafafa',
  palette: ['#5070dd', '#00aa00'],
};

/** Ranges covering ascending, descending (min > max) and zero-crossing. */
const TUPLES: readonly (readonly [number, number])[] = [
  [2, 10],
  [13, 7],
  [3, -3],
];

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Renders the model and returns every filled series rectangle. */
function renderRects(horizontal: boolean): Rect[] {
  const model: BarModel = {
    categories: ['A', 'B', 'C'],
    series: [{ name: 'Range', values: TUPLES }],
    categoryLabel: 'Category',
    valueLabel: 'Value',
    showLegend: false,
    stacked: false,
    horizontal,
  };

  const option = buildBarOption(model, theme, true);
  const chart = echarts.init(null, null, {
    renderer: 'svg',
    ssr: true,
    width: 500,
    height: 320,
  });

  // Pin the value axis so pixel distances map to a known value range.
  const valueAxisKey = horizontal ? 'xAxis' : 'yAxis';
  chart.setOption({
    ...option,
    [valueAxisKey]: { ...option[valueAxisKey], min: -5, max: 25 },
  });

  const svg = chart.renderToSVGString();
  chart.dispose();

  return [
    ...svg.matchAll(
      /<path d="M([\d.-]+) ([\d.-]+)l([\d.-]+) 0l0 ([\d.-]+)[^"]*" fill="#5070dd"/g
    ),
  ].map((match) => ({
    x: Number(match[1]),
    y: Number(match[2]),
    width: Number(match[3]),
    height: Number(match[4]),
  }));
}

/** Span of each tuple in value units, which is what the bar length encodes. */
const SPANS = TUPLES.map(([a, b]) => Math.abs(b - a));

describe('floating bar rendering', () => {
  it('draws one rectangle per category when vertical', () => {
    expect(renderRects(false)).toHaveLength(TUPLES.length);
  });

  it('draws one rectangle per category when horizontal', () => {
    expect(renderRects(true)).toHaveLength(TUPLES.length);
  });

  it('sizes vertical bars in proportion to each range, including across zero', () => {
    const rects = renderRects(false);
    const pxPerUnit = rects.map((rect, i) => rect.height / SPANS[i]);

    // A single scale across all three proves the zero-crossing range is not
    // collapsed to its positive part, which is how the stacked workaround
    // failed.
    for (const scale of pxPerUnit) {
      expect(scale).toBeCloseTo(pxPerUnit[0], 1);
    }
  });

  it('sizes horizontal bars in proportion to each range, including across zero', () => {
    const rects = renderRects(true);
    const pxPerUnit = rects.map((rect, i) => rect.width / SPANS[i]);

    for (const scale of pxPerUnit) {
      expect(scale).toBeCloseTo(pxPerUnit[0], 1);
    }
  });

  it('positions vertical bars so the gap between tops matches the value gap', () => {
    const rects = renderRects(false);
    const pxPerUnit = rects[0].height / SPANS[0];

    // Tops are max(10), max(13), max(3).
    expect((rects[0].y - rects[1].y) / pxPerUnit).toBeCloseTo(13 - 10, 1);
    expect((rects[2].y - rects[0].y) / pxPerUnit).toBeCloseTo(10 - 3, 1);
  });

  it('positions horizontal bars so the left edge tracks each range minimum', () => {
    const rects = renderRects(true);
    const pxPerUnit = rects[0].width / SPANS[0];

    // Left edges are min(2), min(7), min(-3).
    expect((rects[1].x - rects[0].x) / pxPerUnit).toBeCloseTo(7 - 2, 1);
    expect((rects[0].x - rects[2].x) / pxPerUnit).toBeCloseTo(2 - -3, 1);
  });
});
