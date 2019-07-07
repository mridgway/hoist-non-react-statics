import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const mergeAll = objs => Object.assign({}, ...objs);
const camelCase = string => {
    const [first, ...rest] = string.split('-').map(str => str.toLowerCase());
    return first + rest.map(str => str[0].toUpperCase() + str.slice(1)).join('')
};

const configBase = {
    input: 'src/index.js',
    plugins: [
        babel({ exclude: 'node_modules/** '})
    ]
};

const umdConfig = mergeAll([
    configBase,
    {
        output: {
            file: `dist/${pkg.name}.js`,
            format: 'umd',
            name: camelCase(pkg.name),
        },
    }
]);


const prodUmdConfig = mergeAll([
    umdConfig,
    { output: mergeAll([umdConfig.output, { file: umdConfig.output.file.replace(/\.js$/, '.min.js') }]) },
    {
        plugins: [
            babel({ exclude: 'node_modules/** '}),
            uglify({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                },
            })
        ],
    },
]);

const cjsConfig = mergeAll([
    configBase,
    { output: { file: pkg.main, format: 'cjs' } },
]);

export default [umdConfig, prodUmdConfig, cjsConfig]
