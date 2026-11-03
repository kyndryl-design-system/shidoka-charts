import {
  getColorScheme,
  getPreferredColorScheme,
  getTokenThemeVal,
  // Explicit extension so this module resolves under plain Node ESM too.
} from '@kyndryl-design-system/shidoka-foundation/common/helpers/color.js';
import { getComputedColorPalette } from '../../common/config/colorPalettes';
import { DEFAULT_PALETTE } from './palette';
import type { ChartColorScheme, ChartTheme } from './types';

/**
 * Resolves Shidoka design tokens into plain color strings for renderers.
 *
 * Tokens are read at lifecycle and update time rather than at module load so a
 * color-scheme change produces a fresh theme without reloading any module.
 */

const FALLBACKS: Record<ChartColorScheme, Omit<ChartTheme, 'palette'>> = {
  light: {
    colorScheme: 'light',
    backgroundColor: '#ffffff',
    textColor: '#3d3c3c',
    secondaryTextColor: '#6b6a6a',
    borderColor: '#e5e5e5',
    tooltipBackgroundColor: '#3d3c3c',
    tooltipTextColor: '#f9f9f9',
  },
  dark: {
    colorScheme: 'dark',
    backgroundColor: '#1d1d1d',
    textColor: '#f9f9f9',
    secondaryTextColor: '#c4c4c4',
    borderColor: '#484848',
    tooltipBackgroundColor: '#f9f9f9',
    tooltipTextColor: '#3d3c3c',
  },
};

/** Resolves the color scheme actually in effect, including `light dark`. */
export function resolveColorScheme(): ChartColorScheme {
  const declared = getColorScheme();

  if (declared === 'dark') return 'dark';
  if (declared === 'light') return 'light';

  return getPreferredColorScheme() === 'dark' ? 'dark' : 'light';
}

function token(name: string, fallback: string): string {
  try {
    const value = getTokenThemeVal(name);
    return value && value.trim() ? value.trim() : fallback;
  } catch {
    return fallback;
  }
}

function resolvePalette(paletteKey: string): readonly string[] {
  try {
    const resolved = getComputedColorPalette(paletteKey) as string[];
    const usable = resolved
      .filter((color) => typeof color === 'string' && color.trim() !== '')
      .map((color) => color.trim());

    return usable.length ? usable : DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
}

/**
 * Reads the active theme from the document. Must only be called where DOM
 * globals exist.
 */
export function resolveChartTheme(paletteKey = 'categorical'): ChartTheme {
  const defaults = FALLBACKS[resolveColorScheme()];

  return {
    ...defaults,
    backgroundColor: token(
      '--kd-color-background-page-default',
      defaults.backgroundColor
    ),
    textColor: token('--kd-color-text-level-primary', defaults.textColor),
    secondaryTextColor: token(
      '--kd-color-text-level-secondary',
      defaults.secondaryTextColor
    ),
    borderColor: token(
      '--kd-color-border-variants-light',
      defaults.borderColor
    ),
    tooltipBackgroundColor: token(
      '--kd-color-background-ui-default-dark',
      defaults.tooltipBackgroundColor
    ),
    tooltipTextColor: token(
      '--kd-color-text-variant-inversed',
      defaults.tooltipTextColor
    ),
    palette: resolvePalette(paletteKey),
  };
}
