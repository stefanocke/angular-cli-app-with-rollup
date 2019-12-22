import { compile as compileDotTemplate } from 'dot';
import commonjs from "rollup-plugin-commonjs";
import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import staticSite from './build/rollup-plugin-static-site';
import { terser } from "rollup-plugin-terser";
import { buildConfig } from './build/config';
import { resolveRelativeLibImports, isFingerprinted, isLib, isPolyfill, libsImportMap, libsModuleSpecifiers, needsCommonJS, relativeLibPath, rollupInput, useLibSourceMaps } from './build/libs.js';
import { browsersync } from './build/rollup-plugin-browsersync';
import compression from 'compression';
import entrypointHashmanifest from "./build/rollup-plugin-entrypoint-hashmanifest";

export default libsModuleSpecifiers.map(ms => {
  return {
    input: {[ms]: rollupInput(ms)},
    output: isPolyfill(ms) ?
      {
        dir: buildConfig.dist,
        format: 'iife',
        sourcemap: true,
        strict: false,
        entryFileNames: buildConfig.hash ? '[name].[hash].js' : '[name].js'
      } :
      buildConfig.formats.map(f => {
        return {
          dir: buildConfig.dist,
          format: f,
          sourcemap: true,
          entryFileNames:buildConfig.hash ? '[name].[format].[hash].js' : '[name].[format].js'
        };
      }),
    plugins: [
      useLibSourceMaps(ms) && sourcemaps(),
      resolveRelativeLibImports,
      resolve({
        browser: true
      }),
      needsCommonJS(ms) && commonjs({}),
      buildConfig.uglify && terser(),
      buildConfig.hash && entrypointHashmanifest({ manifestName: buildConfig.dist + '/' + ms +  (isPolyfill(ms) ? '.manifest.json' : '.[format].manifest.json') }),
      buildConfig.indexHtml && ms === 'main' && staticSite({
        dir: buildConfig.dist,
        template: {
          // We use the default template engine of staticSite plugin but provide it as custom function
          // to prevent injection of the bundle as script tag (we need to load it by import()).
          func: (templateStr, templateData) => compileDotTemplate(templateStr)(templateData),
          path: buildConfig.indexHtmlTemplate,
          data: {
            // the following must be functions since (some of) the manfifests are written during the build
            // but the plugin is configured earlier (when this rollup config is exported).
            polyfillsPath: () => relativeLibPath('polyfills'),
            importMap: () => JSON.stringify(libsImportMap())
          }
        }
      }),
      //TODO: Watch other bundles than main? But index.html must be available before starting browsersync...
      buildConfig.serve && ms === 'main' && browsersync({
        server: buildConfig.dist,
        host: 'localhost',
        port: 5000,
        //As long as https://github.com/BrowserSync/browser-sync/issues/1517 is not resolved, node's native http2 cannot be used.
        //Since 'http2' loads the native module, we use the relative path of the installed http2 module here.
        //Importer is assumed to be at node_modules/browser-sync/dist/server.
        //httpModule: '../../../http2',
        //https: {
        //  key: "./build/localhost.key",
        //  cert: "./build/localhost.crt"
        //},
        middleware: [
          function (req, res, next) {
            //Cache fingerprinted resources 'forever'
            if (isFingerprinted(req.originalUrl)) {
              res.setHeader('Cache-Control', 'max-age=31536000');
            }
            console.log(req.originalUrl);
            next();
          },
          //See https://github.com/BrowserSync/browser-sync/issues/451
          //Cannot be used together with http2 in browsersync (https://github.com/BrowserSync/browser-sync/issues/1443)
          compression()
        ]
      })
    ],
    //All other libs are externals to this lib
    //TODO: support for multiple inputs?
    external: otherMs => otherMs !== ms && isLib(otherMs)
  }
});
