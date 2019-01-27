import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import * as libs from './libs.js';

//TODO: env
const isProduction = false

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
      ] : []
    ],
    external: libs.isLib
  }
});
