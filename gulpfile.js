var gulp = require('gulp'),
    gulpSass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    gulpUseref = require('gulp-useref'),
    gulpUglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    gulpCleanCss = require('gulp-clean-css'),
    del = require('del'),
    runSequence = require('run-sequence')


gulp.task('sass', function () {
  return gulp.src('app/assets/stylesheets/**/*.scss')
    .pipe(gulpSass())
    .pipe(gulpCleanCss())
    .pipe(gulp.dest('app/assets/css'))
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

gulp.task('watch', ['browserSync', 'sass'], function () {
  gulp.watch('app/assets/stylesheets/**/*.scss', ['sass'])
  gulp.watch('app/*index.html', browserSync.reload)
  gulp.watch('app/assets/javascripts/**/*.js', browserSync.reload)
})

gulp.task('default', function () {
  runSequence(['sass', 'browserSync', 'watch'])
})

gulp.task('build', ['clean', 'sass', 'useref'], function () {
  runSequence('clean', ['sass', 'useref'])
})
