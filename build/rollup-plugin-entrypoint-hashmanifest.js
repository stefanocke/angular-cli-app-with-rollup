/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fse = require('fs-extra');


export default function(opts = {}) {
  let inputs;
  return {
    name: "entrypoint-hashmanifest",
    options({ input }) {
      inputs = input;
      if (typeof inputs === "string") {
        inputs = [inputs];
      }
      if (typeof inputs === "object") {
        inputs = Object.values(inputs);
      }
    },
    generateBundle(outputOptions, bundle) {
      let map = {};
      return Promise.all(inputs.map(id => this.resolveId(id))).then(
        resolvedInputs => {
            console.log("resolvedInputs: "+resolvedInputs);
          for (const key of Object.keys(bundle)) {
            console.log("bundle: "+key);
            const idx = resolvedInputs.findIndex(
              input => input in (bundle[key].modules || {})
            );
            if (idx !== -1) {
              map[inputs[idx]] = bundle[key].fileName;
            }
          }

          //https://github.com/rollup/rollup/pull/2102#issuecomment-511199159
          const format = outputOptions.format === 'es' ? 'esm' : outputOptions.format;
          const manifestFile = opts.manifestName.replace('[format]', format)
          fse.outputFileSync(manifestFile, JSON.stringify(map, null, "  "));
        }
      );
    }
  };
}
