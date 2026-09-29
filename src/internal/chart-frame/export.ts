import type { ChartImageFormat } from './types';

const FORMAT_LABELS: Record<ChartImageFormat, string> = {
  png: 'PNG',
  jpeg: 'JPG',
  svg: 'SVG',
};

const FORMAT_EXTENSIONS: Record<ChartImageFormat, string> = {
  png: 'png',
  jpeg: 'jpg',
  svg: 'svg',
};

/** Display label for a capability-advertised image format. */
export function imageFormatLabel(format: ChartImageFormat): string {
  return FORMAT_LABELS[format];
}

/** File extension for a capability-advertised image format. */
export function imageFormatExtension(format: ChartImageFormat): string {
  return FORMAT_EXTENSIONS[format];
}

/** Encodes CSV text as a data URL without relying on the DOM. */
export function csvToDataUrl(csv: string): string {
  return `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
}

/**
 * Triggers a browser download for an already encoded data URL. Kept separate
 * from the pure helpers above so those stay DOM free.
 */
export function downloadDataUrl(dataUrl: string, fileName: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
