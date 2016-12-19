var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var uncss = require('gulp-uncss');


gulp.task('sass', function() {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('src/styles'))
		.pipe(browserSync.stream());
});
 
gulp.task('browserSync', function() {
	browserSync.init({
		server: "./src"
	})
});

gulp.task('watch', function() {
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch(['src/*.html', 'src/js/**/*.js'], [browserSync.reload]);
});

gulp.task('useref', function() {
	return gulp.src('src/*.html')
	.pipe(useref())
	.pipe(gulpIf('*.js', uglify()))
	.pipe(gulpIf('*.css', cssnano()))
	.pipe(gulpIf('*.css', uncss({html : 'src/*.html'})))
	.pipe(gulpIf('*.css', autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        })))
	.pipe(gulp.dest('./dist'));
});

gulp.task('images', function() {
	return gulp.src('src/images//**/*.+(png|jpg|gif|svg|JPG)')
	.pipe(cache(imagemin({interlaced : true})))
	.pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
	return gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));
})

gulp.task('clean:dist', function() {
	console.log('Brisanje mape "dist"...');
	return del.sync('dist');
});

gulp.task('build', function() {
	runSequence('clean:dist', 'sass', 'useref', ['fonts', 'images']);
});

gulp.task('default', function() {
	runSequence('sass', 'browserSync', 'watch');
});