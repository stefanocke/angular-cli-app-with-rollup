import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from "rollup-plugin-commonjs";
import { libsModuleSpecifiers, libRollupInput, libRollupOutput, isLib, useLibSourceMaps, manifestSuffix, hashTemplateSuffix} from './build/libs.js';
import { buildConfig } from './build/config';
import hash from 'rollup-plugin-hash';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default [
  {
    input: buildConfig.ngcOut + '/' + 'polyfills.js',
    output: [
      {
        file: buildConfig.dist + '/' + 'polyfills.js',
        format: "iife",
        sourcemap: true
      }
    ],
    plugins: [
      sourcemaps(),
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      //core-js uses require
      commonjs({}),
      buildConfig.uglify && terser()
    ]

  },
  ...libsModuleSpecifiers.map(ms => {
    return {
      input: libRollupInput(ms),
      output: [
        // ES module version, for modern browsers
        // {
        //   file: "dist-rollup/modules/libs/" + p + ".js",
        //   format: "esm",
        //   sourcemap: true
        // },
        // SystemJS version, for older browsers
        {
          file: libRollupOutput(ms),
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
        buildConfig.uglify && terser(),
        buildConfig.hash && hash({
          dest: libRollupOutput(ms, hashTemplateSuffix),
          manifest: libRollupOutput(ms, manifestSuffix)
        })
      ],
      //All other libs are externals to this lib
      external: otherMs => otherMs !== ms && isLib(otherMs) 
    }
  })

];
