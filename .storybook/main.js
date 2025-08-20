import remarkGfm from 'remark-gfm';
import fs from 'fs';

export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-designs',
    '@storybook/addon-themes',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  staticDirs: ['./static', { from: '../dist/powerbi', to: '/pbi-themes' }],
  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      // Add storybook-specific dependencies to pre-optimization
      assetsInclude: ['**/*.svg'],
      plugins: [vitePluginRawSvg()],
    });
  },
};

// load raw SVGs without requiring the ?raw suffix on imports
function vitePluginRawSvg() {
  return {
    name: 'vite-plugin-raw-svg',
    enforce: 'pre', // to override `vite:asset`'s behavior
    async load(id) {
      if (id.includes('.svg')) {
        const svg = await fs.promises.readFile(id, 'utf8');
        // Escape backticks and backslashes for template literal
        const safe = svg.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
        return {
          code: `export default \`${safe}\`;`,
          map: null,
        };
      }
    },
  };
}
