import { color } from 'chart.js/helpers';

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

export const transparentColorScale = (
  ctx: any,
  baseColor: string,
  border: boolean
) => {
  if (ctx.type !== 'data') {
    return 'transparent';
  }

  const value = ctx.raw.v;

  let alpha = (1 + Math.log(value)) / 5;
  if (border) {
    alpha += 0.5;
  }

  return color(baseColor).alpha(alpha).rgbString();
};
