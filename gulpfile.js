// Include gulp
var gulp = require('gulp'); 

// Include plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');


// JS lint task [jsHint]
gulp.task('lint-js', function() {
  return gulp.src(['./js/**/*.js', '!js/plugins/**/*.js']) //exclude plugins
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


// Compile Sass
gulp.task('compile-sass', function() {
  return gulp.src('./css/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'))         // compile sass to working folder
    .pipe(gulp.dest('./dist/css'));  // compile sass to dist folder
});


// Minify CSS (concatenate, auto-prefix and minify)
gulp.task('minify-css', gulp.series('compile-sass', function() {
  gulp.src(['./dist/css/**/*.css'])
    .pipe(concat('styles.min.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dist/css'));
}));


// Minify JS (concatenate and minify)
gulp.task('minify-js', function() {
  return gulp.src('./js/**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});
 

// Compress new images
gulp.task('compress-images', function() {
  gulp.src('./img/**/*')
    .pipe(changed('./img'))
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'));
});


// Watch Files For Changes
gulp.task('watch', gulp.series('compile-sass', function() {
  gulp.watch(['js/**/*.js', '!js/plugins/**/*.js'], gulp.series('lint-js', 'minify-js'));
  gulp.watch('css/**/*.scss', gulp.series('compile-sass'));
}));


// Default Task
gulp.task('default', gulp.series('watch'));
gulp.task('publish', gulp.series('minify-css', 'minify-js', 'compress-images'));
