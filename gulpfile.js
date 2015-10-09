var gulp = require("gulp"),                     // The streaming build system
    gulpif = require('gulp-if'),                // IF ...
    sass = require('gulp-ruby-sass'),           // Compiles Sass with the Sass gem and pipes the results into a gulp stream.
    compass = require("gulp-compass"),          // Compile Sass to CSS with Compass
    plumber = require('gulp-plumber'),          // Fixing issue with Node Streams piping.
    clean = require('gulp-clean'),              // Clean the space and remove everything that's in the way.
    concat = require('gulp-concat'),            // Concat JS together into one file
    iconfont = require('gulp-iconfont'),        // Create SVG/TTF/EOT/WOFF/WOFF2 fonts from several SVG icons.
    runTimestamp = Math.round(Date.now()/1000), // Param for iconfont.
    consolidate = require('gulp-consolidate'),  // Write iconFont scss
    iconfontCss = require('gulp-iconfont-css'), // Write iconFont css
    svgSprite = require("gulp-svg-sprite"),    // Create SVG sprites with PNG fallbacks
    sprity = require('sprity'),                 // Task for creating image sprites and the corresponding stylesheets.
    minifyCSS = require('gulp-minify-css'),     // Plugin to minify CSS.
    jshint = require('gulp-jshint'),            // Helps to detect errors and potential problems in code.
    stylish = require('jshint-stylish'),        // Stylish reporter for JSHint.
    uglify = require('gulp-uglify'),            // Minify files with UglifyJS.
    imagemin = require('gulp-imagemin'),        // Minify PNG, JPEG, GIF and SVG images.
    rename = require('gulp-rename'),            // Rename files,
    help = require("gulp-task-listing"),        // Adds the ability to provide a task listing for your gulpfile
    notify = require('gulp-notify'),            // Plugin to send messages based on Vinyl Files or Errors to MacOSX, Linux, Windows using 'node-notifier'.
    cache = require('gulp-cache'),              // A temp file based caching proxy task for gulp.
    livereload = require('gulp-livereload'),    // plugin for livereload to be used with the livereload chrome extension or a livereload middleware.
    del = require('del');                       // It also protects you against deleting the current working directory and above.


/**
 *   Error Handler parameter by Plumber
 */

var errorParameter = {

    "errorHandler": notify.onError({
        "title": "Gulp error",
        "message": "<%=error.message %>",
        sound:    "Bottle"
    })

};

/**
 *   Import configuration
 */

var config = require('./config.json');

/**
 *   Help task
 */

gulp.task('help', help);

/**
 *   Task process
 */

gulp.task('process--styles', function() {
    return gulp.src( config.path.root + config.path.src.styles + config.files.name + '*.scss')
        .pipe(plumber(errorParameter))
        .pipe(compass({
                css: config.path.root + 'assets/css',
                sass: config.path.root + 'source/sass'
            }))
        .pipe(gulp.dest(config.path.root + config.path.dest.styles))
        .pipe(notify({ message: 'Styles' + config.notify.template }))
        .pipe(rename({suffix: config.files.suffix}))
        .pipe(minifyCSS())
        .pipe(gulp.dest(config.path.root + config.path.dest.styles))
        .pipe(notify({ message: 'Styles' + config.notify.template }));
});

gulp.task('process--js', function() {
    gulp.src([config.path.root + config.path.src.js + 'class/*.js', config.path.root + config.path.src.js + config.files.name + '.js'])
        .pipe(plumber(errorParameter))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish)),
    gulp.src(config.scripts.src)
            .pipe(plumber(errorParameter))
            .pipe(concat(config.files.name + '.js'))
            .pipe(gulp.dest(config.path.root + config.path.dest.js))
            .pipe(notify({ message: 'Scripts' + config.notify.template }))
            .pipe(rename({suffix: config.files.suffix}))
            .pipe(uglify())
            .pipe(gulp.dest(config.path.root + config.path.dest.js))
            .pipe(notify({ message: 'Scripts' + config.notify.template }));
});

