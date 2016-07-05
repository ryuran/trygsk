'use strict';

// MODULES
// ----------------------------------------------------------------------------
var fs       = require('fs');
var path     = require('path');
var exec     = require('child_process').exec;
var runner   = require('run-sequence');
var glob     = require('glob');
var gulp     = require('gulp');
var gutil    = require('gulp-util');
var data     = require('gulp-data');
var newer    = require('gulp-newer');
var markdown = require('gulp-markdown');
var prettify = require('gulp-prettify');
var dox      = require('gulp-dox');
var hbs      = require('gulp-hbs');
var dir      = require('require-dir');
var ENV      = require('../tools/env');

var SRC      = path.join(ENV.doc['src-dir'], '**', '*.md');
var SRC_JS   = path.join(ENV.js['src-dir'], '**', '*.js');

var DEST     = path.resolve(ENV.doc['dest-dir']);
var DEST_URL = DEST.replace(path.resolve(ENV.connect.baseDir), '')
                   .replace(path.sep, '/');


// UTILS
// ----------------------------------------------------------------------------
function extractData(file) {
  var parsed = path.parse(file.path);

  // Basic configuration for MarkDown files
  var src   = ENV.doc['src-dir'];
  var gPath = SRC;
  var rURL  = DEST_URL;
  var out   = {
    filename: parsed.name
  };

  // Extra configuration for JavaScript files
  if (parsed.ext === '.json') {
    src = ENV.js['src-dir'];
    gPath = SRC_JS;
    rURL += '/js';
    out.data = JSON.parse(file.contents);
  }

  // Set up final URL for the document
  out.url = file.path.replace(src, rURL).replace(parsed.ext, '.html');

  // Special case js/index.md which is the Javascript doc homepage
  if (parsed.name === 'index' && parsed.dir.slice(-3) === '/js') {
    src = ENV.js['src-dir'];
    gPath = SRC_JS;
    rURL += '/js';
  }

  // Index related content
  out.toc = glob.sync(gPath).reduce(function (a, f) {
    var u = f
      .replace(src, rURL)
      .replace(path.parse(f).ext, '.html');

    // Ignore JS API homepage (it has its own entry within templates)
    if (u === rURL + '/js/index.html') { return a; }

    var p = path.parse(u);

    a.push({
      dir : p.dir.replace(rURL, '').replace(/^\//, ''),
      name: p.name.replace('_', ' ').replace(/^./, function (s) { return s.toUpperCase(); }),
      url : path.relative(path.parse(out.url).dir, u)
    });

    return a;
  }, []).sort(function (a, b) {
    if (a.dir === b.dir) { return a.name.localeCompare(b.name); }
    // if (a.dir === '') { return 1; }
    return a.dir.localeCompare(b.dir);
  });

  return out;
}

// HBS HELPERS
// ----------------------------------------------------------------------------
var helpers = dir('../tools/handlebars/helpers');

hbs.registerHelper(helpers);


// MARKED CUSTOM RENDERER
// ----------------------------------------------------------------------------
var renderer = new markdown.marked.Renderer();

// Link to markdown files are transformed into link to HTML files
// This allow to use both the gitlab markdown linking and the HTML
// transformation for exporting the doc.
renderer.link = function (href, title, text) {
  var url = [];
  url.push('<a href="');
  url.push(href.replace(/\.md$/, '.html'));
  url.push('"');

  if (title) {
    url.push(' title="');
    url.push(title);
    url.push('"');
  }

  url.push('>');
  url.push(text);
  url.push('</a>');

  return url.join('');
};


// PRETTIFY CONFIGURATION
// ----------------------------------------------------------------------------
var PRT_CONF;

try {
  // gulp-prettify est trop con pour gérer lui même les fichiers .jsbeautifyrc
  PRT_CONF = JSON.parse(fs.readFileSync('./.jsbeautifyrc'));
} catch (e) {
  gutil.log(gutil.colors.yellow('WARN:'), '[.jsbeautifyrc]', e.message);

  PRT_CONF = {
    brace_style          : 'collapse',
    end_with_newline     : true,
    indent_size          : 2,
    indent_char          : ' ',
    indent_inner_html    : false,
    indent_scripts       : 'normal',
    max_preserve_newlines: 2,
    preserve_newlines    : true,
    unformatted          : [
      'pre', 'code', 'a', 'sub', 'sup', 'b', 'i', 'u', 'strong', 'em'
    ]
  };
}


// TASK DEFINITION
// ----------------------------------------------------------------------------

// $ gulp doc:js
// ----------------------------------------------------------------------------
// Génère la documentation des fichiers javascripts
gulp.task('doc:js', 'Compile Javascript documentation.', function () {
  return gulp.src(SRC_JS)
    .pipe(newer(path.join(DEST, 'js')))
    .pipe(dox())
    .pipe(data(extractData))
    .pipe(hbs('./.gsk/tools/doc/jsdoc.hbs', { dataSource: 'data' }))
    .pipe(prettify(PRT_CONF))
    .pipe(gulp.dest(path.join(DEST, 'js')));
});

// $ gulp doc:static
// ----------------------------------------------------------------------------
// Génère toute la doc statique du projet
gulp.task('doc:static', 'Compile the static documentation.', function () {
  return gulp.src(SRC)
    .pipe(newer(DEST))
    .pipe(markdown({
      renderer: renderer
    }))
    .pipe(data(extractData))
    .pipe(hbs('./.gsk/tools/doc/staticdoc.hbs', { dataSource: 'data' }))
    .pipe(prettify(PRT_CONF))
    .pipe(gulp.dest(DEST));
});

// $ gulp doc:kss
// ----------------------------------------------------------------------------
// Génère le styleguide du projet via KSS
gulp.task('doc:kss', 'Compile the styleguide, using KSS.', function (cb) {
  var CONF = require('../../kss.json');

  exec([
    'mkdir -p ', path.resolve(CONF.destination), ' && ',
    './node_modules/.bin/kss-node -c ./kss.json'
  ].join(''), function (err, stdout, stderr) {
    stdout.split('\n').forEach(function (line) {
      gutil.log(line);
    });

    if (stderr) {
      gutil.log(gutil.colors.red('ERROR:'), '[kss]', stderr);
    }

    if (err && !stderr) {
      gutil.log(gutil.colors.red('ERROR:'), '[kss]', err.message);
    }

    cb(null);
  });
});

// $ gulp doc
// ----------------------------------------------------------------------------
// Génère toute la doc du projet
gulp.task('doc', 'Compile all documentations of the project.', function (cb) {
  // Si on optimize le projet, on n'inclus pas la documentation.
  if (ENV.all.optimize) {
    cb(null);
    return;
  }

  runner('doc:static', ['doc:kss', 'doc:js'], cb);
});
