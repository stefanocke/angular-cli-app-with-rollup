import { compile as compileDotTemplate } from 'dot';
import * as path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import staticSite from 'rollup-plugin-static-site';
import { terser } from "rollup-plugin-terser";
import { buildConfig } from './build/config';
import { isLib, libRollupOutput, libsModuleSpecifiers, resolveRelativeLibImports } from './build/libs';
import { browsersync } from './build/rollup-plugin-browsersync';

const bundles = {
  'main.js': 'main.js',
  'dyn.js': 'app/dyn/dyn.module.js'
}

export default Object.keys(bundles).map(b => {
  return {
    input: buildConfig.ngcOut + '/' + bundles[b],
    output: [
      // ES module version, for modern browsers
      // { file: "dist-rollup/"+b, format: "esm", sourcemap: true },
      // SystemJS version, for older browsers
      {
        file: buildConfig.dist + '/' + b,
        format: 'system',
        sourcemap: true
      }
    ],
    plugins: [
      sourcemaps(),
      resolveRelativeLibImports,
      resolve({ jsnext: true, main: true, browser: true }),
      buildConfig.uglify && terser(),
      buildConfig.indexHtml && b === 'main.js' && staticSite({
        dir: buildConfig.dist,
        template: {
          // We use the dafault template engine of staticSite plugin but provide it as custom function
          // to prevent injection of the bundle as script tag (we need to load it by import()).
          func: (templateStr, templateData) => compileDotTemplate(templateStr)(templateData),
          path: 'src/index.rollup.html',
          data: {
            importMap: JSON.stringify(libsImportMap())
          }
        }
      }),
      buildConfig.serve && browsersync({
        server: buildConfig.dist,
        host: 'localhost',
        port: 5000
      })
    ],
    external: isLib
  }
});

function libsImportMap() {
  const imports = {};
  libsModuleSpecifiers.forEach(ms => {
    //TODO: Use manifest to get filenem with hash
    imports[ms] = path.relative(buildConfig.dist, libRollupOutput(ms)).replace(/\\/g, '/')
  })
  return { imports }
}