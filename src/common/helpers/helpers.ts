export function debounce<Fn extends (...args: unknown[]) => void>(
  fn: Fn,
  ms = 100
) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return function (this: ThisParameterType<Fn>, ...args: Parameters<Fn>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

export function stringToReactHtml(value: string): { __html: string } {
  return { __html: value };
}

/**
 * Convert an object to an array of only its values.
 * Used when importing enums in component stories for populating argType dropdowns.
 * @param {*} options
 *  imported enums object
 */
export function createOptionsArray<T>(options: Record<string, T> = {}): T[] {
  return Object.values(options);
}

type SankeyHeaders = {
  source: string;
  target: string;
  value: string;
};

type SankeyLinkKey = string | number;

interface SankeyLink {
  from?: SankeyLinkKey;
  to?: SankeyLinkKey;
  source?: SankeyLinkKey;
  target?: SankeyLinkKey;
  flow?: string | number;
  value?: string | number;
}

interface SankeyOptions {
  sankey?: {
    dataTableHeaderLabels?: Partial<SankeyHeaders>;
  };
}

interface ChartData {
  data?: (SankeyLink | number | string)[];
  label?: string | number;
  labels?: Record<SankeyLinkKey, string>;
}

interface CsvArgs {
  data?: ChartData;
  labels?: (string | number)[];
  options?: SankeyOptions;
  columnDelimiter?: string;
  lineDelimiter?: string;
}

function csvEscape(value: unknown, columnDelimiter: string): string {
  if (value === null || value === undefined) return '';
  let s = String(value);
  if (s.includes('"')) s = s.replace(/"/g, '""');
  if (s.includes(columnDelimiter) || s.includes('"') || s.includes('\n')) {
    return `"${s}"`;
  }
  return s;
}

export function convertChartDataToCSV(args: CsvArgs): string | null {
  const data = args.data?.data || null;
  if (!data || !data.length) return null;

  const columnDelimiter = args.columnDelimiter ?? ',';
  const lineDelimiter = args.lineDelimiter ?? '\n';

  const first = data[0];

  if (
    typeof first === 'object' &&
    first !== null &&
    !Array.isArray(first) &&
    ('from' in first || 'source' in first)
  ) {
    const options = args.options ?? {};
    const sankeyHeaders: SankeyHeaders = {
      source: 'Source',
      target: 'Target',
      value: 'Value',
      ...(options.sankey?.dataTableHeaderLabels ?? {}),
    };

    const datasetLabels = args.data?.labels ?? {};
    const nodeLabelsArray = args.labels ?? [];

    let result = '';
    result += [
      csvEscape(sankeyHeaders.source, columnDelimiter),
      csvEscape(sankeyHeaders.target, columnDelimiter),
      csvEscape(sankeyHeaders.value, columnDelimiter),
    ].join(columnDelimiter);
    result += lineDelimiter;

    (data as SankeyLink[]).forEach((link) => {
      const fromKey = link.from ?? link.source;
      const toKey = link.to ?? link.target;
      const val = link.flow ?? link.value ?? '';

      const fromDisplay =
        (datasetLabels && datasetLabels[fromKey as SankeyLinkKey]) ??
        (typeof fromKey === 'number' && nodeLabelsArray[fromKey]) ??
        String(fromKey ?? '');

      const toDisplay =
        (datasetLabels && datasetLabels[toKey as SankeyLinkKey]) ??
        (typeof toKey === 'number' && nodeLabelsArray[toKey]) ??
        String(toKey ?? '');

      result += [
        csvEscape(fromDisplay, columnDelimiter),
        csvEscape(toDisplay, columnDelimiter),
        csvEscape(val, columnDelimiter),
      ].join(columnDelimiter);
      result += lineDelimiter;
    });

    return result;
  }

  const labels = args.labels;
  if (!labels || !labels.length) return null;

  let result = columnDelimiter + labels.join(columnDelimiter) + lineDelimiter;

  if (args.data?.label != null) {
    result += String(args.data.label);
  }

  for (let i = 0; i < data.length; i += 1) {
    result += columnDelimiter;
    result += String(data[i] ?? '');
  }
  result += lineDelimiter;

  return result;
}

export function getRandomData(
  arrayLength = 6,
  min = -100,
  max = 100
): number[] {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  const range = maxFloor - minCeil + 1;

  return Array.from({ length: arrayLength }, () => {
    return Math.floor(Math.random() * range) + minCeil;
  });
}

/**
 * Takes a background hex color as input and returns the appropriate text
 * color (either primary or inversed) based on the brightness of the background color.
 *  * @param {string} bgHexColor - The `bgHexColor` parameter is a string representing a hexadecimal color
 * code for the background color.
 * @returns the color value for the text based on the background color provided. If the calculated YIQ
 * value is greater than or equal to 128, it returns the primary text color (TextColor), otherwise it
 * returns the inversed text color (InverseTextColor).
 */
export function getTextColor(bgHexColor: string): string {
  const TextColor = '#3d3c3c';
  const InverseTextColor = '#f9f9f9';

  const r = parseInt(bgHexColor.substring(1, 3), 16);
  const g = parseInt(bgHexColor.substring(3, 5), 16);
  const b = parseInt(bgHexColor.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? TextColor : InverseTextColor;
}

export function convertTreeDataToCSV(datasets: any[]) {
  if (datasets[0]?.data && Array.isArray(datasets[0].data)) {
    const data = datasets[0].data;
    let csv = 'Parent Name,Depth,Children Count\n';

    data.forEach((item: any, index: number) => {
      const depth = calculateDepth(index, data);
      const parentName =
        item.parent !== null && item.parent !== undefined
          ? data[item.parent]?.name || `Index ${item.parent}`
          : 'Root';
      const childrenCount = data.filter(
        (child: any) => child.parent === index
      ).length;

      csv += `"${parentName}",${depth},${childrenCount}\n`;
    });

    return csv;
  }

  return '';
}

// Helper function to calculate depth
function calculateDepth(
  index: number,
  data: any[],
  visited = new Set()
): number {
  if (visited.has(index)) return 0; // Prevent circular references
  visited.add(index);

  const item = data[index];
  if (!item || item.parent === null || item.parent === undefined) {
    return 0;
  }
  return 1 + calculateDepth(item.parent, data, visited);
}
