var gulp = require('gulp');
var Server = require('karma').Server;
var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
  replaceString: /\bgulp[\-.]/
});

var dest = 'dist/';

gulp.task('css', function () {
  return gulp.src(plugins.mainBowerFiles())
   .pipe(plugins.filter('*.less'))
   .pipe(plugins.less())
   .pipe(gulp.dest(dest + 'css'))
   .pipe(plugins.cssmin())
   .pipe(plugins.rename({ suffix: '.min' }))
   .pipe(gulp.dest(dest + 'css'));
});

gulp.task('scripts', function () {
  return gulp.src(plugins.mainBowerFiles())
   .pipe(plugins.filter('*.js'))
   .pipe(gulp.dest(dest + 'js'))
   .pipe(plugins.uglify())
   .pipe(plugins.rename({ suffix: '.min' }))
   .pipe(gulp.dest(dest + 'js'));
});

gulp.task('test', function(done){
  new Server({
    configFile: __dirname + '/karma.conf.js',
	singleRun: true 
  }, function(exiCode) {
    done();
  }).start();
});

gulp.task('watch', function() {
  gulp.watch('src/*.css', ['css']);
  gulp.watch('src/*.js', ['scripts']);
  gulp.watch('test/*.js', ['tests']);
});

gulp.task('default', ['css', 'scripts', 'test']);