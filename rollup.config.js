import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import * as libs from './build/libs.js';
import { browsersync } from './build/rollup-plugin-browsersync';
import { buildConfig } from './build/config'

const bundles = {
  'main.js': 'main.js',
  'dyn.js': 'app/dyn/dyn.module.js'
}

export default Object.keys(bundles).map(b => {
  return {
    input: buildConfig.ngcOut + '/' + bundles[b],
    output: [
      // ES module version, for modern browsers
      // { file: "dist-rollup/"+b, format: "esm", sourcemap: true },
      // SystemJS version, for older browsers
      { file: buildConfig.dist + '/' + b, format: "system", sourcemap: true }
    ],
    plugins: [
      libs.resolveRelativeLibImports,
      resolve({ jsnext: true, main: true, browser: true }),
      buildConfig.uglify && terser(),
      buildConfig.serve ? [
        browsersync({
          server: buildConfig.dist,
          host: 'localhost',
          port: 5000
        })
      ] : []
    ],
    external: libs.isLib
  }
});
