import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from "rollup-plugin-commonjs";
import * as libs from './build/libs.js';
import { buildConfig } from './build/config';
import hash from 'rollup-plugin-hash';

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
      //alias({ rxjs: __dirname + '/node_modules/rxjs-es' }),
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
  ...libs.packages.map(p => {
    const otherPackages = [...libs.packages];
    otherPackages.splice(libs.packages.indexOf(p), 1)
    return {
      input: libs.input(p),
      output: [
        // ES module version, for modern browsers
        // {
        //   file: "dist-rollup/modules/libs/" + p + ".js",
        //   format: "esm",
        //   sourcemap: true
        // },
        // SystemJS version, for older browsers
        {
          file: buildConfig.dist + '/libs/' + p + ".js",
          format: "system",
          sourcemap: true
        }
      ],
      plugins: [
        //alias({ rxjs: __dirname + '/node_modules/rxjs-es' }),
        resolve({
          jsnext: true,
          main: true,
          browser: true
        }),
        buildConfig.uglify && terser(),
        buildConfig.hash && hash({
          dest: buildConfig.dist + '/libs/' + p +'.[hash:10].js',
          manifest: buildConfig.dist + '/libs/' + p + '.manifest.json'
        })
      ],
      //All other libs are externals to this lib
      external: otherPackages
    }
  })

];