gulp.task('process--img', function() {
    // All images
    gulp.src(config.path.root + config.path.src.img + '*')
        .pipe(plumber(errorParameter))
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(config.path.root + config.path.dest.img))
        .pipe(notify({ message: 'Images' + config.notify.template }));
    // SVG sprites
    /*gulp.src(config.path.root + config.path.src.svg + '*.svg')
        .pipe(svgSprite({
            cssFile: '../../' + config.path.src.styles + 'var/_svgSprites.scss'
        }))
        .pipe(gulp.dest(config.path.root + config.path.dest.img))
        .pipe(notify({ message: 'Images' + config.notify.template }));
    // Images sprites*/
/*    sprity.src({
        src: config.path.root + config.path.src.img + 'sprites*//*.{png,jpg}',
        style: config.path.root + config.path.src.styles + 'var/',
        processor: 'sass' // make sure you have installed sprity-sass
        })
        .pipe(gulpif('*.png', gulp.dest(config.path.root + config.path.dest.img + 'sprites/'), gulp.dest(config.path.root + config.path.src.styles + 'var/')))*/
});


/*gulp.task('process--icons', function(){
    gulp.src([config.path.root + config.path.src.icon + '*.svg'], {base: 'library/source'})
        .pipe(iconfontCss({
            fontName: 'myIconfont',
            targetPath: '../../' + config.path.src.styles + 'var/_icons.scss',
            fontPath: '../font/'
        }))
        .pipe(iconfont({
            fontName: 'myIconfont', // required
            appendUnicode: true, // recommended option
            formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
            timestamp: runTimestamp // recommended to get consistent builds when watching files
        }))
        .on('glyphs', function(glyphs, options) {
            var options = {
                glyphs: glyphs.map(function(glyph) {
                    // this line is needed because gulp-iconfont has changed the api from 2.0
                    return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
                }),
                fontName: 'myIconfont',
                fontPath: '../fonts/', // set path to font (from your CSS file if relative)
                className: 's' // set class name in your CSS
            };

            // Reload styles process to add de _icons.scss file
            gulp.start('process--styles');
        })
        .pipe(gulp.dest(config.path.root + config.path.dest.font));

});*/

/**
 *   Task clean
 */

gulp.task('clean', function() {
    del([config.path.root + config.path.dest.styles + '*', config.path.root + config.path.dest.js + '*', config.path.root + config.path.dest.img + '*']);
});

gulp.task('clean--styles', function() {
    del(config.path.root + config.path.dest.styles + '*');
});

gulp.task('clean--js', function() {
    del(config.path.root + config.path.dest.js + '*');
});

gulp.task('clean--img', function() {
    del(config.path.root + config.path.dest.img + '*');
});

/**
 *   Task build
 */

gulp.task('build', ['clean'], function() {
    gulp.start('process--styles', 'process--js', 'process--img');
});

gulp.task('build--styles', ['clean--styles'], function() {
    gulp.start('process--styles');
});

gulp.task('build--js', ['clean--js'], function() {
    gulp.start('process--js');
});

gulp.task('build--img', ['clean--img'], function() {
    gulp.start('process--img');
});



/**
 *   Task watch
 */

gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch(config.path.root + config.path.src.styles + '**/**/*.scss', ['process--styles']);

    // Watch .js files
    gulp.watch(config.path.root + config.path.src.js + '**/*.js', ['process--js']);

    // Watch image files
    gulp.watch(config.path.root + config.path.src.img + '*', ['process--img']);

    /*// Watch icons files
    gulp.watch(config.path.root + config.path.dest.font + '*', ['process--icons', 'process--styles']);*/

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    // View http://feedback.livereload.com/knowledgebase/articles/86180-how-do-i-add-the-script-tag-manually- to Livereload
    // !! Remove before flyght
    gulp.watch([config.path.root +'assets/**']).on('change', livereload.changed);
});

gulp.task('watch--styles', function() {
    // Watch .scss files
    gulp.watch(config.path.root + config.path.src.styles + '**/**/*.scss', ['process---styles']);
});

gulp.task('watch--js', function() {
    // Watch .js files
    gulp.watch(config.path.root + config.path.src.js + '**/*.js', ['process--js']);
});