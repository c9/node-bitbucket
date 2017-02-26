var gulp = require('gulp');
var watch = require('gulp-watch');
var shell = require('gulp-shell')


var paths = {
	'src':['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json']

};



gulp.task('runKeystone', shell.task('node keystone.js'));
gulp.task('watch', [

]);

gulp.task('default', ['watch', 'runKeystone']);
