import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import * as libs from './libs.js';

//TODO: env
const isProduction = false

const bundles = {
  'main.js': 'main.js',
  'dyn.js': 'app/dyn/dyn.module.js'
}

//Maps relative imports of modules from "common" to absolute "app-common"
const resolveCommonImports = {
  resolveId: (importee, importer) => {
    // Quick an dirty. 
    // TODO: 1. Check id relative. 2. Resolve relative to importer. 3. Check if /app/common
    // and make configurable
    if (importee.includes('/common/')) {
      return 'app-common'
    }
    return undefined;
  }
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
      resolveCommonImports,
      resolve({ jsnext: true, main: true, browser: true }),
      ...isProduction ? [
        terser()
      ] : []
    ],
    external: libs.isLib
  }
});
