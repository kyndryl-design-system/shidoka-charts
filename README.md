# Shidoka Web Components for Applications

[![charts](https://github.com/kyndryl-design-system/charts/actions/workflows/actions.yml/badge.svg)](https://github.com/kyndryl-design-system/charts/actions/workflows/actions.yml)

# Contributing to this project

Read the [Contributing Guide](https://github.com/kyndryl-design-system/charts/blob/beta/CONTRIBUTING.md) here.

# Using this library in another project

## Install the package

```bash
# stable/main
npm install @kyndryl-design-system/charts -S

# beta (use until first stable release)
npm install @kyndryl-design-system/charts@beta -S
# when using beta, lock the version, as breaking changes can happen at any time
```

## Import the root stylesheet to your app's global styles

The method used (SCSS @use, CSS @import, JS import, or &lt;style&gt; tag) will vary based on your framework/bundler. Some examples:

### SCSS

```css
@use '~@kyndryl-design-system/foundation/scss/root.scss';
```

### CSS

```css
@import '@kyndryl-design-system/foundation/css/root.css';
```

### JS

```js
import '@kyndryl-design-system/foundation/css/root.css';
```

## Start using components

See [Storybook](https://kyndryl-design-system.github.io/charts/) for the full components documentation.

### Example

```js
import '@kyndryl-design-system/charts/components/barChart';
```

```html
<kd-chart></kd-chart>
```

### React usage

React does not yet support automatic interop with Web Components. This means that React treats all props passed to Web Components as string attributes. It sounds like they are [planning to release it with React 19](https://github.com/facebook/react/issues/11347#issuecomment-988970952), and is now available behind an `@experimental` flag. Until you've upgraded to a version of React that has support, you will need to use a library like [reactify-wc](https://www.npmjs.com/package/reactify-wc) to use these components in React.

Some options for React wrapper libraries:

1. [reactify-wc](https://www.npmjs.com/package/reactify-wc)
2. [wc-react](https://www.npmjs.com/package/wc-react)
3. [@lit-labs/react](https://www.npmjs.com/package/@lit-labs/react)

### Server-Side Rendering (SSR)

When using with an SSR framework like Next.js, you may encounter errors with code that only runs client-side, like `window` references for example. Here is an article that provides some methods to work around this: [Using Non-SSR Friendly Components with Next.js](https://blog.bitsrc.io/using-non-ssr-friendly-components-with-next-js-916f38e8992c). Basically, for components that make use of something like `window`, they need their rendering deferred to only happen on the client-side.
