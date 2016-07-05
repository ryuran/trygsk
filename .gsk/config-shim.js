module.exports = {
  // '../vendor/x.js'    :  { 'exports': '$' },
  // '../vendor/x-ui.js' :  { 'depends': { '../vendor/x.js': null } },
  // '../vendor/y.js'    :  { 'exports': 'Y', 'depends': { '../vendor/x.js': '$' } },
  // '../vendor/z.js'    :  { 'exports': 'zorro', 'depends': { '../vendor/x.js': '$', '../vendor/y.js': 'YNOT' } }
  // module will do `window.nonCommonJSVar`, and `require('./lib/non-commonjs-lib')` will return its value
  './lib/non-commonjs-lib' : { 'exports': 'global:nonCommonJSVar' },
  // module will do `window.globalVar`, and `require('global-var')` will return its value
  'global-var': { exports: 'global:globalVar' }
};