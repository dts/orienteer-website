'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('styles', ['wiredep'],  function () {
  return gulp.src('src/{app,components,common}/**/*.scss')
    .pipe($.sass({style: 'expanded'}))
    .on('error', handleError)
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size());
});

gulp.task('scripts', function () {
  return gulp.src('src/{app,components,common,lib}/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.size());
});

gulp.task('markdown',function() {
  return gulp.src('src/help/**/*.md')
    .pipe($.markdown())
    .pipe(gulp.dest('.tmp/help/'))
});

gulp.task('help-partials',['markdown'],function() {
  return gulp.src('.tmp/help/**/*.html')
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({
      moduleName: 'orienteerio',
      declareModule: false,
      stripPrefix: '.tmp/',
      prefix: 'help/'
    }))
    .pipe(gulp.dest('.tmp/help/'))
    .pipe($.size());
});

gulp.task('partials', function () {
  return gulp.src('src/{app,components,common}/**/*.html')
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({
      moduleName: 'orienteerio',
      declareModule: false,
      stripPrefix: 'src/'
    }))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size());
});

gulp.task('manifest', ['html'] , function(){
  gulp.src(['dist/**/*'])
    .pipe($.manifest({
      hash: true,
      preferOnline: false,
      timestamp: false,
      network: ['http://*', 'https://*', '*'],
      filename: 'manifest.appcache',
      exclude: 'manifest.appcache'
     }))
    .pipe(gulp.dest('dist'));
});

gulp.task('html', ['styles', 'scripts', 'partials','help-partials'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src('src/index.html')
    .pipe($.inject(gulp.src('{src,.tmp}/{app,components,common,lib,help}/**/*.js',{read:false}), {
      read: false,
      starttag: '<!-- inject:partials -->',
      addRootSlash: false,
      addPrefix: '../'
    }))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
//    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('bower_dist',function() {
  return gulp.src(
    ['bower_components/leaflet/dist/images/**/*',
     'bower_components/Leaflet.awesome-markers/dist/images/**/*'])
    .pipe(gulp.dest('dist/styles/images'))
    .pipe($.size());
});

gulp.task('images', function () {
  return gulp.src([
    'src/assets/images/**/*'])
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe($.size());
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size());
});

gulp.task('misc', function () {
  return gulp.src(['src/**/*.ico','src/oauthcallback.html','src/logoutcallback.html'])
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('clean', function (done) {
  $.del(['.tmp', 'dist'], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'misc','bower_dist','manifest']);
