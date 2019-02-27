import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const mergeAll = objs => Object.assign({}, ...objs);
const camelCase = string => {
    const [first, ...rest] = string.split('-').map(str => str.toLowerCase());
    return first + rest.map(str => str[0].toUpperCase() + str.slice(1)).join('')
};

const makeExternalPredicate = externalArr => {
    if (externalArr.length === 0) {
        return () => false;
    }
    const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
    return id => pattern.test(id);
};

const configBase = {
    input: 'src/index.js',
    plugins: [
        babel({ exclude: 'node_modules/** '}),
        nodeResolve(),
        commonjs({
            namedExports: {
                'react-is': Object.keys(require('react-is')),
            },
        }),
    ],
    external: makeExternalPredicate([
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ]),
};

const umdConfig = mergeAll([
    configBase,
    {
        output: {
            file: `dist/${pkg.name}.js`,
            format: 'umd',
            name: camelCase(pkg.name),
        },
        plugins: configBase.plugins.concat(
            replace({ 'process.env.NODE_ENV': JSON.stringify('development') })
        ),
        external: makeExternalPredicate(Object.keys(pkg.peerDependencies || {}))
    },
]);


const prodUmdConfig = mergeAll([
    umdConfig,
    { output: mergeAll([umdConfig.output, { file: umdConfig.output.file.replace(/\.js$/, '.min.js') }]) },
    {
        plugins: configBase.plugins.concat(
            replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
            uglify({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false,
                },
            })
        ),
    },
]);

const cjsConfig = mergeAll([
    configBase,
    { output: { file: pkg.main, format: 'cjs' } },
]);

export default [umdConfig, prodUmdConfig, cjsConfig]
