'use strict';

var gulp = require('gulp');
var path = require('path');
var karma = require('karma').server;
var wiredep = require('wiredep').stream;

/**
 * Run test once and exit
 */
gulp.task('test', ['test:wiredep'], function (done) {
  karma.start({
    configFile: path.resolve('test/karma.conf.js'),
    singleRun: true
  }, done);
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('test:watch', ['test:wiredep'], function (done) {
  karma.start({
    configFile: path.resolve('test/karma.conf.js')
  }, done);
});

// inject bower components into karma.conf
gulp.task('test:wiredep', function () {
  return gulp.src('test/karma.conf.js')
    .pipe(wiredep({
      directory: 'bower_components',
      exclude: [/bootstrap-sass-official/, /\/bootstrap.js/, /bootstrap.css/, /jquery.js/],
      devDependencies: true,
      ignorePath: '../',
      fileTypes: {
        js: {
          block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
          detect: {
            js: /".*\.js"/gi
          },
          replace: {
            js: '"{{filePath}}",'
          }
        }
      }
    }))
    .pipe(gulp.dest('test'));
});

//var gulp = require('gulp');
//
//var $ = require('gulp-load-plugins')();
//
//var wiredep = require('wiredep');
//
//gulp.task('test', function() {
//  var bowerDeps = wiredep({
//    directory: 'bower_components',
//    exclude: [/bootstrap-sass-official/, /\/bootstrap.js/, /bootstrap.css/, /jquery.js/],
//    dependencies: true,
//    devDependencies: true
//  });
//
//  var testFiles = bowerDeps.js.concat([
//    'src/{app,components}/**/*.js',
//    'test/unit/**/*.js'
//  ]);
//
//  return gulp.src(testFiles)
//    .pipe($.karma({
//      configFile: 'test/karma.conf.js',
//      action: 'run'
//    }))
//    .on('error', function(err) {
//      // Make sure failed tests cause gulp to exit non-zero
//      throw err;
//    });
//});
{

}
