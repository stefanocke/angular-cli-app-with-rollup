import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import * as libs from './build/libs.js';
import { browsersync } from './build/rollup-plugin-browsersync';

//TODO: env
const isProduction = false
const isDev = true

const bundles = {
  'main.js': 'main.js',
  'dyn.js': 'app/dyn/dyn.module.js'
}

export default Object.keys(bundles).map(b => {
  return {
    input: "out-tsc/app/" + bundles[b],
    output: [
      // ES module version, for modern browsers
      // { file: "dist-rollup/"+b, format: "esm", sourcemap: true },
      // SystemJS version, for older browsers
      { file: "dist-rollup/" + b, format: "system", sourcemap: true }
    ],
    plugins: [
      libs.resolveRelativeLibImports,
      resolve({ jsnext: true, main: true, browser: true }),
      ...isProduction ? [
        terser()
      ] : [],
      ...isDev ? [
        browsersync({
          server: 'dist-rollup',
          host: 'localhost',
          port: 5000
        })
      ] : []
    ],
    external: libs.isLib
  }
});
