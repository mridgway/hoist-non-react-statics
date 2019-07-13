import path from 'path';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import * as ReactIs from 'react-is';

const camelCase = string => {
  const [first, ...rest] = string.split('-').map(str => str.toLowerCase());
  return first + rest.map(str => str[0].toUpperCase() + str.slice(1)).join('')
};

const input = 'src/index.js';
const name = camelCase(pkg.name);
const external = id => !id.startsWith('.') && !path.isAbsolute(id);
const commonjsOptions = {
  namedExports: {
    'react-is': Object.keys(ReactIs)
  }
}

export default [
  {
    input,
    output: { file: pkg.main, format: 'cjs' },
    external,
    plugins: [
      babel({ exclude: /node_modules/ }),
    ]
  },
  {
    input,
    output: { file: `dist/${pkg.name}.js`, format: 'umd', name },
    plugins: [
      nodeResolve(),
      babel({ exclude: /node_modules/ }),
      commonjs(commonjsOptions)
    ]
  },
  {
    input,
    output: { file: `dist/${pkg.name}.min.js`, format: 'umd', name },
    plugins: [
      nodeResolve(),
      babel({ exclude: /node_modules/ }),
      commonjs(commonjsOptions),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
        },
      })
    ]
  }
]
