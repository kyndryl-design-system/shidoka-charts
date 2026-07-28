/**
 * Threshold Bands Plugin
 * Draws filled horizontal bands at specified Y-values to represent threshold ranges
 *
 * Supported color formats:
 * - Hex: '#90ee90'
 * - Shidoka CSS variable: 'var(--kd-color-data-viz-categorical-01-02)'
 *
 * Usage:
 * plugins: {
 *   thresholdBands: {
 *     bands: [
 *       { value: 20, color: '#CC1800' },
 *       { value: 40, color: '#CC1800' },
 *       { value: 60, color: '#CC1800' },
 *       { value: 80, color: '#FFD46A' },
 *       { value: 100, color: 'var(--kd-color-data-viz-categorical-01-02)' },
 *     ]
 *   }
 * }
 */

import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{3,8}$/;
const CSS_VAR_COLOR_PATTERN = /^var\((--[a-zA-Z0-9-]+)\)$/;

const hexToRgba = (hex, alpha) => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
    return hex;
  }

  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return hex;
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch (e) {
    return hex;
  }
};

const colorWithAlpha = (color, alpha) => {
  if (!color || typeof color !== 'string') {
    return color;
  }

  if (color.startsWith('#')) {
    return hexToRgba(color, alpha);
  }

  if (color.startsWith('rgba(')) {
    return color;
  }

  const rgbMatch = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
  }

  return color;
};

const resolveColor = (colorValue) => {
  if (typeof colorValue !== 'string') {
    console.warn(
      'thresholdBands: color must be a string in hex or var(--kd-...) format.'
    );
    return colorValue;
  }

  if (HEX_COLOR_PATTERN.test(colorValue)) {
    return colorValue;
  }

  const varMatch = colorValue.match(CSS_VAR_COLOR_PATTERN);
  if (varMatch) {
    try {
      return getTokenThemeVal(varMatch[1]);
    } catch (e) {
      console.warn(`thresholdBands: failed to resolve ${colorValue}:`, e);
      return colorValue;
    }
  }

  console.warn(
    `thresholdBands: unsupported color "${colorValue}". Use hex (#RRGGBB) or var(--kd-...) format.`
  );
  return colorValue;
};

export default {
  id: 'thresholdBands',
  beforeDatasetsDraw: (chart, args, options) => {
    if (!options.bands || options.bands.length === 0) return;

    const { ctx } = chart;
    const { chartArea, scales } = chart;
    const yScale = scales.y;

    if (!yScale) return;

    ctx.save();

    const sortedBands = [...options.bands].sort((a, b) => a.value - b.value);

    for (let i = 0; i < sortedBands.length; i++) {
      const currentBand = sortedBands[i];
      const nextBand = sortedBands[i + 1];

      const yPixelCurrent = yScale.getPixelForValue(currentBand.value);
      const yPixelNext = nextBand
        ? yScale.getPixelForValue(nextBand.value)
        : chartArea.top;

      const bandColorValue = nextBand ? nextBand.color : currentBand.color;
      const bandColor = resolveColor(bandColorValue);
      ctx.fillStyle = colorWithAlpha(bandColor, 0.1);
      ctx.fillRect(
        chartArea.left,
        Math.min(yPixelCurrent, yPixelNext),
        chartArea.width,
        Math.abs(yPixelNext - yPixelCurrent)
      );

      const lineColor = resolveColor(currentBand.color);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = currentBand.width || 1;
      ctx.setLineDash(currentBand.line || []);

      ctx.beginPath();
      ctx.moveTo(chartArea.left, yPixelCurrent);
      ctx.lineTo(chartArea.right, yPixelCurrent);
      ctx.stroke();
    }

    ctx.restore();
  },
};
