// Définition de gulp js version "simple"
'use strict';

// MODULES
// ----------------------------------------------------------------------------
var path      = require('path');
var gulp      = require('gulp');
var gif       = require('gulp-if');
var plumber   = require('gulp-plumber');
var sourcemap = require('gulp-sourcemaps');
var uglify    = require('gulp-uglify');
var bs        = require('browser-sync');
var err       = require('../../tools/errcb');
var ENV       = require('../../tools/env');

var SRC  = path.join(ENV.js['src-dir'], '**', '*');

var DEST = ENV.js['dest-dir'];

// TASK DEFINITION
// ----------------------------------------------------------------------------
// $ gulp js
// ----------------------------------------------------------------------------
// Gère toutes les actions d'assemblage JavaScript
gulp.task('js', 'Copy JS files into build folder.', ['test:js'], function () {
  return gulp.src(SRC)
    .pipe(plumber({ errorHandler: err }))
    .pipe(sourcemap.init())
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
