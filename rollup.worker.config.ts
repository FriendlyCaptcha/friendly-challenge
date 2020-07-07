import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default 
{
  input: `src/worker.ts`,
  output: [
    {file: 'dist/worker.js', format: 'iife'}
  ],
  plugins: [
    typescript({
      include: [
          './**/*.ts',
      ],
      useTsconfigDeclarationDir: true
    }),
    resolve(),
    commonjs(),
  ]
}
;