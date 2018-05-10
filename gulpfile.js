var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('jsx', function () {
  return gulp.src('src/react/index.jsx')
    .pipe(babel({
      presets: ['env', 'react']
    }))
    .pipe(gulp.dest('./lib/react/'));
});

gulp.task('js', function () {
  return gulp.src('src/react/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('./lib/react/'));
});

gulp.task('default', ['js','jsx']);