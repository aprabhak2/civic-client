'use strict';

module.exports = function(config) {

  config.set({
    basePath : '..', //!\\ Ignored through gulp-karma //!\\

    files : [ //!\\ Ignored through gulp-karma //!\\
      'src/bower_components/angular/angular.js',
      'src/bower_components/angular/angular-route.js',
      'src/bower_components/angular-mocks/angular-mocks.js',
      'src/{app,components}/** /*.js',
      'test/unit/** /*.js'
    ],

    autoWatch : false,

    frameworks: ['mocha', 'chai', 'sinon'],

    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-chai'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });

};
