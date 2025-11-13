export const debounce: any = (fn: any, ms = 100) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (e: Event) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(e), ms);
  };
};

export const stringToReactHtml = (string: string) => {
  return { __html: string };
};

/**
 * Convert an object to an array of only its values.
 * Used when importing enums in component stories for populating argType dropdowns.
 * @param {*} options
 *  imported enums object
 */
export function createOptionsArray(options: any = {}) {
  const optionsArray: any = [];

  Object.keys(options).map((key) => {
    optionsArray.push(options[key]);
  });

  return optionsArray;
}

export function convertChartDataToCSV(args: any) {
  const data = args.data?.data || null;
  if (data == null || !data.length) {
    return null;
  }

  const columnDelimiter = args.columnDelimiter || ',';
  const lineDelimiter = args.lineDelimiter || '\n';

  const first = data[0];

  // handle Sankey-style data: objects with from/source and to/target
  if (
    typeof first === 'object' &&
    !Array.isArray(first) &&
    (first.from !== undefined || first.source !== undefined)
  ) {
    const options = args.options || {};
    const sankeyHeaders = (options.sankey &&
      options.sankey.dataTableHeaderLabels) || {
      source: 'Source',
      target: 'Target',
      value: 'Value',
    };

    const datasetLabels = args.data?.labels || {};
    const nodeLabelsArray = args.labels || [];

    const csvEscape = (v: any) => {
      if (v === null || v === undefined) return '';
      let s = String(v);
      if (s.indexOf('"') >= 0) s = s.replace(/"/g, '""');
      if (
        s.indexOf(columnDelimiter) >= 0 ||
        s.indexOf('"') >= 0 ||
        s.indexOf('\n') >= 0
      ) {
        return `"${s}"`;
      }
      return s;
    };

    let result = '';
    result += `${csvEscape(sankeyHeaders.source)}${columnDelimiter}${csvEscape(
      sankeyHeaders.target
    )}${columnDelimiter}${csvEscape(sankeyHeaders.value)}${lineDelimiter}`;

    data.forEach((link: any) => {
      const fromKey = link.from ?? link.source;
      const toKey = link.to ?? link.target;
      const val = link.flow ?? link.value ?? '';

      const fromDisplay =
        (datasetLabels && datasetLabels[fromKey]) ||
        (typeof fromKey === 'number' && nodeLabelsArray[fromKey]) ||
        String(fromKey);
      const toDisplay =
        (datasetLabels && datasetLabels[toKey]) ||
        (typeof toKey === 'number' && nodeLabelsArray[toKey]) ||
        String(toKey);

      result += `${csvEscape(fromDisplay)}${columnDelimiter}${csvEscape(
        toDisplay
      )}${columnDelimiter}${csvEscape(val)}${lineDelimiter}`;
    });

    return result;
  }

  // fallback: existing tabular dataset handling (labels across top, dataset values in row)
  const labels = args.labels || null;
  if (labels == null || !labels.length) {
    return null;
  }

  let result = '' + columnDelimiter;
  result += labels.join(columnDelimiter);
  result += lineDelimiter;

  result += args.data.label != null ? args.data.label.toString() : '';

  for (let i = 0; i < data.length; i++) {
    result += columnDelimiter;
    result += data[i];
  }
  result += lineDelimiter;

  return result;
}

export function getRandomData(arrayLength = 6, min = -100, max = 100) {
  const data = [];

  for (let i = 0; i < arrayLength; i++) {
    data.push(
      Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
        Math.ceil(min)
    );
  }

  return data;
}

/**
 * Takes a background hex color as input and returns the appropriate text
 * color (either primary or inversed) based on the brightness of the background color.
 * @param {string} bgHexColor - The `bgHexColor` parameter is a string representing a hexadecimal color
 * code for the background color.
 * @returns the color value for the text based on the background color provided. If the calculated YIQ
 * value is greater than or equal to 128, it returns the primary text color (TextColor), otherwise it
 * returns the inversed text color (InverseTextColor).
 */
export function getTextColor(bgHexColor: string) {
  const TextColor = '#3d3c3c';
  const InverseTextColor = '#f9f9f9';

  const r = parseInt(bgHexColor.substring(1, 3), 16);
  const g = parseInt(bgHexColor.substring(3, 5), 16);
  const b = parseInt(bgHexColor.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? TextColor : InverseTextColor;
}
