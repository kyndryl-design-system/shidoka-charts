import path from 'path';
import node_path from 'node:path';
import multiInput from 'rollup-plugin-multi-input';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';
import renameNodeModules from 'rollup-plugin-rename-node-modules';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import postcss from 'rollup-plugin-postcss';
import postcssLit from 'rollup-plugin-postcss-lit';
import InlineSvg from 'rollup-plugin-inline-svg';
import copy from 'rollup-plugin-copy';

export default {
  input: ['./src/**/index.ts'],
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  plugins: [
    del({ targets: 'dist/*' }),
    multiInput.default(),
    resolve(),
    renameNodeModules(),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
        { src: 'LICENSE', dest: 'dist' },
      ],
    }),
    InlineSvg(),
    typescript(),
    postcss({
      use: [
        [
          'sass',
          {
            includePaths: [path.resolve('node_modules')],
          },
        ],
      ],
      inject: false,
    }),
    postcssLit(),
    terser(),
    dynamicImportVars(),
    removeQueryParams(),
  ],
};

// remove query params from imports so they don't break the build
function removeQueryParams() {
  return {
    name: 'remove-query-params',
    resolveId: {
      handler(source, importer) {
        if (source?.includes('?inline')) {
          const removedFromPath = source.replace(/\?.*$/, '');
          let path = importer
            ? node_path.resolve(node_path.dirname(importer), removedFromPath)
            : node_path.resolve(removedFromPath);

          return { id: path };
        }
        return null;
      },
    },
  };
}
