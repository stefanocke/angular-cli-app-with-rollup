import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import  commonjs  from "rollup-plugin-commonjs";
import * as libs from './libs.js';

//TODO: env
const isProduction = false;

export default [ 
{
  input: "out-tsc/app/polyfills.js",
  output: [
    {
      file: "dist-rollup/polyfills.js",
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
    commonjs({}),
    ... isProduction? [
      terser()
    ] : []
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
        file: "dist-rollup/libs/" + p + ".js",
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
      ... isProduction? [
        terser()
      ] : []
    ],
    //All other libs are externals to this lib
    external: otherPackages
  }
})

];
