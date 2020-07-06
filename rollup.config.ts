import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser'
import {string} from 'rollup-plugin-string';
import babel from '@rollup/plugin-babel';
import path from 'path';
const CleanCSS = require('clean-css');

const pkg = require('./package.json');

export default [
{
  input: `src/worker.ts`,
  output: {
    file: 'dist/frc-worker.js', format: 'iife', banner: "// FriendlyCaptcha worker"
  },
  treeshake: {
    propertyReadSideEffects: false,
  },
  plugins: [
    typescript({
      include: [
          './**/*.ts',
          'friendly-pow/**/*.ts'
      ],
      useTsconfigDeclarationDir: true
    }),
    resolve(),
    commonjs(),
    // babel({exclude: [/\/core-js.*\//]}),
    
    terser({
      module: true,
      toplevel: true, 
    compress: {
      passes: 3,
      keep_fargs: false,
    },
  output: {
    beautify: false,
  }}),
  ]
},
{
  input: `src/main.ts`,
  output: [
    { file: 'dist/friendlycaptcha.min.js', format: 'iife', sourcemap: false, name: "friendlycaptcha"},
  ],
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [

    // Compile TypeScript files
    typescript({
      useTsconfigDeclarationDir: true,
      include: [
        './src/**/*.ts',
        'friendly-pow/**/*.ts'
      ],
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    string({
      include: "dist/frc-worker.js",
    }),

    {
      name: "css",
      transform(code, id) {
        if (id.endsWith(".css")) {
          const minified = new CleanCSS({level: 2}).minify(code);
          // console.log(minified.stats.originalSize);
          // console.log(minified.stats.minifiedSize);
          return `export default '${minified.styles}'`;
        }
      }
    },
    babel({exclude: [/\/core-js\//]}),
    terser({
        // module: true,
        // toplevel: true, 
      compress: {
        passes: 3,
        keep_fargs: false,
      },
    output: {
      beautify: true,
    }}),
  ],
 }
];