var gulp = require('gulp'),
    connect = require('gulp-connect');
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    del = require('del'),
    minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    htmlreplace = require('gulp-html-replace'),
    stylish = require('jshint-stylish'),
    merge = require('merge-stream'),
    minifyHTML = require('gulp-minify-html');


function get_id_git() {
    var fs = require('fs');
    var path = require('path');
    var file_path = path.join(__dirname, '../.git/refs/remotes/origin/master');
    v = fs.readFileSync(file_path, 'utf-8');
    return v.slice(0,10);
};

var js_all = 'all.v'+get_id_git()+'.min.js';
var js_vendor = 'vendor.v'+get_id_git()+'.min.js';
var css_file_min = 'all.v'+get_id_git()+'.min.css';


gulp.task('clear_build', function() {
    del(['../build/**/*'],{force: true});
});

// build tasks
gulp.task('minify-css', function () {
    gulp.src(['css/reset.css', 'css/fonts.css', 
              'css/select2.css', 'css/style.css'], { cwd: '../webapp' })
    .pipe(minifyCSS())
    .pipe(concat(css_file_min))
    .pipe(gulp.dest('../build/css'));
});

// test JS
gulp.task('test_js', function(){
    return gulp.src(['js/permanentlinkjs.js', 'js/handlebars_helpers.js',
                     'js/elecciones_app.js', 'js/scripts.js'], { cwd: '../webapp' })
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter(stylish));
});

gulp.task('js', ['test_js'], function () {
    var all = gulp.src(['js/permanentlinkjs.js', 'js/handlebars_helpers.js',
                       'js/elecciones_app.js', 'js/scripts.js'] , { cwd: '../webapp' })
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(js_all))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('../build/js'));
    
    var vendor = gulp.src([
        'libs/jquery/dist/jquery.min.js', 
        'libs/select2/select2.min.js', 
        'libs/handlebars/handlebars.min.js', 
        'libs/jquery.nicescroll/jquery.nicescroll.min.js', 
        ], { cwd: '../webapp' })
        .pipe(sourcemaps.init())
          .pipe(uglify())
          .pipe(concat(js_vendor))
        .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest('../build/libs'));

    return merge(all,vendor);
    
});

gulp.task('copy', function () {
    var opts = {
        conditionals: true,
        spare:true
    };
    var html = gulp.src('*.html', { cwd: '../webapp' })
        .pipe(htmlreplace({
            js:['libs/'+js_vendor, 'js/'+js_all],
            css: ['css/'+css_file_min]
        }))
        //.pipe(minifyHTML(opts))
        .pipe(gulp.dest('../build'));

    
    var fonts = gulp.src('css/fonts/*', { cwd: '../webapp' })
        .pipe(gulp.dest('../build/css/fonts'));

    var img = gulp.src('img/*', { cwd: '../webapp' })
        .pipe(gulp.dest('../build/img'));

    var css_img = gulp.src(['css/images/*'], { cwd: '../webapp' })
        .pipe(gulp.dest('../build/css/images'));

    var data = gulp.src('data/*', { cwd: '../webapp' })
        .pipe(gulp.dest('../build/data'));

    return merge(html, fonts, img, css_img, data);
});

gulp.task('build', ['minify-css', 'js', 'copy']);


// SERVER TASKS
gulp.task('connect', function() {
  connect.server({
    root: '../webapp',
    livereload: true,
    port:8080
  });
});

gulp.task('html', function () {
  gulp.src('../webapp/*.html')
    .pipe(connect.reload());
});
 
gulp.task('watch', function () {
  gulp.watch(['../webapp/*.html', '../webapp/**/*.css', '../webapp/**/*.js'], ['html', 'test_js']);
});

// development server
gulp.task('server', ['connect', 'watch']);

// production server
gulp.task('server_pro', function() {
  connect.server({
    root: '../build'
  });
});

// default task
gulp.task('default', function() {
  console.log("Elecciones 2015 CABA");
});
