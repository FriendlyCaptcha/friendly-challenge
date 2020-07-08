import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import {string} from 'rollup-plugin-string';
import replace from '@rollup/plugin-replace';

import dts from "rollup-plugin-dts";

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
  input: `src/index.ts`,
  output: { 
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
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
  input: `src/index.ts`,
  output: [
    { 
      file: 'dist/compat/index.js',
      format: 'es',
      sourcemap: true,
    },
  ],
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
 },
{
  input: `src/index.ts`,
  output: [{file: "dist/friendly-captcha.d.ts", format: "es"}],
  plugins: [dts()],
}
];