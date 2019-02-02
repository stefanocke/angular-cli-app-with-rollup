import * as path from 'path';
import stripJsonComments from 'strip-json-comments';
import {readFileSync} from 'fs';

// All imports that refer to modules within that directory or below are rewritten to imports to 'app/common' 
const buildConfig = JSON.parse(readFileSync('build.json'));

// key is the package / module.
// value can be empty in case of a node-module.
// when bundeling from src, an "entry" must be given ("index.js")
const libs = buildConfig.libs;
 
const importAlias = buildConfig.importAlias;

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