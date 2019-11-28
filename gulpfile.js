/* Includes ----------------------------------------------------------------- */

const fs = require('fs');
const respath = require('path');
const gulp = require('gulp');
const color = require('colors');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const notify = require("gulp-notify");
const gulpCssCount = require('gulp-css-count');

/* Helpers ------------------------------------------------------------------ */

const logInfo = file => {
  const path = file;
  const absolutePath = respath.resolve(path);
  const stats = fs.statSync(path);
  console.log('\n' + color.cyan(absolutePath) + ' ' +  color.yellow((stats.size/1000).toFixed(2) +' kB'));
}

/* Styles ------------------------------------------------------------------- */

const styles = () => {
  const onError = (err) => {
    notify.onError({ title: 'SASS' })(err);
    this.emit('end');
  };
  return gulp.src('simple-slider.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass({outputStyle: 'expanded'})) /* compressed / expanded */
    .pipe(gulp.dest('./'));
}

const stylesCount = () => gulp.src('simple-slider.css').pipe(gulpCssCount());

/* Scripts ------------------------------------------------------------------ */

const scripts = () => {
  const onError = (err) => {
    notify.onError({ title: 'JS' })(err);
    this.emit('end');
  };
  const file = 'simple-slider.js';
  return gulp.src(`./src/${file}`)
    .pipe(plumber({errorHandler: onError}))
    .pipe(babel({
      presets: ['@babel/env'],
    }))
    .pipe(gulp.dest('./'))
    .on('end', () => logInfo(file));
}

/* Gulp --------------------------------------------------------------------- */

const buildStyles = gulp.series(styles, stylesCount);
const build = gulp.parallel(buildStyles, scripts);

const watchNow = () => gulp.watch(['src/simple-slider.js', 'simple-slider.scss'], build);

gulp.task('watch', gulp.parallel(build, watchNow));
gulp.task('default', build);
