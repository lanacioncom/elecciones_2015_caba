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
    merge = require('merge-stream');

var rimraf = require('gulp-rimraf');

var t = new Date().getTime();
var v = "0.5";


function get_id_git() {
	var fs = require('fs');
	var path = require('path');
	var file_path = path.join(__dirname, '.git/refs/remotes/origin/master');
	v = fs.readFileSync(file_path, 'utf-8');
	return v.slice(0,10);
};

var js_all = 'js/all.v.'+get_id_git()+'.min.js';
var js_vendor = 'js/vendor.v.'+get_id_git()+'.min.js';
var css_file_min = 'all.v.'+get_id_git()+'.min.css';


// Clear build directory
// gulp.task('clear_build', function () {
// 	// console.log(cd);
// 	rimraf('./build/*');
// });
gulp.task('clear_build', function() {
  return gulp.src('./build/', { }) // much faster 
    .pipe(rimraf());
});

// build tasks
gulp.task('minify-css', function () {
	gulp.src(['css/reset.css', 'css/fonts.css', 'css/select2.css', 'css/styles.css'], { cwd: 'webapp' })
    .pipe(minifyCSS())
    .pipe(concat(css_file_min))
    .pipe(gulp.dest('build/css'));
});



// test JS
gulp.task('test_js', function(){
	return gulp.src(['js/permanentlinkjs.js', 'js/scripts.js', 'js/elecciones_app.js'], { cwd: 'webapp' })
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter(stylish));
});

gulp.task('js', ['test_js'], function () {
	var all = gulp.src(['js/permanentlinkjs.js', 'js/elecciones_app.js', 'js/scripts.js'] , { cwd: 'webapp' })
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat(js_all))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build'));
	
	var vendor = gulp.src([
		'js/jquery.min.js', 
		'js/select2/select2.min.js', 
		'js/handlebars.min.js', 
		'js/handlebars_helpers.js', 
		'js/jquery.nicescroll.min.js', 
		], { cwd: 'webapp' })
		.pipe(sourcemaps.init())
      	.pipe(uglify())
      	.pipe(concat(js_vendor))
		.pipe(sourcemaps.write('./'))
      	.pipe(gulp.dest('build'));

    return merge(all,vendor);
	
});

gulp.task('copy', function () {
	var html = gulp.src('**/*.html', { cwd: 'webapp' })
		.pipe(htmlreplace({
			js:[(js_vendor+'?'+t), (js_all+'?'+t)],
			css: ['css/'+css_file_min+'?'+t]
		}))
		.pipe(gulp.dest('build'));
	
	var fonts = gulp.src('css/fonts/*', { cwd: 'webapp' })
		.pipe(gulp.dest('build/css/fonts'));

	var img = gulp.src('img/*', { cwd: 'webapp' })
		.pipe(gulp.dest('build/img'));

	var css_img = gulp.src(['css/*.png', 'css/*.gif'], { cwd: 'webapp' })
		.pipe(gulp.dest('build/css'));

	var data = gulp.src('test_data/*', { cwd: 'webapp' })
		.pipe(gulp.dest('build/test_data'));

	var data = gulp.src('dicts/*', { cwd: 'webapp' })
		.pipe(gulp.dest('build/dicts'));
});

gulp.task('build', ['clear_build', 'minify-css', 'js', 'copy']);


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
  gulp.watch(['./webapp/*.html', './webapp/**/*.css', './webapp/**/*.js'], ['html', 'test_js']);
});
 
gulp.task('server', ['connect', 'watch']);

gulp.task('server_pro', function() {
  connect.server({
    root: 'build'
  });
});


// default task
gulp.task('default', function() {

  console.log("Elecciones 2015 CABA");
});
