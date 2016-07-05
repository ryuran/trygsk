// Définition de gulp js version "simple"
'use strict';

// MODULES
// ----------------------------------------------------------------------------
var path      = require('path');
var gulp      = require('gulp');
var gif       = require('gulp-if');
var plumber   = require('gulp-plumber');
var concat    = require('gulp-concat');
var sourcemap = require('gulp-sourcemaps');
var uglify    = require('gulp-uglify');
var bs        = require('browser-sync');
var err       = require('../../tools/errcb');
var ENV       = require('../../tools/env');

// You may want to specify the files order in _config.json_, via the following
// attribute: `ENV.js.src`
// Otherwise files will be concatenated in alphabetical order, starting with
// _lib_ folder
var SRC  = [
  path.join(ENV.js['src-dir'], 'lib', '**', '*'),
  path.join(ENV.js['src-dir'], '**', '*')
];
if(ENV.js.src) {
  SRC = ENV.js.src.map(function(jsfile) {
    return path.resolve('.', path.normalize(jsfile));
  });
}

var DEST = ENV.js['dest-dir'];

// TASK DEFINITION
// ----------------------------------------------------------------------------
// $ gulp js
// ----------------------------------------------------------------------------
// Gère toutes les actions d'assemblage JavaScript
gulp.task('js', 'Concatenate JS files into build folder.', ['test:js'], function () {
  return gulp.src(SRC)
    .pipe(plumber({ errorHandler: err }))
    .pipe(sourcemap.init())
    .pipe(concat(ENV.js.filename))
    .pipe(gif(ENV.all.optimize, uglify()))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest(DEST))
    .pipe(bs.stream());
}, {
  options: {
    optimize : 'Optimize for production.',
    relax    : 'Skip tests. ☠ ☠ ☠'
  }
});
