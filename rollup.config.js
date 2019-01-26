import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import * as libs from './libs.js';

//TODO: env
const isProduction = false

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

export default [{
  input: "out-tsc/app/main.js",
  output: [
    // ES module version, for modern browsers
    // {
    //   file: "dist-rollup/modules/main.js",
    //   format: "esm",
    //   sourcemap: true
    // },
    // SystemJS version, for older browsers
    {
      file: "dist-rollup/main.js",
      format: "system",
      sourcemap: true
    }
  ],
  plugins: [
    resolveCommonImports,
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    ... isProduction? [
      terser()
    ] : []
  ],
  external: libs.isLib

},
{
  input: "out-tsc/app/app/dyn/dyn.module.js",
  output: [
    // ES module version, for modern browsers
    // {
    //   file: "dist-rollup/modules/dyn.js",
    //   format: "esm",
    //   sourcemap: true
    // },
    // SystemJS version, for older browsers
    {
      file: "dist-rollup/dyn.js",
      format: "system",
      sourcemap: true
    }
  ],
  plugins: [
    resolveCommonImports,
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    ... isProduction? [
      terser()
    ] : []
  ],
  external: libs.isLib
}
];
