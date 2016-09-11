var gulp = require('gulp'),
		source = require('vinyl-source-stream'),
		transform = require('vinyl-transform'),
		babelify = require('babelify'),
		browserify = require('browserify'),
		stylus = require('gulp-stylus'),
		autoprefixer = require('autoprefixer-stylus'),
		sourcemaps = require('gulp-sourcemaps'),
		browserSync = require('browser-sync').create();


//////////////////////////////
// Copy Index
//////////////////////////////

gulp.task('copy:index', function() {
	gulp.src('./src/index.html')
		.pipe(gulp.dest('./build-gulp'));
});


//////////////////////////////
// Scripts Tasks
//////////////////////////////

var browserifyOpts = {
	entries: ['./src/main.js'],
	extensions: ['.js'],
	debug: true
};

// npm run build:js
gulp.task('build:js', function () {
	browserify(browserifyOpts)
		.transform(babelify, { presets: ['es2015', 'react'] })
		.bundle()
		.pipe(source('build.js'))
		.pipe(gulp.dest('./build-gulp'))
		.pipe(browserSync.stream());
});


//////////////////////////////
// Styles Tasks
//////////////////////////////

// npm run dev:styles
gulp.task('dev:styles', function(){
	return gulp.src('./src/assets/main.styl')
		.pipe(sourcemaps.init())
		.pipe(stylus({
			paths:  ['node_modules'],
			import: ['rupture/rupture'],
			use: [autoprefixer()],
			compress: false,
			'include css': true
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build-gulp'))
		.pipe(browserSync.stream());
});

// npm run build:styles
gulp.task('build:styles', function(){
	return gulp.src('./src/assets/main.styl')
		.pipe(sourcemaps.init())
		.pipe(stylus({
			paths:  ['node_modules'],
			import: ['rupture/rupture'],
			use: [autoprefixer()],
			compress: true,
			'include css': true
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build-gulp'))
		.pipe(browserSync.stream());
});


//////////////////////////////
// Watch Tasks
//////////////////////////////

// npm run dev
gulp.task('watch', function () {
	gulp.watch('./src/*.js', ['build:js']);
	gulp.watch('./src/assets/*.styl', ['dev:styles']);
	gulp.watch('./src/build-gulp/*.html').on('change', browserSync.reload);
});


//////////////////////////////
// BrowserSync Task
//////////////////////////////

// npm run serve
gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: "./build-gulp"
		}
	});
});


//////////////////////////////
// Main Tasks
//////////////////////////////
gulp.task('dev', ['copy:index', 'build:js', 'dev:styles', 'watch', 'browser-sync']);
gulp.task('prod', ['copy:index', 'build:js', 'dev:styles', 'browser-sync']);
