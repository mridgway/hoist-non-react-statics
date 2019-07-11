import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const camelCase = string => {
  const [first, ...rest] = string.split('-').map(str => str.toLowerCase());
  return first + rest.map(str => str[0].toUpperCase() + str.slice(1)).join('')
};

const input = 'src/index.js';
const name = camelCase(pkg.name);

export default [
  {
    input,
    output: { file: pkg.main, format: 'cjs' },
    plugins: [
      babel({ exclude: /node_modules/ }),
    ]
  },
  {
    input,
    output: { file: `dist/${pkg.name}.js`, format: 'umd', name },
    plugins: [
      babel({ exclude: /node_modules/ })
    ]
  },
  {
    input,
    output: { file: `dist/${pkg.name}.min.js`, format: 'umd', name },
    plugins: [
      babel({ exclude: /node_modules/ }),
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
