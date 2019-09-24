"use strict";

const exec = require('child_process').exec
const path = require('path')
const { watch, parallel } = require('gulp');

function buildJS (cb) {
  exec("cd js; npm run build", function(err, stdout, stderr) {
    console.log(stdout)
    console.error(stderr)
    cb(err)
  })
}
buildJS.description = 'JS filed built'

function watchJS() {
  watch(path.join(__dirname + '/js/src/**/*.js'), buildJS)
}

exports.default = parallel(buildJS, watchJS)

// const gulp = require('gulp')
// const path = require('path')

// gulp.task('build', function() {
//   return function() {
//     console.log('building......')
//   }
//   // return gulp.src(path.join(__dirname + '/js/**/*.js'))
//   //   .pipe(() => console.log('building......'))
// });

// gulp.task('watch', function() {
//   gulp.watch(path.join(__dirname + '/js/**/*.js'), ['build'])
// });

// gulp.task('default', ['build', 'watch']);

