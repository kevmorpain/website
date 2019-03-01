const gulp = require('gulp'),
    gulpSass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    gulpUseref = require('gulp-useref'),
    gulpUglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    gulpCleanCss = require('gulp-clean-css'),
    gulpAutoprefixer = require('gulp-autoprefixer'),
    gulpBabel = require('gulp-babel'),
    del = require('del'),
    runSequence = require('run-sequence')


gulp.task('sass', function () {
  return gulp.src('app/assets/stylesheets/**/*.scss')
    .pipe(gulpSass())
    .pipe(gulpCleanCss())
    .pipe(gulpAutoprefixer({
      cascade: false,
      grid: true
    }))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('es6', function () {
  return gulp.src('app/assets/javascripts/**/*.js')
    .pipe(gulpBabel())
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('useref', function () {
  return gulp.src('app/*.html')
    .pipe(gulpIf('*.js', gulpUglify()))
    .pipe(gulpUseref())
    .pipe(gulp.dest('dist'))
})

gulp.task('clean', function (callback) {
  del('dist')
})

gulp.task('watch', ['browserSync', 'sass', 'es6'], function () {
  gulp.watch('app/assets/stylesheets/**/*.scss', ['sass'])
  gulp.watch('app/*index.html', browserSync.reload)
  gulp.watch('app/assets/javascripts/**/*.js', ['es6'])
})

gulp.task('default', function () {
  runSequence(['sass', 'browserSync', 'es6', 'watch'])
})

gulp.task('build', ['clean', 'sass', 'es6', 'useref'], function () {
  runSequence('clean', ['sass', 'es6', 'useref'])
})
