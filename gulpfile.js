/**
 * npm i -D gulp gulp-rev-append gulp-file-include gulp-stylus gulp-autoprefixer gulp-cssnano gulp-browserify gulp-babel babel-core babel-preset-env gulp-jshint gulp-uglify gulp-imagemin gulp-htmlmin gulp-concat gulp-rename gulp-livereload gulp-cached gulp-notify gulp-clean gulp-sourcemaps gulp-plumber
 */

const gulp = require('gulp')
// html
const rev = require('gulp-rev-append')
const fileInclude = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
// css
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')
const stylus = require('gulp-stylus')
// js
const babel = require('gulp-babel')
// const jshint = require('gulp-jshint')
const uglify = require('gulp-uglify')
const browserify = require('gulp-browserify')
// img
const imagemin = require('gulp-imagemin')
// tools
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const livereload = require('gulp-livereload')
const cache = require('gulp-cached')
const notify = require('gulp-notify')
const clean = require('gulp-clean')
const sourcemaps = require('gulp-sourcemaps')
const plumber = require('gulp-plumber')

// stylus
gulp.task('stylus-dev', () => {
    return (
        gulp.src('src/styl/**/*.styl')
        .pipe(cache('stylus-dev'))
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(stylus())
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cssnano())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({
            message: 'stylus-dev task complete'
        }))
        .pipe(livereload())
    )
})
gulp.task('stylus', () => {
    return (
        gulp.src('src/styl/**/*.styl')
        .pipe(cache('stylus'))
        .pipe(stylus())
        .pipe(autoprefixer())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({
            message: 'stylus task complete'
        }))
    )
})

// JS
gulp.task('scripts-dev', () => {
    return (
        gulp.src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        // .pipe(jshint('.jshintrc'))
        // .pipe(jshint.reporter('default'))
        .pipe(plumber())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(browserify({
            insertGlobals: true,
            debug: !gulp.env.production
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({
            message: 'scripts-dev task complete'
        }))
        .pipe(livereload())
    )
})
gulp.task('scripts', () => {
    return (
        gulp.src('src/js/**/*.js')
        // .pipe(jshint('.jshintrc'))
        // .pipe(jshint.reporter('default'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(browserify({
            insertGlobals: true,
            debug: !gulp.env.production
        }))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({
            message: 'scripts task complete'
        }))
    )
})

// img
gulp.task('images-dev', () => {
    return gulp.src('src/images/**/*')
        .pipe(cache('images-dev'))
        .pipe(imagemin({
            optmizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({
            message: 'iamges-dev task complete'
        }))
        .pipe(livereload())
})
gulp.task('images', () => {
    return gulp.src('src/images/**/*')
        .pipe(imagemin({
            optmizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({
            message: 'iamges task complete'
        }))
})

// html
gulp.task('html-dev', () => {
	return gulp.src('src/**.html')
	.pipe(fileInclude())
    .pipe(rev())
    .pipe(gulp.dest('dist/'))
    .pipe(livereload())
})
gulp.task('html', () => {
	return gulp.src('src/**.html')
	.pipe(fileInclude())
    .pipe(rev())
    .pipe(htmlmin({
        // https://github.com/kangax/html-minifier
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(livereload())
})

// 清理
gulp.task('clean', () => {
    cache.caches = {}
    return gulp.src([
            'dist/css',
            'dist/js',
            'dist/images',
            'dist/maps',
            'dist/*.html'
        ], {
            read: false
        })
        .pipe(clean())
})

// build
gulp.task('build', ['clean'], () => {
	gulp.start('build-production')
})

gulp.task('build-production', ['stylus', 'scripts', 'images'], () => {
    gulp.env.production = true
	gulp.start('html')
})

// build-dev
gulp.task('build-dev', ['stylus-dev', 'scripts-dev', 'images-dev'], () => {
	gulp.start('html-dev')
})

// 预设任务
gulp.task('default', ['clean'], () => {
    gulp.start('build-dev')
})

// 看守
gulp.task('watch', () => {
    livereload.listen()

    gulp.watch('src/**.html', ['html-dev'])
    gulp.watch('src/styl/**/*.styl', ['stylus-dev'])
    gulp.watch('src/js/**/*.js', ['scripts-dev'])
    gulp.watch('src/images/**/*', ['images-dev'])
})
