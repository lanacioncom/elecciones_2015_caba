var gulp = require('gulp'),
	connect = require('gulp-connect');
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
	build = require('gulp-build'),
	minifyCSS = require('gulp-minify-css'),
	sourcemaps = require('gulp-sourcemaps'),
	clean = require('gulp-clean'),
	htmlreplace = require('gulp-html-replace'),
	stylish = require('jshint-stylish'),
	gutil = require('gulp-util'),
	ftp = require('gulp-ftp');

var t = new Date().getTime(),
	js_all = 'js/all.min.js',
	js_vendor = 'js/vendor.min.js',
	css_file_min = 'all.min.css';

// build tasks
gulp.task('minify-css', function () {
	gulp.src(['css/reset.css', 'css/fonts.css', 'css/styles.css'], { cwd: 'webapp' })
    .pipe(minifyCSS())
    .pipe(concat(css_file_min))
    .pipe(gulp.dest('build/css'));
});

gulp.task('js', function () {
	gulp.src('js/scripts.js', { cwd: 'webapp' })
		.pipe(sourcemaps.init())
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter(stylish))
		.pipe(uglify())
		.pipe(concat(js_all))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build'));
	
	gulp.src([
		'js/jquery.min.js', 
		], { cwd: 'webapp' })
		.pipe(sourcemaps.init())
      	.pipe(uglify())
      	.pipe(concat(js_vendor))
		.pipe(sourcemaps.write())
      	.pipe(gulp.dest('build'));
	
});

gulp.task('copy', function () {
	gulp.src('**/*.html', { cwd: 'webapp' })
		.pipe(htmlreplace({
			js:[(js_vendor+'?'+t), (js_all+'?'+t)],
			css: ['css/'+css_file_min+'?'+t]
		}))
		.pipe(gulp.dest('build'));
	
	gulp.src('css/fonts/*', { cwd: 'webapp' })
		.pipe(gulp.dest('build/css/fonts'));

	gulp.src('img/*', { cwd: 'webapp' })
		.pipe(gulp.dest('build/img'));

	gulp.src('data', { cwd: 'webapp' })
		.pipe(gulp.dest('build'));

});

gulp.task('build', ['minify-css', 'js', 'copy']);


// SERVER
gulp.task('connect', function() {
  connect.server({
    root: 'webapp',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./webapp/*.html')
    .pipe(connect.reload());
});
 
gulp.task('watch', function () {
  gulp.watch(['./webapp/*.html', './webapp/**/*.css', './webapp/**/*.js'], ['html']);
});
 
gulp.task('server', ['connect', 'watch']);

gulp.task('server_pro', function() {
  connect.server({
    root: 'build',
  });
});


// default task
gulp.task('default', function() {
  console.log("Elecciones 2015 CABA");
});


//  push build to FTP
gulp.task('deploy_ftp', function () {
    var keys = require('./keys_ftp');
    return gulp.src('**/*', { cwd: 'build' })
        .pipe(ftp({
            host: keys.host,
            user: keys.user,
            pass: keys.pass,
            remotePath: keys.remotePath,
        }))
        // you need to have some kind of stream after gulp-ftp to make sure it's flushed 
        // this can be a gulp plugin, gulp.dest, or any kind of stream 
        // here we use a passthrough stream 
        .pipe(gutil.noop());
});