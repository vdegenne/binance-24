import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'

export default {
  input: './src/app-container.ts',
  output: { file: './app.js', format: 'esm' },
  plugins: [typescript(), nodeResolve(), cjs()]
}