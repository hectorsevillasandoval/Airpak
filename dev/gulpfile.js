var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    newer = require('gulp-newer'),
    uncss = require('gulp-uncss'),
    connect = require('gulp-connect'),
    htmlmin = require('gulp-html-minifier'),
    imagemin = require('gulp-imagemin'),
    gulpif = require('gulp-if'),
    sprite = require('css-sprite').stream,
    compressor = require('gulp-compressor');


//tareas
gulp.task('stylus', function() {
    'use strict';
    gulp.src('stylus/main.styl')
        .pipe(stylus({
            use: [nib()],
            compress: true
        }))
        .pipe(gulp.dest('../public/css'))
        .pipe(connect.reload());

});

// generate sprite.png and _sprite.scss
gulp.task('sprites', function() {
    return gulp.src('img/icons/*.png')
        .pipe(sprite({
            name: 'sprite',
            style: '_sprite.styl',
            cssPath: '../img',
            processor: 'stylus'
        }))
        .pipe(gulpif('*.png', gulp.dest('img/'), gulp.dest('stylus/')))
});



gulp.task('uglify', function() {
    gulp.src('js/*.js')
        .pipe(uglify({
            compress: true
        }))
        .pipe(gulp.dest('../public/js'))
        .pipe(connect.reload());
});
gulp.task('imagemin', function() {
    // content
    return gulp.src('img/*')
        .pipe(newer('../public/img/'))
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('../public/img/'))
        .pipe(connect.reload());
});

gulp.task('minify', function() {
    gulp.src('*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('../public/'))
        .pipe(connect.reload());
});

gulp.task('concat', function() {
    gulp.src(['../public/js/*.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('../public/js/minificado'))
        .pipe(connect.reload());
});

//vigilando archivos
gulp.task('watch', function() {
    // content
    gulp.watch('stylus/*.styl', ['stylus']);
    gulp.watch('js/*.js', ['uglify', 'concat']);
    gulp.watch('img/*', ['imagemin']);
    gulp.watch('img/icons/*', ['sprites']);
    gulp.watch('*.html', ['minify']);
    /*gulp.watch('../public/css/main.css', ['uncss']);*/
});
gulp.task('uncss', function() {
    // content
    gulp.src('../public/css/main.css')
        .pipe(uncss({
            html: ['index.html', 'transferencia-dinero.html', 'entrega-inmediata.html', 'agencias.html']
        }))
    /*.pipe(compressor())*/
    .pipe(gulp.dest('../public/uncss/'));
});

gulp.task('connect', function() {
    // content
    connect.server({
        root: '../public/',
        port: 8800,
        livereload: true
    });
});
gulp.task('default', ['connect', 'watch']);
