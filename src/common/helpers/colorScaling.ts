export type NumericLike = number | null | undefined;

export interface ScaleDomain {
  min: number;
  max: number;
}

const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

export const getDomainFromValues = (
  values: NumericLike[],
  fallback?: ScaleDomain
): ScaleDomain => {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const v of values) {
    if (!isFiniteNumber(v)) {
      continue;
    }

    if (v < min) {
      min = v;
    }
    if (v > max) {
      max = v;
    }
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    if (fallback) {
      return fallback;
    }
    return { min: 0, max: 0 };
  }

  return { min, max };
};

export const normalizeToUnit = (
  value: NumericLike,
  domain: ScaleDomain
): number => {
  if (!isFiniteNumber(value)) {
    return 0;
  }

  const range = domain.max - domain.min;

  if (!isFiniteNumber(range) || range <= 0) {
    return 0;
  }

  const t = (value - domain.min) / range;

  if (Number.isNaN(t)) {
    return 0;
  }

  if (t <= 0) {
    return 0;
  }
  if (t >= 1) {
    return 1;
  }

  return t;
};

export const getScaledColorIndex = (
  value: NumericLike,
  domain: ScaleDomain,
  paletteLen: number
): number => {
  if (!Number.isInteger(paletteLen) || paletteLen <= 0) {
    return 0;
  }

  const t = normalizeToUnit(value, domain);

  let idx = Math.floor(t * (paletteLen - 1));

  if (idx < 0) {
    idx = 0;
  } else if (idx >= paletteLen) {
    idx = paletteLen - 1;
  }

  return idx;
};
