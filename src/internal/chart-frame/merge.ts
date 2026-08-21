/**
 * Deep merge used to apply engine-native overrides on top of a generated
 * option object.
 *
 * Rules, which are the same for every engine that needs them:
 * - plain objects are merged key by key
 * - arrays are merged by index, so `series[0]` can be patched without
 *   discarding the generated series
 * - anything else, including functions, is replaced
 * - an explicit `undefined` override keeps the generated value
 *
 * DOM free and dependency free so it can be unit tested directly.
 */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

export function mergeNativeOverrides<T>(base: T, overrides: unknown): T {
  if (overrides === undefined) return base;

  if (Array.isArray(base) && Array.isArray(overrides)) {
    const merged: unknown[] = [...base];

    overrides.forEach((item, index) => {
      merged[index] =
        index < base.length ? mergeNativeOverrides(base[index], item) : item;
    });

    return merged as unknown as T;
  }

  if (isPlainObject(base) && isPlainObject(overrides)) {
    const merged: Record<string, unknown> = { ...base };

    for (const [key, value] of Object.entries(overrides)) {
      merged[key] = mergeNativeOverrides(merged[key], value);
    }

    return merged as unknown as T;
  }

  return overrides as T;
}
