let     gulp = require('gulp'),
         del = require('del'),
 runSequence = require('run-sequence'),
          es = require('event-stream'),
      rename = require('gulp-rename'),
        sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  browserify = require('browserify'),
    babelify = require('babelify'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      uglify = require('gulp-uglify'),
      minify = require('gulp-minify-css');

let config = {
    'main_scss': './src-assets/scss/style.scss',
    'source': {
        'scss': './src-assets/scss',
        'css': './src-assets/css',
        'js': './src-assets/js',
        'images': './src-assets/images',
        'fonts': './src-assets/fonts'
    },
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

gulp.task('clean:dev', function () {
    return del(['./dev']);
});

gulp.task('clean:public', function () {
    return del(['./public']);
});

// Clears the dynamically generated directories inside static
gulp.task('clean:static:all', function () {
    return del([config.static.css, config.static.js, config.static.fonts,
                config.static.images]);
});

// Clears static/js
gulp.task('clean:static:js', function () {
    return del([config.static.js + '/**/*']);
});
// Clears static/css
gulp.task('clean:static:css', function () {
    return del([config.static.css + '/**/*']);
});
gulp.task('static:css', function() {
    gulp.src(config.source.css + '/**/*')
            .pipe(gulp.dest(config.static.css));
})

// Compiles Sass to CSS and copies to static/css
gulp.task('build:css:dev', function() {
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

gulp.task('build:css:prod', function() {
    return gulp.src(config.main_scss)
        .pipe(sass())
        .on('error', function(error) { console.log(error); })
        .pipe(autoprefixer())
        .pipe(minify())
        .pipe(rename('style.css'))
        .pipe(gulp.dest(config.static.css));
});

// Builds JS
gulp.task('build:js:dev', function () {
    return es.concat(
        browserify({entries: config.source.js + '/recipelist.js', debug: true})
            .transform("babelify", { presets: ["es2015"] })
            .bundle()
            .pipe(source('recipelist.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.static.js)),
        browserify({entries: config.source.js + '/homepage.js', debug: true})
            .transform("babelify", { presets: ["es2015"] })
            .bundle()
            .pipe(source('homepage.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.static.js)),
        browserify({entries: config.source.js + '/scripts.js', debug: true})
            .transform("babelify", { presets: ["es2015"] })
            .bundle()
            .pipe(source('scripts.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.static.js))
    );
});

gulp.task('build:js:prod', function () {
    return es.concat(
        browserify({entries: config.source.js + '/recipelist.js', debug: true})
            .transform("babelify", { presets: ["es2015"] })
            .bundle()
            .pipe(source('recipelist.js'))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest(config.static.js)),
        browserify({entries: config.source.js + '/homepage.js', debug: true})
            .transform("babelify", { presets: ["es2015"] })
            .bundle()
            .pipe(source('homepage.js'))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest(config.static.js)),
        browserify({entries: config.source.js + '/scripts.js', debug: true})
            .transform("babelify", { presets: ["es2015"] })
            .bundle()
            .pipe(source('scripts.js'))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest(config.static.js))
    );
});

// Copy resources to static
gulp.task('static', function() {
    return es.concat(
        gulp.src(config.source.fonts + '/**/*')
            .pipe(gulp.dest(config.static.fonts)),
        gulp.src(config.source.images + '/**/*')
            .pipe(gulp.dest(config.static.images)),
        gulp.src(config.source.css + '/**/*')
            .pipe(gulp.dest(config.static.css))
    );
});

gulp.task('jswatch', function() {
    gulp.watch(config.source.js + '/**/*', function() {
        runSequence('clean:static:js', 'build:js:dev');
    });
});

gulp.task('csswatch', function() {
    gulp.watch(config.source.scss + '/**/*', function() {
        runSequence('clean:static:css', 'static:css', 'build:css:dev');
    });
});

gulp.task('clean', ['clean:static:all', 'clean:dev', 'clean:public']);

// Production gulp task
gulp.task('prod', function(callback) {
    runSequence('clean',
                'static',
                ['build:css:prod', 'build:js:prod']);
});

// Default gulp task for dev
gulp.task('default', function(callback) {
    runSequence('clean',
                'static',
                ['build:css:dev', 'build:js:dev']);
});

gulp.task('watch', ['csswatch', 'jswatch']);
