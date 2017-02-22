var     gulp = require('gulp'),
         del = require('del'),
 runSequence = require('run-sequence'),
          es = require('event-stream'),
      rename = require('gulp-rename'),
        sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps');

var config = {
    'fontawesome_fonts': './node_modules/font-awesome-sass/assets/fonts/font-awesome',
    'fontawesome_sass': './node_modules/font-awesome-sass/assets/stylesheets',
    'foundation_sass': './node_modules/foundation-sites/scss',
    'main_scss': './src-assets/scss/style.scss',
    'f_modules_used': './src-assets/scss/partials/_recipesfoundation.scss',
    'static': {
        'css': './static/assets/css',
        'js': './static/assets/js',
        'images': './static/assets/images',
        'fonts': './static/assets/fonts'
    }
};

gulp.copy=function(src,dest, base){
    if (base === undefined) { base = '.'; }
    return gulp.src(src, {base: base})
        .pipe(gulp.dest(dest));
};


// Clears the dynamically generated directories inside static
gulp.task('clean:static:all', function () {
  return del([
    './static/assets/css',
    './static/assets/js',
    './static/assets/fonts',
    './static/assets/images'
  ]);
});

gulp.task('clean:dev', function () {
  return del([
    './dev'
  ]);
});

// Clears static/js
gulp.task('clean:static:js', function () {
  return del([
    './static/js/**/*'
  ]);
});
// Clears static/css
gulp.task('clean:static:css', function () {
  return del([
    './static/css/**/*'
  ]);
});

// Compiles Sass to CSS and copies to static/css
gulp.task('getstyles', function() {
    return gulp.src(config.main_scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', function(error) { console.log(error); })
        .pipe(sourcemaps.write({includeContent: false}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer())
        .pipe(rename('style.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.static.css));
});

gulp.task('static', function() {
    return es.concat(
        gulp.src('./src-assets/fonts/**/*')
            .pipe(gulp.dest(config.static.fonts)),
        gulp.src('./src-assets/images/**/*')
            .pipe(gulp.dest(config.static.images)),
        gulp.src('./src-assets/js/**/*')
            .pipe(gulp.dest(config.static.js)),
        gulp.src('./src-assets/css/**/*')
            .pipe(gulp.dest(config.static.css))
    );
});



// Default gulp task for dev
gulp.task('default', function(callback) {
    runSequence(['clean:static:all', 'clean:dev'],
                'static',
                'getstyles');
});
