'use strict';

var gulp = require('gulp');
var SSH = require('node-sshclient');

var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

gulp.task('protractor-only', ['webdriver-update', 'wiredep'], function (done) {
  var testFiles = [
    'test/e2e/**/*.js'
  ];

  // set up the testing API server:
  var ssh = new SSH.SSH( { hostname : 'orienteer-1.orienteer.io' , user : 'deploy' , port : 22 } );

  ssh.command('~/test-server',['start'],function(res) {
    console.log("RES: ",res);
  gulp.src(testFiles)
    .pipe($.protractor.protractor({
      configFile: 'test/protractor.conf.js',
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    })
    .on('end', function () {
      // Close browser sync server
      browserSync.exit();
      ssh.command("~/test-server",['stop'],function(res) {
        console.log("DRES: ",res);
        done();
      });
    });
  });
});

gulp.task('protractor', ['serve:e2e', 'protractor-only']);
gulp.task('protractor:src', ['serve:e2e', 'protractor-only']);
gulp.task('protractor:dist', ['serve:e2e-dist', 'protractor-only']);
