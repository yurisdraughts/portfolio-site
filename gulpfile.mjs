import path from "node:path";
import browserSync from "browser-sync";
import { deleteSync } from "del";
import { lastModified } from "glob-last-modified";
import gulp from "gulp";
import cleanCss from "gulp-clean-css";
import debug from "gulp-debug";
import ignore from "gulp-ignore";
import imagemin from "gulp-imagemin";
import newer from "gulp-newer";
import pug from "gulp-pug";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import sourcemaps from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import some from "gulp-some";

const { src, dest, watch, series } = gulp;
const sass = gulpSass(dartSass);
const browserSyncInstance = browserSync.create();

const globs = {
  pug: {
    src: "./dev-files/**/*.pug",
    main: "index.pug",
    dest: "./",
    compiled: "./index.html",
  },
  sass: {
    src: "./dev-files/**/*.scss",
    dest: "./assets/styles/",
    compiled: "./assets/styles/style.css",
  },
  javascript: {
    src: "./dev-files/scripts/**/*.js",
    dest: "./assets/scripts/",
    compiled: "./assets/scripts/**/*.js",
  },
  images: {
    src: "./dev-files/images/*",
    dest: "./assets/images/",
  },
  css: {
    src: "./dev-files/**/*.css",
    dest: "./assets/styles/",
  },
};

function compilePug() {
  return src(globs.pug.src)
    .pipe(
      some((file) => {
        return file.stat.mtimeMs > lastModified(globs.pug.compiled);
      })
    )
    .pipe(ignore.include(globs.pug.main))
    .pipe(pug())
    .pipe(dest(globs.pug.dest));
}

function compileSass() {
  return src(globs.sass.src)
    .pipe(
      some((file) => {
        return file.stat.mtimeMs > lastModified(globs.sass.compiled);
      })
    )
    // .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    // .pipe(sourcemaps.write())
    .pipe(dest(globs.sass.dest));
}

function minifyJs() {
  return src(globs.javascript.src)
    .pipe(
      some((file) => {
        return file.stat.mtimeMs > lastModified(globs.javascript.compiled);
      })
    )
    .pipe(uglify())
    .pipe(dest(globs.javascript.dest));
}

function minifyImages() {
  return src(globs.images.src)
    .pipe(newer(globs.images.dest))
    .pipe(imagemin())
    .pipe(dest(globs.images.dest));
}

function minifyCss() {
  return src(globs.css.src)
    .pipe(newer(globs.css.dest))
    .pipe(cleanCss())
    .pipe(dest(globs.css.dest));
}

async function startWatchers() {
  watch(globs.sass.src, compileSass);
  watch(globs.pug.src, compilePug);
  watch(globs.images.src, minifyImages).on("unlink", function (glob) {
    deleteSync(`${globs.images.dest}${path.basename(glob)}`);
  });
}

async function startServer() {
  browserSyncInstance.init({ server: "./" });

  browserSyncInstance
    .watch([globs.sass.src, globs.pug.src, globs.images.src])
    .on("change", browserSyncInstance.reload);
}

export default series(
  minifyImages,
  minifyCss,
  compilePug,
  compileSass,
  minifyJs,
  startServer,
  startWatchers
);
