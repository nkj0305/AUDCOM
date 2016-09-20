/* Gulp File for autmated task runner */
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var exec = require('child_process').exec;


gulp.task('testgulp',function(){
   console.log("gulp file execution started"); 
});


/* Static Analysis */

gulp.task('jsLint', function () {
    gulp.src(['client/js/*.js','!client/js/*min.js','routes/*.js','server.js']) // path to your files
    .pipe(jshint())
    .pipe(jshint.reporter(stylish)); // Dump results
});


gulp.task('pre-test', function () {

    return gulp.src(['./routes/**/*.js','./config.js'])
    // Covering files

        .pipe(istanbul(
            {includeUntested: false}
        ))
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
    return gulp.src(['tests/backend.api.spec.js'])
        .pipe(mocha({
            reporter: 'spec',
            waitforTimeout: 15000,
            
        }))
        // Creating the reports after tests ran
        .pipe(istanbul.writeReports({
            dir: './unit-test-coverage',
            reporters: ['html'],
            reportOpts: {dir: './unit-test-coverage'}
        }))
        .pipe(istanbul.enforceThresholds({thresholds: {global: 30}}));
});

// start server 

gulp.task('server', function (cb) {
  exec('nodemon server.js > nodeserver.log', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
  exec('/usr/bin/mongod --smallfiles > mongodb.log', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

// seperate task for starting db application
gulp.task('dbserver', function (cb) {
  exec('/usr/bin/mongod --smallfiles', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});
// default task 
gulp.task('default',['server']);