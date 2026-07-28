import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

/**
 * Draws a vertical shaded column behind the hovered data point.
 * Opt-in only: register by setting plugins.pointColumnHighlight in chart options.
 * Usage:
 * plugins: {
 *   pointColumnHighlight: {
 *     datasetIndex: 0, // Optional: specify dataset index to highlight; omit to use the first active element
 *     backgroundColor: '--kd-color-background-container-soft',
 *   }
 * }
 * Note: This plugin works best with x-axis offset.
 */

const resolveColor = (color) =>
  typeof color === 'string' && color.startsWith('--')
    ? getTokenThemeVal(color)
    : color;

export default {
  id: 'pointColumnHighlight',
  beforeDatasetsDraw: (chart, args, options) => {
    if (!options || options.enabled === false) {
      return;
    }

    const activeElements = chart.getActiveElements();
    if (!activeElements.length) {
      return;
    }

    const index = activeElements[0].index;
    const startIndex =
      options?.datasetIndex != null ? Number(options.datasetIndex) : null;

    if (startIndex != null && !Number.isNaN(startIndex) && index < startIndex) {
      return;
    }

    const xScale = chart.scales.x;
    if (!xScale) {
      return;
    }

    const halfStep = options?.columnWidth ?? 0.5;
    const valueMin = index - halfStep;
    const valueMax = index + halfStep;

    const xMin = xScale.getPixelForValue(valueMin);
    const xMax = xScale.getPixelForValue(valueMax);
    const { ctx, chartArea } = chart;

    ctx.save();
    ctx.fillStyle = resolveColor(
      options?.backgroundColor ||
        getTokenThemeVal('--kd-color-background-container-subtle')
    );
    ctx.fillRect(
      Math.min(xMin, xMax),
      chartArea.top,
      Math.abs(xMax - xMin),
      chartArea.height
    );
    ctx.restore();
  },
};
