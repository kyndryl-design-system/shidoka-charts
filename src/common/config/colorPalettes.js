import { getTokenThemeVal } from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';

export const getColorPalette = (key) => {
  const palette = palettes[key];
  return Array.isArray(palette) ? palette.slice() : [];
};

export const getComputedColorPalette = (key) => {
  const palette = getColorPalette(key);
  return palette.map((color) => {
    return color.startsWith('--') ? getTokenThemeVal(color) : color;
  });
};

const palettes = {
  categorical: [
    '--kd-color-data-viz-categorical-01-01',
    '--kd-color-data-viz-categorical-01-02',
    '--kd-color-data-viz-categorical-01-03',
    '--kd-color-data-viz-categorical-01-04',
    '--kd-color-data-viz-categorical-01-05',
    '--kd-color-data-viz-categorical-01-06',
    '--kd-color-data-viz-categorical-01-07',
    '--kd-color-data-viz-categorical-01-08',
    '--kd-color-data-viz-categorical-01-09',
    '--kd-color-data-viz-categorical-01-10',
  ],

  sequential01: [
    '--kd-color-data-viz-sequential-01-10',
    '--kd-color-data-viz-sequential-01-20',
    '--kd-color-data-viz-sequential-01-30',
    '--kd-color-data-viz-sequential-01-40',
    '--kd-color-data-viz-sequential-01-50',
    '--kd-color-data-viz-sequential-01-60',
    '--kd-color-data-viz-sequential-01-70',
    '--kd-color-data-viz-sequential-01-80',
    '--kd-color-data-viz-sequential-01-90',
    '--kd-color-data-viz-sequential-01-100',
  ],

  sequential02: [
    '--kd-color-data-viz-sequential-02-10',
    '--kd-color-data-viz-sequential-02-20',
    '--kd-color-data-viz-sequential-02-30',
    '--kd-color-data-viz-sequential-02-40',
    '--kd-color-data-viz-sequential-02-50',
    '--kd-color-data-viz-sequential-02-60',
    '--kd-color-data-viz-sequential-02-70',
    '--kd-color-data-viz-sequential-02-80',
    '--kd-color-data-viz-sequential-02-90',
    '--kd-color-data-viz-sequential-02-100',
  ],

  sequential03: [
    '--kd-color-data-viz-sequential-03-10',
    '--kd-color-data-viz-sequential-03-20',
    '--kd-color-data-viz-sequential-03-30',
    '--kd-color-data-viz-sequential-03-40',
    '--kd-color-data-viz-sequential-03-50',
    '--kd-color-data-viz-sequential-03-60',
    '--kd-color-data-viz-sequential-03-70',
    '--kd-color-data-viz-sequential-03-80',
    '--kd-color-data-viz-sequential-03-90',
    '--kd-color-data-viz-sequential-03-100',
  ],

  sequential04: [
    '--kd-color-data-viz-sequential-04-10',
    '--kd-color-data-viz-sequential-04-20',
    '--kd-color-data-viz-sequential-04-30',
    '--kd-color-data-viz-sequential-04-40',
    '--kd-color-data-viz-sequential-04-50',
    '--kd-color-data-viz-sequential-04-60',
    '--kd-color-data-viz-sequential-04-70',
    '--kd-color-data-viz-sequential-04-80',
    '--kd-color-data-viz-sequential-04-90',
    '--kd-color-data-viz-sequential-04-100',
  ],

  sequential05: [
    '--kd-color-data-viz-sequential-05-10',
    '--kd-color-data-viz-sequential-05-20',
    '--kd-color-data-viz-sequential-05-30',
    '--kd-color-data-viz-sequential-05-40',
    '--kd-color-data-viz-sequential-05-50',
    '--kd-color-data-viz-sequential-05-60',
    '--kd-color-data-viz-sequential-05-70',
    '--kd-color-data-viz-sequential-05-80',
    '--kd-color-data-viz-sequential-05-90',
    '--kd-color-data-viz-sequential-05-100',
  ],

  divergent01: [
    '--kd-color-data-viz-divergent-01-negative-100',
    '--kd-color-data-viz-divergent-01-negative-90',
    '--kd-color-data-viz-divergent-01-negative-80',
    '--kd-color-data-viz-divergent-01-negative-70',
    '--kd-color-data-viz-divergent-01-negative-60',
    '--kd-color-data-viz-divergent-01-negative-50',
    '--kd-color-data-viz-divergent-01-negative-40',
    '--kd-color-data-viz-divergent-01-negative-30',
    '--kd-color-data-viz-divergent-01-negative-20',
    '--kd-color-data-viz-divergent-01-negative-10',
    '--kd-color-data-viz-divergent-01-neutral',
    '--kd-color-data-viz-divergent-01-positive-10',
    '--kd-color-data-viz-divergent-01-positive-20',
    '--kd-color-data-viz-divergent-01-positive-30',
    '--kd-color-data-viz-divergent-01-positive-40',
    '--kd-color-data-viz-divergent-01-positive-50',
    '--kd-color-data-viz-divergent-01-positive-60',
    '--kd-color-data-viz-divergent-01-positive-70',
    '--kd-color-data-viz-divergent-01-positive-80',
    '--kd-color-data-viz-divergent-01-positive-90',
    '--kd-color-data-viz-divergent-01-positive-100',
  ],

  divergent02: [
    '--kd-color-data-viz-divergent-02-negative-100',
    '--kd-color-data-viz-divergent-02-negative-90',
    '--kd-color-data-viz-divergent-02-negative-80',
    '--kd-color-data-viz-divergent-02-negative-70',
    '--kd-color-data-viz-divergent-02-negative-60',
    '--kd-color-data-viz-divergent-02-negative-50',
    '--kd-color-data-viz-divergent-02-negative-40',
    '--kd-color-data-viz-divergent-02-negative-30',
    '--kd-color-data-viz-divergent-02-negative-20',
    '--kd-color-data-viz-divergent-02-negative-10',
    '--kd-color-data-viz-divergent-02-neutral',
    '--kd-color-data-viz-divergent-02-positive-10',
    '--kd-color-data-viz-divergent-02-positive-20',
    '--kd-color-data-viz-divergent-02-positive-30',
    '--kd-color-data-viz-divergent-02-positive-40',
    '--kd-color-data-viz-divergent-02-positive-50',
    '--kd-color-data-viz-divergent-02-positive-60',
    '--kd-color-data-viz-divergent-02-positive-70',
    '--kd-color-data-viz-divergent-02-positive-80',
    '--kd-color-data-viz-divergent-02-positive-90',
    '--kd-color-data-viz-divergent-02-positive-100',
  ],

  statusLight: [
    '--kd-color-data-viz-rag-8-success-light',
    '--kd-color-data-viz-rag-8-warning-light',
    '--kd-color-data-viz-rag-8-error-light',
    '--kd-color-status-critical-light',
  ],

  statusDark: [
    '--kd-color-data-viz-rag-8-success',
    '--kd-color-data-viz-rag-8-warning',
    '--kd-color-data-viz-rag-8-error',
    '--kd-color-status-critical-dark',
  ],

  rag03: [
    '--kd-color-data-viz-rag-3-success',
    '--kd-color-data-viz-rag-3-warning',
    '--kd-color-data-viz-rag-3-error',
  ],

  rag08: [
    '--kd-color-data-viz-rag-8-success',
    '--kd-color-data-viz-rag-8-success-light',
    '--kd-color-data-viz-rag-8-warning',
    '--kd-color-data-viz-rag-8-warning-light',
    '--kd-color-data-viz-rag-8-error',
    '--kd-color-data-viz-rag-8-error-light',
    '--kd-color-data-viz-rag-8-informational',
    '--kd-color-data-viz-rag-8-informational-light',
  ],
};
