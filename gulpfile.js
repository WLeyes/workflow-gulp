var gulp = require('gulp'),
    gutil = require('gulp-util'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    browserify = require('gulp-browserify'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat');



var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDIR;

htmlSources = [outputDIR+'*.html'];
sassSources = ['components/sass/style.scss'];
coffeeSources = ['components/coffee/*.coffee'];
jsonSources = [outputDIR+'js/*.json'];
jsSources =[
    'components/scripts/*.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

env = process.env.NODE_ENV || 'development'; // options: 'development', 'treehouse', 'production'

if(env==='development'){
    outputDIR = 'builds/development/'; // output development environment
} else if (env==='treehouse'){
    outputDIR = 'builds/treehouse/';// output treehouse github format
} else{
    outputDIR = 'builds/production/'; // output production server environment
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
       .pipe(gulp.dest(outputDIR+'js'))
       .pipe(connect.reload())
});



gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: outputDIR+'images',
            style: 'expanded'
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest(outputDIR+'css'))
        .pipe(connect.reload())
});



gulp.task('watch', function () {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
});



gulp.task('connect', function() {
    connect.server({
        root: outputDIR,
        livereload: true
    });
});



gulp.task('html', function () {
    gulp.src(htmlSources)
    .pipe(connect.reload())
});



gulp.task('json', function () {
    gulp.src(jsonSources)
        .pipe(connect.reload())
});



gulp.task('default', ['html', 'coffee', 'json', 'js', 'compass', 'connect', 'watch']);