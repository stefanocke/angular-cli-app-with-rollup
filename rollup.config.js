import resolve from 'rollup-plugin-node-resolve';
import alias from 'rollup-plugin-alias';

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

//Checks if a module id belongs to a lib
function isLib(id) {
  var result = packages(libEntryPoints).find(p => id === p)
  return !!result
}

//Maps relative imports of modules from "common" to absolute "app-common"
const resolveCommonImports = {
  resolveId: (importee, importer) => {
    // Quick an dirty. 
    // TODO: 1. Check id relative. 2. Resolve relative to importer. 3. Check if /app/common
    // and make configurable
    if(importee.includes('/common/')) {
      return 'app-common'
    }
    return undefined;
  }
} 

export default [{
  input: "out-tsc/app/src/main.js",
  output: [
    // ES module version, for modern browsers
    {
      file: "dist-rollup/modules/main.js",
      format: "esm",
      sourcemap: true
    },
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
    })
  ],
  external: isLib
  //experimentalCodeSplitting: true

},
{
  input: "out-tsc/app/src/app/dyn/dyn.module.ngfactory.js",
  output: [
    // ES module version, for modern browsers
    {
      file: "dist-rollup/modules/dyn.js",
      format: "esm",
      sourcemap: true
    },
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
    })
  ],
  external: isLib
  //experimentalCodeSplitting: true

}
];
