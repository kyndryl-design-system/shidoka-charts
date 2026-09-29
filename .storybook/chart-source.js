/**
 * Builds the Lit snippet shown in the docs "Show code" panel.
 *
 * Storybook's `docs.source.type: 'code'` mode prints the Babel-regenerated
 * story export, which is useless for stories written as `{ args, render }`.
 * `parameters.docs.source.code` has the highest precedence in the resolver, so
 * each story passes its own args object through `chartSource` to get a real,
 * copy-pasteable template.
 *
 * Bindings are emitted as Lit property (`.foo`) and boolean (`?foo`) bindings
 * rather than plain HTML attributes: the chart components declare properties
 * with no explicit `attribute` option, so the observed attribute name is the
 * lowercased property name and kebab-case attributes would silently not bind.
 */

/** Soft line-length budget before a value is broken across lines. */
const MAX_WIDTH = 72;

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/** Single-quoted JS string literal, matching the repo's prettier style. */
function quote(value) {
  return `'${value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')}'`;
}

function propertyKey(key) {
  return IDENTIFIER.test(key) ? key : quote(key);
}

function entriesOf(value) {
  return Object.entries(value).filter(([, item]) => item !== undefined);
}

/** Prints `value` as JS source on a single line. */
function printInline(value) {
  if (value === null) return 'null';
  if (typeof value === 'string') return quote(value);
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => printInline(item)).join(', ')}]`;
  }
  if (typeof value === 'object') {
    const entries = entriesOf(value);
    if (entries.length === 0) return '{}';
    const body = entries
      .map(([key, item]) => `${propertyKey(key)}: ${printInline(item)}`)
      .join(', ');
    return `{ ${body} }`;
  }
  return String(value);
}

/**
 * Prints `value` as JS source, breaking arrays and objects across lines when
 * the single-line form would not fit.
 *
 * @param value value to print
 * @param indent indentation of the line the value started on
 * @param column column the value starts at, so the first line can be measured
 */
function printValue(value, indent, column) {
  const inline = printInline(value);
  if (column + inline.length <= MAX_WIDTH) return inline;

  const inner = `${indent}  `;

  if (Array.isArray(value)) {
    const items = value.map(
      (item) => `${inner}${printValue(item, inner, inner.length)},`
    );
    return ['[', ...items, `${indent}]`].join('\n');
  }

  if (value !== null && typeof value === 'object') {
    const entries = entriesOf(value);
    if (entries.length === 0) return '{}';
    const items = entries.map(([key, item]) => {
      const prefix = `${inner}${propertyKey(key)}: `;
      return `${prefix}${printValue(item, inner, prefix.length)},`;
    });
    return ['{', ...items, `${indent}}`].join('\n');
  }

  // Long strings and numbers cannot be broken; keep them on one line.
  return inline;
}

/**
 * Returns a formatted Lit template for `tag` bound to every defined entry of
 * `args`, in insertion order.
 *
 * @param {string} tag custom element tag name, e.g. `kd-chart-area`
 * @param {Record<string, unknown>} args the story's args object
 * @returns {string} a copy-pasteable Lit template
 */
export function chartSource(tag, args) {
  const bindings = [];

  for (const [key, value] of Object.entries(args)) {
    if (value === undefined) continue;

    if (typeof value === 'boolean') {
      bindings.push(`  ?${key}=\${${value}}`);
      continue;
    }

    const prefix = `  .${key}=\${`;
    bindings.push(`${prefix}${printValue(value, '  ', prefix.length)}}`);
  }

  return `<${tag}\n${bindings.join('\n')}\n></${tag}>`;
}
