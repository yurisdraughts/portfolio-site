const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
let imagemin;

const paths = {
    styles: {
        src: './dev-files/style.scss',
        dest: './assets/styles/',
        watch: './**/*.scss'
    },
    pug: {
        src: './dev-files/index.pug',
        dest: './',
        watch: './**/*.pug'
    },
    images: {
        src: './dev-files/images/*',
        dest: './assets/images',
        watch: './assets/images/*'
    }
};

function buildStyles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest));
}

function buildHtml() {
    return gulp.src(paths.pug.src)
        .pipe(pug())
        .pipe(gulp.dest(paths.pug.dest));
}

async function processImages() {
    ({ default: imagemin } = await import('gulp-imagemin'));
    gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch(paths.styles.watch).on('change', browserSync.reload);
    gulp.watch(paths.pug.watch).on('change', browserSync.reload);
    gulp.watch(paths.images.watch).on('change', browserSync.reload);

    gulp.watch(paths.styles.watch, buildStyles);
    gulp.watch(paths.pug.watch, buildHtml);

    gulp.watch(paths.images.src, processImages);
}

exports.default = gulp.series(processImages, buildHtml, buildStyles, watch);