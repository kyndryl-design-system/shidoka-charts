export const debounce = (fn: Function, ms = 100) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (e: Event) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(e), ms);
  };
};

export const stringToReactHtml = (string: String) => {
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
  const data = args.data.data || null;
  if (data == null || !data.length) {
    return null;
  }

  const labels = args.labels || null;
  if (labels == null || !labels.length) {
    return null;
  }

  const columnDelimiter = args.columnDelimiter || ',';
  const lineDelimiter = args.lineDelimiter || '\n';

  let result = '' + columnDelimiter;
  result += labels.join(columnDelimiter);
  result += lineDelimiter;

  result += args.data.label.toString();

  for (let i = 0; i < data.length; i++) {
    result += columnDelimiter;
    result += data[i];
  }
  result += lineDelimiter;

  return result;
}
