'use strict';

//PATCH for rollup-plugin-static-site

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var dedent = _interopDefault(require('dedent'));
var path = require('path');
var doT = _interopDefault(require('dot'));
var fsExtra = require('fs-extra');

const scriptsTemplate = [
  '{{~ it.scripts :script:i }}',
  '{{? !!script }}',
  '<script defer src="{{= script }}" type="text/javascript"></script>',
  // add newline and spaces for every element except last for pretty output by default
  '{{? i + 1 !== it.scripts.length }}\n      {{?}}',
  '{{?}}',
  '{{~}}',
];

const stylesTemplate = [
  '{{~ it.styles :style:i }}',
  '{{? !!style }}',
  '<link href="{{= style }}" rel="stylesheet">',
  '{{? i + 1 !== it.styles.length }}\n      {{?}}',
  '{{?}}',
  '{{~}}',
];

var defaultTemplate = dedent`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>{{= it.title }}</title>
      ${stylesTemplate.join('')}
    </head>
    <body>
      ${scriptsTemplate.join('')}
    </body>
  </html>
`;

/**
 * @module rollup-plugin-static-site
 */

doT.templateSettings.strip = false;
const name = 'static-site';

const addSuffix = (path$$1, suffix) => {
  if (!suffix) { return path$$1; }

  const param = suffix === true ? `s=${Date.now()}` : suffix;
  return `${path$$1}?${param}`;
};

/**
 * generate html to serve a static site bundle
 * @param {!Object} opts - plugin options
 * @param {!string} opts.dir - path to output directory containing assets and bundle
 * @param {!(boolean|string)} [opts.css = false] - path to css file.
 *   typically the value of rollup-plugin-postcss' `extract` option.
 * @param {!string} [opts.filename = index.html] - filename of the output html
 * @param {!(string[]|string)} [opts.moreScripts = []] - additional scripts that should be injected
 *   into the output html, useful for loading libraries via a cdn instead the bundle
 * @param {!(string[]|string)} [opts.moreStyles = []] - like `opts.moreScripts`, but for css
 * @param {!(boolean|string)} [opts.suffix = false] - adds a suffix to the script and css filename
 * @param {!Object} [opts.template = {}] - custom template options
 * @param {?Function} opts.template.func - wrapper function used for custom templating engines.
 *   has signature `(templateStr, templateData) => finalHtml`,
 *   where `templateStr` is the contents of the custom template (`opts.template.path`)
 *   and `templateData` is the result of merging `opts.title` and `opts.template.data`
 *   with two array properties, `scripts` and `styles`.
 *   `scripts` is `opts.moreScripts` with the path to the bundle `opts.dir` appended.
 *   `styles` is `opts.moreStyles` with `opts.css` appended, if given.
 *   this function should call whatever custom templating engine api necessary with the arguments
 *   in order to return `finalHtml`, a string of html that the plugin will save.
 * @param {?string} opts.template.path - path to custom template.
 *   if `func` is not given, the default doT engine will be used.
 *   the plugin will inject template strings to handle `scripts` and `styles` data if necessary.
 * @param {!Object} [opts.template.data = {}] - template data object.
 *   `scripts` and `styles` are reserved and will be overwritten if present.
 * @param {!string} [opts.title = rollup app] - string used for the `<title>` tag in the output html
 * @returns {Function} static site plugin
 */
function staticSite({
  dir,
  css = false,
  filename = 'index.html',
  moreScripts = [],
  moreStyles = [],
  suffix = false,
  template: {
    func,
    path: path$$1,
    data = {},
  } = {},
  title = 'rollup app',
} = {}) {
  const useDefault = !path$$1;
  const useDoT = !func && !!path$$1;

  return {
    name,
    async generateBundle({ file }, bundle, isWrite) {
      if (!dir) { this.error('`opts.dir` is required!'); }

      // don't do anything when bundle isn't written
      if (!isWrite) { return; }

      // figure out paths
      const outputDir = path.relative(process.cwd(), path.resolve(dir));
      const relativeOutput = p => path.relative(outputDir, path.resolve(p));

      // create template data
      const scripts = (Array.isArray(moreScripts) ? moreScripts : [moreScripts])
        //Workaround is here: "|| Object.keys(bundle)[0]", since "file" is undefined, if only dir and entryFileNames are set.
        .concat(addSuffix(relativeOutput(file || Object.keys(bundle)[0]), suffix));
      const styles = (Array.isArray(moreStyles) ? moreStyles : [moreStyles])
        .concat(css && addSuffix(relativeOutput(css), suffix))
        .filter(str => !!str);
      const templateData = Object.assign({}, {title},
        data,
        {scripts,
        styles});

      let templateFn;
      if (useDefault) {
        templateFn = doT.compile(defaultTemplate);
      } else {
        let userTemplate = await fsExtra.readFile(path$$1, 'utf8').catch(err => this.error(err.toString()));

        if (useDoT) {
          // inject scripts and styles if the user template doesn't handle them
          [
            { arr: scriptsTemplate, hint: `${doT.templateSettings.varname}.scripts`, tag: '</body>' },
            { arr: stylesTemplate, hint: `${doT.templateSettings.varname}.styles`, tag: '</head>' },
          ].forEach(({ arr, hint, tag }) => {
            const matches = userTemplate.match(doT.templateSettings.iterate) || [];
            const shouldSkip = matches.some(str => str.includes(hint));
            if (shouldSkip) { return; }

            const tagClose = userTemplate.lastIndexOf(tag);
            userTemplate = [
              userTemplate.slice(0, tagClose),
              arr.join(''),
              userTemplate.slice(tagClose, userTemplate.length),
            ].join('');
          });
          templateFn = doT.compile(userTemplate);
        } else {
          templateFn = d => func(userTemplate, d);
        }
      }

      // generate and write html
      const html = `${templateFn(templateData).trim()}\n`;
      const htmlPath = path.resolve(outputDir, filename);
      await fsExtra.outputFile(htmlPath, html).catch(err => this.error(err.toString()));
    },
  };
}

export default staticSite;

