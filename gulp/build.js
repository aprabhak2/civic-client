'use strict';

var gulp = require('gulp');
var es = require("event-stream")
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});
// TODO require gulp plugins normally instead of using gulp-load-plugins - makes the code easier to understand

var connect = require('gulp-connect');

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('styles', ['wiredep'],  function () {
  return gulp.src([
    'src/{app,components}/**/*.less',
    '!src/{app,components}/**/_*.less'
  ])
    .pipe($.less({
      paths: [
        'src/bower_components',
        'src/app',
        'src/components'
      ]
    }))
    .on('error', handleError)
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size());
});

gulp.task('scripts', function () {
  return gulp.src('src/{app,components}/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.size());
});

gulp.task('partials', function () {
  return gulp.src('src/{app,components}/**/*.html')
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({
      moduleName: 'civicClient'
    }))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size());
});

gulp.task('html', ['styles', 'scripts', 'partials'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src('src/*.html')
    .pipe($.inject(
      gulp.src('.tmp/{app,components}/**/*.js'),
      {
        starttag: '<!-- inject:partials -->',
        addRootSlash: false,
        addPrefix: '../'
      }))
    .pipe(assets = $.useref.assets()) // remove links to individual dev files from index.html
    .pipe($.rev()) // append revision hash to static files
    .pipe(jsFilter) // handle scripts
    .pipe($.sourcemaps.init()) // initialize sourcemap generation
    .pipe($.ngAnnotate()) // add angular dependency injection to protect from minification
    .pipe($.uglify({ // minify js
        preserveComments: $.uglifySaveLicense,
        mangle: true,
        compress: {
          drop_console: true,
          unused: true
        }
      }
    ))
    .pipe($.sourcemaps.write('.')) // write sourcemaps
    .pipe(jsFilter.restore())
    .pipe(cssFilter) // handle CSS
    .pipe($.replace('/bower_components/bootstrap/fonts','/assets/fonts')) // rewrite bootstrap font urls
    .pipe($.replace(/url\('ui-grid\.(.*?)'\)/g,'url(\'/assets/fonts/ui-grid.$1\')')) // rewrite ui-grid font urls
    .pipe($.replace(/url\('\.\.\/fonts\/fontawesome-webfont\.(.*?)'\)/g,'url(\'/assets/fonts/fontawesome-webfont.$1\')')) // rewrite font-awesome fonts
    .pipe($.csso()) // minify CSS
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace()) // substitute new filenames in index.html
    .pipe(htmlFilter) // handle HTML
    .pipe($.minifyHtml({ // minify HTML
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('images', function () {
  return gulp.src('src/assets/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe($.size());
});

gulp.task('fonts', function () {
  return es.concat(
    gulp.src($.mainBowerFiles()),
    gulp.src('src/assets/fonts/**/*')
  )
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe($.size());
});

gulp.task('misc', function () {
  return gulp.src('src/**/*.ico')
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('clear-cache', function() {
  $.cache.clearAll();
});

gulp.task('clean', function (done) {
  $.del(['.tmp', 'dist'], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'misc']);
