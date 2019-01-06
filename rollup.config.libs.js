import resolve from 'rollup-plugin-node-resolve';

// key is entry point for the lib
// value is array of packages provided by the lib 
const libs = {
  'angular-core.js': ['@angular/core'],
  'angular-common.js': ['@angular/common'],
  'angular-platform-browser.js': ['@angular/platform-browser'],
  'rxjs.js': ['rxjs'],
  'rxjs-operators.js': ['rxjs/operators'],
  'app-common.js': ['app-common']
};

const libEntryPoints = Object.keys(libs);

// Determine all packages of the given libs
function packages(libEntryPoints) {
  return libEntryPoints.map(key => libs[key]).reduce((acc, val) => acc.concat(val), []);
}


export default [ 
{
  input: "out-tsc/app/src/polyfills.js",
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
    })
  ]

},
...libEntryPoints.map(key => {
  const otherLibs = [...libEntryPoints];
  otherLibs.splice(libEntryPoints.indexOf(key), 1)
  return {
    input: "out-tsc/app/src/libs/" + key,
    output: [
      // ES module version, for modern browsers
      {
        file: "dist-rollup/modules/libs/" + key,
        format: "esm",
        sourcemap: true
      },
      // SystemJS version, for older browsers
      {
        file: "dist-rollup/libs/" + key,
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
      })
    ],
    //All other libs are externals to this lib
    external: packages(otherLibs)
  }
})

];
