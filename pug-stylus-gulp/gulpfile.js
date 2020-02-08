var gulp = require('gulp');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var autoprefixer = require('autoprefixer-stylus');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var del = require('del');
var imagemin = require("gulp-imagemin");
var webserver = require('gulp-webserver');

var uid = process.getuid()


gulp.task('js', function() {
  var files = [
    'src/resources/js/app.js',
  ];
  gulp.src(files)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/resources/js/'));
});

gulp.task('imagemin', function() {
  return gulp.src(['src/resources/images/**/*'])
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3,
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo(),
      imagemin.gifsicle()
    ]))
    .pipe(gulp.dest('src/resources/images/'));
});

gulp.task('copyImage', function() {
  return gulp.src('src/resources/images/**/*')
    .pipe(gulp.dest('public/resources/images/'));
});

gulp.task('copyFont', function() {
  return gulp.src('src/resources/fonts/**/*')
    .pipe(gulp.dest('public/resources/fonts/'));
});

gulp.task('clean', function (cb) {
  return del(['public/resources/**/', 'public/*/'], {force: true}, cb);
});

gulp.task('stylus', function() {
  gulp.src(['src/**/*.styl','!src/**/_*.styl'])
  .pipe(sourcemaps.init())
  .pipe(plumber({
    handleError: function (err) {
      console.log(err);
      this.emit('end');
    }
  }))
  .pipe(stylus({
    compress: true,
    use: [autoprefixer({ browsers: ['ie >= 11', 'Android >= 4.3', 'iOS >= 8'] })],
    rawDefine: { env: process.env.NODE_ENV }
  }))
  .pipe(sourcemaps.write('/'))
  .pipe(gulp.dest('public/'));
});

gulp.task('pug', function() {
  gulp.src(['src/**/*.pug','!src/**/_*.pug'])
  .pipe(plumber({
    handleError: function (err) {
      console.log(err);
      this.emit('end');
    }
  }))
  .pipe(pug({
    basedir: 'src/'
  }))
  .pipe(gulp.dest('public/' ));
});

gulp.task('build', function(callback){
  runSequence(
    'clean',
    'js',
    'copyImage',
    'copyFont',
    'stylus',
    'pug',
    callback
  );
});

gulp.task('watch-images', function(callback){
  runSequence(
    'copyImage',
    callback
  );
});

gulp.task('webserver', ['build'], function () {
  gulp.src('public/')
  .pipe(webserver({
    host: 'localhost',
    port: 8000,
    livereload: {
      enable: true,
    }
  }));
});

gulp.task('watch', ['webserver'], function(){
  gulp.watch('src/resources/images/**/*', ['watch-images']);
  gulp.watch('src/resources/js/**/*.js', ['js']);
  gulp.watch('src/**/*.styl', ['stylus']);
  gulp.watch('src/**/*.pug', ['pug']);
});


gulp.task('default', ['watch']);