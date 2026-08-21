import type { ChartTableView } from './types';

/**
 * Pure CSV serialization of the tabular fallback. Safe to import without DOM
 * globals so it can be unit tested directly.
 */

const COLUMN_DELIMITER = ',';
const LINE_DELIMITER = '\n';

function escapeCell(value: string | number): string {
  const raw = value === null || value === undefined ? '' : String(value);

  if (
    raw.includes('"') ||
    raw.includes(COLUMN_DELIMITER) ||
    raw.includes('\n') ||
    raw.includes('\r')
  ) {
    return `"${raw.replace(/"/g, '""')}"`;
  }

  return raw;
}

/** Serializes a table view to CSV text. Returns an empty string for no rows. */
export function tableViewToCsv(table: ChartTableView): string {
  if (!table.rows.length) return '';

  const lines = [table.columns.map(escapeCell).join(COLUMN_DELIMITER)];

  for (const row of table.rows) {
    lines.push(row.map(escapeCell).join(COLUMN_DELIMITER));
  }

  return lines.join(LINE_DELIMITER) + LINE_DELIMITER;
}

/** Strips characters that break downloads across operating systems. */
export function toSafeFileName(title: string, fallback: string): string {
  const cleaned = title
    .trim()
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned || fallback;
}
