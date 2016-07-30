var gulp = require('gulp'),
    gutil = require('gulp-util'),
    compass = require('gulp-compass'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-htmlmin'),
    minifyJSON = require('gulp-jsonminify'),
    minifyIMAGE = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    browserify = require('gulp-browserify'),
    coffee = require('gulp-coffee'),
    gulpif = require('gulp-if'),
    uglify= require('gulp-uglify'),
    concat = require('gulp-concat');



var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    sassStyle,
    outputDIR;

htmlSources = [outputDIR+'*.html'];
sassSources = ['components/sass/style.scss'];
coffeeSources = ['components/coffee/*.coffee'];
jsonSources = [outputDIR+'js/*.json'];
jsSources =[
    'components/scripts/*.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'];

env = process.env.NODE_ENV || 'development'; // options: 'development', 'treehouse', 'production'

if(env === 'development'){
    outputDIR = 'builds/development/'; // output development environment
    sassStyle = 'expanded';
} else if (env === 'treehouse'){
    outputDIR = 'builds/treehouse/';// output treehouse github format
    sassStyle = 'expanded';
} else{
    outputDIR = 'builds/production/'; // output production server environment
    sassStyle = 'compressed';
}



gulp.task('coffee', function () {
    gulp.src(coffeeSources)
        .pipe(coffee({bare: true})
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});



gulp.task('js', function () {
   gulp.src(jsSources)
       .pipe(concat('script.js'))
       .pipe(browserify())
       .pipe(gulpif(env === 'production', uglify()))
       .pipe(gulp.dest(outputDIR+'js'))
       .pipe(connect.reload())
});



gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: outputDIR+'images',
            style: sassStyle
        }))
        .on('error', gutil.log)
        .pipe(gulpif(env === 'production', minifyCSS()))
        .pipe(gulp.dest(outputDIR+'css'))
        .pipe(connect.reload())
});



gulp.task('watch', function () {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch('builds/development/js/*.json', ['json']);
    gulp.watch('builds/development/images/**/*.*', ['images']);
});



gulp.task('connect', function() {
    connect.server({
        root: outputDIR,
        livereload: true
    });
});



gulp.task('html', function () {
    gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML({collapseWhitespace: true})))
    .pipe(gulpif(env === 'production', gulp.dest(outputDIR)))
    .pipe(connect.reload())
});



gulp.task('images', function () {
   gulp.src('builds/development/images/**/*.*')
   .pipe(gulpif(env === 'production', minifyIMAGE({
       progressive: true,
       svgoPlugins: [{ removeViewBox: false}]
   })))
   .pipe(gulpif(env === 'production', gulp.dest(outputDIR + 'images')))
   .pipe(connect.reload())
});



gulp.task('json', function () {
    gulp.src('builds/development/js/*.json')
        .pipe(gulpif(env === 'production', minifyJSON()))
        .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
        .pipe(connect.reload())
});



gulp.task('default', ['html', 'coffee', 'json', 'js', 'compass', 'images',  'connect', 'watch']);