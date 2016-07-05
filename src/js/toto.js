/** toto */

// import from a lib
var lib = require('./lib/lib');

// or from another module
// var toto2 = require('./toto2')

// or directly import from node_modules
// var _ = require('underscore');

// some behaviour for our module
function foo(firstname) {
  window.console.log('Hello %s!', firstname);
}

foo(lib.firstname);

var $ = require('jquery');
// you can add jquery plugin just by requiring them (if they are compatible with CommonJS)
require('slick-carousel');
// now, that should work:
$('#carousel').slick(); // FYI no `#carousel` element on page :D

// require lib that are not compatible with CommonJS (see `config-shim.js`)
var uncommonMessage = require('./lib/non-commonjs-lib');
window.console.log(uncommonMessage);

// if you want to use global var from external lib
window.globalVar = 'Loaded via window.globalVar';
// do not use the window object, but use shim configuration (see `config-shim.js`)
window.console.log(require('global-var'));

// expose foo to other modules
module.exports.foo = foo;
