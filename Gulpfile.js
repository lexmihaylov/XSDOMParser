const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const spawn = require("child_process").spawn;

const bundle = (mode) => {
    let bundle = browserify('./index.js', {
            debug: true
        })
        .transform(babelify, {
            presets: ['es2015'],
            sourceMaps: true
        })
        .bundle()
        .pipe(source(`xsdomparser${mode == 'debug'? '.debug': ''}.js`))
        .pipe(buffer());

    if (mode == 'debug') {
        bundle.pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write());
    } else {
        bundle.pipe(uglify({
            compress: {
                unused: true,
                dead_code: true
            }
        }));
    }

    bundle.pipe(gulp.dest('./'));

    return bundle;
};

gulp.task('default', () => {
    bundle();
});

gulp.task('debug', () => {
    bundle('debug');
});

gulp.task('test', (cb) => {
    let test = spawn('nyc',['mocha']);
    
    test.stdout.pipe(process.stdout);
    
    test.stderr.pipe(process.stderr);
    
    test.on('exit', cb);
});