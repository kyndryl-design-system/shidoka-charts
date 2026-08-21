/** Number formatting shared by renderers and table fallbacks. DOM free. */

const NUMBER_FORMAT = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});

/** Formats a value for display, returning an em dash for missing numbers. */
export function formatValue(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '—';
  }

  return NUMBER_FORMAT.format(value);
}

/** Formats a share of a total as a percentage. */
export function formatPercent(value: number, total: number): string {
  if (!total || !Number.isFinite(value) || !Number.isFinite(total)) return '';

  return `${((value / total) * 100).toFixed(1)}%`;
}
