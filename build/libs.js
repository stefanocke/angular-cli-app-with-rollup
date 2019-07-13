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

export function rollupOutputFileNamePattern(moduleSpecifier) {
  return moduleSpecifier + (buildConfig.hash ? '.[hash]' : '') + '.js';
}


/**
 * Checks if the given URL points to a fingeprinted javascript bundle (lib or polyfills) or its source map.
 * @param {string} url 
 */
export function isFingerprinted(url) {
  return !!url.match(/\.[a-z0-9]{8}\.js(?:\.map)?$/)
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
      imports[ms] = relativeLibPath(ms);
    })
  return { imports }
}

/**
 * Detemines the path of a lib or polyfill bundle relative to index.html. If a fingerprinted version exists, that one is used.
 * 
 * @param {string} moduleSpecifier the module specifier for the lib or polyfill
 * @returns the relative path
 */
export function relativeLibPath(moduleSpecifier) {
  try {
    var libPath;

    //Read manifest and determine hashed file path
    var manifestPath = rollupOutput(moduleSpecifier, manifestSuffix);
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath));
      // the key in the mainfest is the input file path
      // the value is the path of the hashed bundle relative to dist dir 
      libPath = manifest[rollupInput(moduleSpecifier)];
      if(!libPath) {
        throw Error('Path for '+rollupInput(moduleSpecifier) + ' not found in manifest ' + manifestPath);
      }
    } else {
      libPath = path.relative(buildConfig.dist, rollupOutput(moduleSpecifier)).replace(/\\/g, '/');
    }

    console.log('relativeLibPath for ' + moduleSpecifier + ' is ' + libPath);
    return libPath;
  } catch (err) {
    console.log('Error when determine relativeLibPath for ' + moduleSpecifier);
    throw err;
  }
}


/** Rollup plugin to map relative imports to modules of a'common lib' to one module like "app/common". */
export const resolveRelativeLibImports = {
  resolveId: (importee, importer) => {
    if (importee.startsWith('./') || importee.startsWith('../')) {

      //the 'absolute' path of the importee below 'src'
      const absolute = path.relative(buildConfig.ngcOut, path.resolve(path.dirname(importer), importee)).replace(/\\/g, '/');
      //the 'absolute' path of the importer below 'src'
      const importerAbsolute = path.relative(buildConfig.ngcOut, importer).replace(/\\/g, '/');

      //Find longest matching prefix within import alias keys
      const candidates = Object.keys(importAlias).filter(k => absolute.startsWith(k + '/')).sort((a, b) => a.length > b.length);

      if (candidates.length > 0) {
        //keep path relative, if importer is part of the same 'lib'
        const importerHasSamePrefix = importerAbsolute.startsWith(candidates[0] + '/');

        return !importerHasSamePrefix && importAlias[candidates[0]] || undefined
      }
    }
    return undefined;
  }
}

