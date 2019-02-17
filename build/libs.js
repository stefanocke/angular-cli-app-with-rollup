import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import { buildConfig } from './config';

// key is the module specifier.
// value can be empty in case of a node-module.
// when bundeling from src, an "entry" must be given ("index.js")
const libs = buildConfig.libs;

// key is the module specifier as in "libs". value is the prefix of the normalized absolute import path
const importAlias = buildConfig.importAlias;

export const libsModuleSpecifiers = Object.keys(libs);

/**
 * @param {string} moduleSpecifier the module specifier for the lib
 * @returns the input for bundeling the lib
 */
export function rollupInput(moduleSpecifier) {
  return libs[moduleSpecifier].entry && buildConfig.ngcOut + '/' + libs[moduleSpecifier].entry || moduleSpecifier;
}

/**
 * Whether to use the source maps provided by the lib. For libs compiled from typescript this is generally advisable. 
 * For angular itself it does currently not work, likely due to the modifications applied by ivy-ngcc (or due to some outdated rollup-sourcemaps plugin?).
 * 
 * @param {string} moduleSpecifier 
 * @returns {boolean} true if sourceMaps of teh lib shall be used
 */
export function useLibSourceMaps(moduleSpecifier) {
  return libs[moduleSpecifier].sourceMaps;
}

/** 
 * @param {string} moduleSpecifier the module specifier for the lib
 * @param {string} suffix the suffix. default is 'js'
 */
export function rollupOutput(moduleSpecifier, suffix = 'js') {
  return buildConfig.dist + '/' + moduleSpecifier + '.' + suffix;
}

/**
 * Suffix template for hashed Files.
 */
export const hashTemplateSuffix = '[hash:10].js';

/**
 * Checks if the given URL pointe to a fingeprinted javascript bundle (lib or polyfills) or its source map.
 * @param {string} url 
 */
export function isFingerprinted(url) {
  return !!url.match(/\.[a-z0-9]{10}\.js(?:\.map)?$/)
}

/**
 * Suffix for manifest file for hashed files.
 */
export const manifestSuffix = 'manifest.json';

/**
 * Checks if a module identified by the specifier is a lib.
 * 
 * @param {string} moduleSpecifier 
 * @returns true, if lib
 */
export function isLib(moduleSpecifier) {
  return !!libsModuleSpecifiers.find(ms => moduleSpecifier === ms) && !isPolyfill(moduleSpecifier);
}

/**
 * Checks if a module identified by the specifier is a polyfill (or multiple).
 * 
 * @param {string} moduleSpecifier 
 * @returns true, if polyfill
 */
export function isPolyfill(moduleSpecifier) {
  return !!libs[moduleSpecifier].polyfill;
}

/**
 * Checks if a module identified by the specifier needs CommonJS resolver (for "require").
 * 
 * @param {string} moduleSpecifier 
 * @returns true, if needs commonJs resolver
 */
export function needsCommonJS(moduleSpecifier) {
  return !!libs[moduleSpecifier].needsCommonJS;
}

/**
 * Provides an import map for the libs as to be used with SystemJS.
 * See https://github.com/systemjs/systemjs/blob/master/docs/import-maps.md.
 * For hashed files, the manifests are used to get the path.
 */
export function libsImportMap() {
  const imports = {};
  libsModuleSpecifiers
    .filter(ms => !isPolyfill(ms))
    .forEach(ms => {
      var libPath = rollupOutput(ms);
      //Read manifest as determine hashed file path
      var manifestPath = rollupOutput(ms, manifestSuffix);
      if (existsSync(manifestPath)) {
        const manifest = JSON.parse(readFileSync(manifestPath));
        libPath = manifest[libPath];
      }
      imports[ms] = path.relative(buildConfig.dist, libPath).replace(/\\/g, '/')
    })
  return { imports }
}


//Maps relative imports to modules of a'common lib' to one module like "app/common"
export const resolveRelativeLibImports = {
  resolveId: (importee, importer) => {
    if (importee.startsWith('./') || importee.startsWith('../')) {

      const absolute = path.relative(buildConfig.ngcOut, path.resolve(path.dirname(importer), importee)).replace(/\\/g, '/');
      //Find longest matching prefix
      const candidates = Object.keys(importAlias).filter(k => absolute.startsWith(k + '/')).sort((a, b) => a.length > b.length);
      return candidates.length > 0 && importAlias[candidates[0]] || undefined
    }
    return undefined;
  }
}