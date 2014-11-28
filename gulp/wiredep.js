'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  return gulp.src('src/index.html')
    .pipe(wiredep({
      directory: 'bower_components',
      exclude: [/bootstrap-sass-official/, /bootstrap.js/, /bootstrap.css/,
                /jquery.fileupload-jquery-ui.js/,
                /jquery.fileupload-video.js/,
                /jquery.fileupload-audio.js/,
                /jquery.fileupload-image.js/,
                /jquery.fileupload-validate.js/,
                /jquery.fileupload-ui.js/,
                /blueimp-load-image/
               ],
      
    }))
    .pipe(gulp.dest('src'));
});
