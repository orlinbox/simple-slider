/* Includes ----------------------------------------------------------------- */

var fs = require('fs');
var respath = require('path');
var gulp = require('gulp');
var color = require('colors');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var notify = require("gulp-notify");
var gulp_css_count = require('gulp-css-count');

/* Styles ------------------------------------------------------------------- */

function styles() {
  var onError = function(err) { notify.onError({title: "SASS"})(err); this.emit('end'); };
  return gulp.src('simple-slider.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass({outputStyle: 'expanded'})) /* compressed / expanded */
    .pipe(gulp.dest('./'));
}

function stylesCount() { return gulp.src('simple-slider.css').pipe(gulp_css_count()); }

/* Scripts ------------------------------------------------------------------ */

function scriptsLint() {
  var onError = function(err) { notify.onError({title: "JS"})(err); this.emit('end'); };
  return gulp.src('simple-slider.js')
    .pipe(plumber({errorHandler: onError}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('end', function() { logInfo('simple-slider.js'); });
}

/* Helpers ------------------------------------------------------------------ */

function logInfo(file) {
  var path = file;
  var absolutePath = respath.resolve(path);
  var stats = fs.statSync(path);
  console.log('\n' + color.cyan(absolutePath) + ' ' +  color.yellow((stats.size/1000).toFixed(2) +' kB'));
}

var buildStyles = gulp.series(styles, stylesCount);
var build = gulp.parallel(buildStyles, scriptsLint);

function watchNow() { gulp.watch(['simple-slider.js', 'simple-slider.scss'], build); }

gulp.task('watch', gulp.parallel(build, watchNow));
gulp.task('default', build);
