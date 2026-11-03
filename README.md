# Shidoka Charts

[![Release](https://github.com/kyndryl-design-system/shidoka-charts/actions/workflows/release.yml/badge.svg)](https://github.com/kyndryl-design-system/shidoka-charts/actions/workflows/release.yml)

# Contributing to this project

Read the [Contributing Guide](CONTRIBUTING.md) here.

# Using this library in another project

## Install the package

```bash
npm install @kyndryl-design-system/shidoka-charts -S
```

## Import the root stylesheet to your app's global styles

The method used (SCSS @use, CSS @import, JS import, or &lt;style&gt; tag) will vary based on your framework/bundler. Some examples:

### SCSS

```css
@use '~@kyndryl-design-system/shidoka-foundation/scss/root.scss';
```

### CSS

```css
@import '@kyndryl-design-system/shidoka-foundation/css/root.css';
```

### JS

```js
import '@kyndryl-design-system/shidoka-foundation/css/root.css';
```

### Set a color scheme

More info on color schemes in the [Foundation Storybook](https://shidoka-foundation.netlify.app/?path=/docs/foundation-colors--docs#setting-a-theme).

## Start using components

See [Storybook](https://shidoka-charts.netlify.app) for the full components documentation.

### Chart.js charts (existing)

Existing Chart.js-based charts continue to work as before. No application updates are required for current `kd-chart` usage.

```js
import '@kyndryl-design-system/shidoka-charts/components/chart';
```

```html
<kd-chart></kd-chart>
```

### ECharts and D3 charts (new)

New chart types are opt-in semantic components. Import the registration entry for only the chart(s) you need; each entry registers one custom element and keeps engine bundles isolated.

```js
import '@kyndryl-design-system/shidoka-charts/charts/bar';
import '@kyndryl-design-system/shidoka-charts/charts/line';
import '@kyndryl-design-system/shidoka-charts/charts/pie';
import '@kyndryl-design-system/shidoka-charts/charts/area';
import '@kyndryl-design-system/shidoka-charts/charts/sunburst';
import '@kyndryl-design-system/shidoka-charts/charts/tree';
import '@kyndryl-design-system/shidoka-charts/charts/chord';
```

```html
<kd-chart-bar></kd-chart-bar>
<kd-chart-line></kd-chart-line>
<kd-chart-pie></kd-chart-pie>
<kd-chart-area></kd-chart-area>
<kd-chart-sunburst></kd-chart-sunburst>
<kd-chart-tree></kd-chart-tree>
<kd-chart-chord></kd-chart-chord>
```

More chart types will continue to land on these ECharts/D3 foundations. Existing Chart.js charts remain supported; new chart types will not be added to Chart.js going forward.

### React usage

React does not yet support automatic interop with Web Components. This means that React treats all props passed to Web Components as string attributes. It sounds like they are [planning to release it eventually](https://github.com/facebook/react/issues/11347#issuecomment-988970952), and is now available behind an `@experimental` flag. Until you've upgraded to a version of React that has support, you will need to use a library like [@lit/react](https://www.npmjs.com/package/@lit/react) to use these components in React.

Some options for React wrapper libraries:

1. [@lit/react](https://www.npmjs.com/package/@lit/react)
2. [reactify-wc](https://www.npmjs.com/package/reactify-wc)
3. [wc-react](https://www.npmjs.com/package/wc-react)

### Server-Side Rendering (SSR)

When using with an SSR framework like Next.js, you will encounter errors with code that only runs client-side, like `window` references for example. This is because web components cannot render on the server. Here is an article that provides some methods to work around this: [Using Non-SSR Friendly Components with Next.js](https://blog.bitsrc.io/using-non-ssr-friendly-components-with-next-js-916f38e8992c) and [How to entirely disable server-side rendering in next.js v13?](https://stackoverflow.com/questions/75406728/how-to-entirely-disable-server-side-rendering-in-next-js-v13). Basically, they need their rendering deferred to only happen on the client-side.

Here is some additional information about why SSR does not work for web components, and some potential polyfills/solutions to enable server rendering: https://lit.dev/docs/ssr/overview/
