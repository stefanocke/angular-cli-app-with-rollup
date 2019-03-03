import { compile as compileDotTemplate } from 'dot';
import commonjs from "rollup-plugin-commonjs";
import hash from 'rollup-plugin-hash';
import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import staticSite from 'rollup-plugin-static-site';
import { terser } from "rollup-plugin-terser";
import { buildConfig } from './build/config';
import { resolveRelativeLibImports, hashTemplateSuffix, isFingerprinted, isLib, isPolyfill, libsImportMap, libsModuleSpecifiers, manifestSuffix, needsCommonJS, relativeLibPath, rollupInput, rollupOutput, useLibSourceMaps } from './build/libs.js';
import { browsersync } from './build/rollup-plugin-browsersync';

export default libsModuleSpecifiers.map(ms => {
  return {
    input: rollupInput(ms),
    output: [{
      file: rollupOutput(ms),
      format: isPolyfill(ms) ? 'iife' : (buildConfig.format || 'system'),
      sourcemap: true
    }],
    plugins: [
      useLibSourceMaps(ms) && sourcemaps(),
      resolveRelativeLibImports,
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      needsCommonJS(ms) && commonjs({}),
      buildConfig.uglify && terser(),
      buildConfig.hash && hash({
        dest: rollupOutput(ms, hashTemplateSuffix),
        manifest: rollupOutput(ms, manifestSuffix)
      }),
      buildConfig.indexHtml && ms === 'main' && staticSite({
        dir: buildConfig.dist,
        template: {
          // We use the default template engine of staticSite plugin but provide it as custom function
          // to prevent injection of the bundle as script tag (we need to load it by import()).
          func: (templateStr, templateData) => compileDotTemplate(templateStr)(templateData),
          path: 'src/index.rollup.html',
          data: {
            //TODO: Support different polyfill bundles that are loaded conditionally based on browser version?
            polyfillsPath: relativeLibPath('polyfills'),
            importMap: JSON.stringify(libsImportMap())
          }
        }
      }),
      //TODO: Watch other bundles than main? But index.html must be available before starting browsersync...
      buildConfig.serve && ms === 'main' && browsersync({
        server: buildConfig.dist,
        host: 'localhost',
        port: 5000,
        middleware: function (req, res, next) {
          //Cache fingerprinted resources 'forever'
          if (isFingerprinted(req.originalUrl)) {
            res.setHeader('Cache-Control', 'max-age=31536000');
          }
          console.log(req.originalUrl);
          next();
        }
      })
    ],
    //All other libs are externals to this lib
    external: otherMs => otherMs !== ms && isLib(otherMs)
  }
});
