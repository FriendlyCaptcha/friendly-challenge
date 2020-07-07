import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import {string} from 'rollup-plugin-string';
import replace from '@rollup/plugin-replace';

const CleanCSS = require('clean-css');

// Inline plugin to load css as minified string
const css = () => {return {
  name: "css",
  transform(code, id) {
    if (id.endsWith(".css")) {
      const minified = new CleanCSS({level: 2}).minify(code);
      return `export default '${minified.styles}'`;
    }
  }
}}

const ts = () => {
  return typescript({
    useTsconfigDeclarationDir: true,
    include: [
      './src/**/*.ts',
    ],
  })
}

export default [
{
  input: `src/main.ts`,
  output: { 
      file: 'dist/widget.module.js',
      format: 'es',
      sourcemap: false,
      name: "friendlyChallenge",
  },
  watch: {
    include: 'src/**',
  },
  plugins: [
    ts(),
    commonjs(),
    resolve(),
    string({
      include: ["dist/worker.min.js"],
    }),
    css(),
  ],
 },
 {
  input: `src/main.ts`,
  output: [
    { 
      file: 'dist/widget-pre-babel.js',
      format: 'iife',
      sourcemap: false,
      name: "friendlyChallenge",
    },
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    ts(),
    replace({"dist/worker.min.js": "dist/worker.compat.min.js"}),
    commonjs(),
    resolve(),
    string({
      include: ["dist/worker.compat.min.js"],
    }),
    css(),
  ],
 }
];