import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from "rollup-plugin-commonjs";
import { libsModuleSpecifiers, rollupInput, rollupOutput, isLib, isPolyfill, needsCommonJS, useLibSourceMaps, manifestSuffix, hashTemplateSuffix } from './build/libs.js';
import { buildConfig } from './build/config';
import hash from 'rollup-plugin-hash';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default libsModuleSpecifiers.map(ms => {
  return {
    input: rollupInput(ms),
    output: isPolyfill(ms) ?
      [
        {
          file: rollupOutput(ms),
          format: "iife",
          sourcemap: true
        }
      ] : [
        // ES module version, for modern browsers
        // {
        //   file: "dist-rollup/modules/libs/" + p + ".js",
        //   format: "esm",
        //   sourcemap: true
        // },
        // SystemJS version, for older browsers
        {
          file: rollupOutput(ms),
          format: "system",
          sourcemap: true
        }
      ],
    plugins: [
      useLibSourceMaps(ms) && sourcemaps(),
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      needsCommonJS(ms) && commonjs({}),
      buildConfig.uglify && terser(),
      buildConfig.hash && hash({
        dest: rollupOutput(ms, hashTemplateSuffix),
        manifest: rollupOutput(ms, manifestSuffix)
      })
    ],
    //All other libs are externals to this lib
    external: otherMs => otherMs !== ms && isLib(otherMs)
  }
});
