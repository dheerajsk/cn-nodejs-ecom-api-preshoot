import gulp from 'gulp';
import uglify from 'gulp-uglify';
import cssnano from 'gulp-cssnano';
import imagemin from 'gulp-imagemin';

gulp.task('minify-js', function() {
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('minify-css', function() {
    return gulp.src('src/css/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('optimize-images', function() {
  return gulp.src('src/images/*')
      .pipe(imagemin())
      .pipe(gulp.dest('dist/images'));
});

gulp.task('default', gulp.series('minify-js', 'minify-css', 'optimize-images'));
