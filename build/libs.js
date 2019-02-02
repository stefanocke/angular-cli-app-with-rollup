import * as path from 'path';

// key is the package / module.
// value can be empty in case of a node-module.
// when bundeling from src, an entry point must be given ("index.js")
const libs = {
    '@angular/core': {},
    '@angular/common': {},
    '@angular/platform-browser': {},
    '@angular/forms': {},
    '@angular/router': {},
    'rxjs': {},
    'rxjs/operators': {},
    'app/common': { entry: 'app/common/index.js' }
};

//All imports that refere to modules within that directory or below are rewritten to imports to 'app/common' 
const importAlias = {
    'app/common': 'app/common'
}  

export const packages = Object.keys(libs);

export function input(package_) {
    return libs[package_].entry && "out-tsc/app/" + libs[package_].entry || package_;
}

//Checks if a module id belongs to a lib
export function isLib(id) {
    return packages.find(p => id === p);
}

//Maps relative imports to modules of a'common lib' to one module like "app/common"
export const resolveRelativeLibImports = {
    resolveId: (importee, importer) => {
      if (importee.startsWith('./') || importee.startsWith('../')) {
        
        const absolute = path.relative('out-tsc/app/', path.resolve(path.dirname(importer), importee)).replace(/\\/g,'/');
        //Find longest matching prefix
        const candidates = Object.keys(importAlias).filter(k => absolute.startsWith(k+'/')).sort((a,b) => a.length > b.length);
        return candidates.length > 0 && importAlias[candidates[0]] || undefined
      }
      return undefined;
    }
  }