// Définition de gulp js version "browserify"
'use strict';

// MODULES
// ----------------------------------------------------------------------------
var path       = require('path');
var gulp       = require('gulp');
var gif        = require('gulp-if');
var glob       = require('glob');
var through    = require('through2');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var browserify = require('browserify');
var babelify   = require('babelify');
var sourcemap  = require('gulp-sourcemaps');
var uglify     = require('gulp-uglify');
var bs         = require('browser-sync');
var ENV        = require('../../tools/env');

var SRC  = path.join(ENV.js['src-dir'], '**', '*.js');
var DEST = ENV.js['dest-dir'];

// TASK DEFINITION
// ----------------------------------------------------------------------------
// $ gulp js
// ----------------------------------------------------------------------------
// Gère toutes les actions d'assemblage JavaScript
gulp.task('js', 'Compile JS files into build folder using browserify.', ['test:js'], function () {
  var buildStream = through();

  buildStream
    .pipe(source(ENV.js.filename))
    .pipe(buffer())
    .pipe(sourcemap.init({loadMaps: true}))
    .pipe(gif(ENV.all.optimize, uglify()))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest(DEST))
    .pipe(bs.stream());

  glob(SRC, {}, function (err, files) {
    if (err) {
      buildStream.emit('error', err);
      return;
    }

    browserify({
        entries: files,
        // debug: true,
        transform: ['browserify-shim']
      })
      .transform(babelify, {
        presets: ['es2015']
      })
      .bundle()
      .pipe(buildStream);
  });

  return buildStream;
}, {
  options: {
    optimize : 'Optimize for production.',
    relax    : 'Skip tests. ☠ ☠ ☠'
  }
});
