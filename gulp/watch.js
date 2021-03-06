'use strict';

var gulp = require('gulp');

gulp.task('watch', ['styles','markdown'] ,function () {
  gulp.watch('src/{app,components,common}/**/*.scss', ['styles']);
  gulp.watch('src/{app,components,common}/**/*.js', ['scripts','html']);
  gulp.watch('src/{app,components,common}/**/*.html', ['html']);
  gulp.watch('src/help/*.md',['markdown']);
  gulp.watch('src/assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
