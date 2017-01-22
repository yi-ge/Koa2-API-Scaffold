const gulp = require('gulp')
const eslint = require('gulp-eslint')
const nodemon = require('gulp-nodemon')
const friendlyFormatter = require('eslint-friendly-formatter')

var jsScript = 'node'
if (process.env.npm_config_argv.indexOf('debug') > 0) {
  jsScript = 'node debug'
}

gulp.task('lint', () => {
  return gulp.src(['src/*.js', '!node_modules/**'])
    .pipe(eslint({configFile: '.eslintrc.js'}))
    .pipe(eslint.format(friendlyFormatter))
    // .pipe(eslint.failAfterError())
    .pipe(eslint.results(results => {
      // Called once for all ESLint results.
      console.log(`- Total Results: ${results.length}`)
      console.log(`- Total Warnings: ${results.warningCount}`)
      console.log(`- Total Errors: ${results.errorCount}`)
    }))
})

gulp.task('eslint_start', ['lint'], function () {
  var stream = nodemon({
    script: 'build/dev-server.js',
    execMap: {
      js: jsScript
    },
    tasks: ['lint'],
    verbose: true,
    ignore: ['build/*.js', 'dist/*.js', 'nodemon.json', '.git', 'node_modules/**/node_modules', 'gulpfile.js'],
    env: {
      NODE_ENV: 'development'
    },
    ext: 'js json'
  })

  return stream
    .on('restart', function () {
      // console.log('Application has restarted!')
    })
    .on('crash', function () {
      console.error('Application has crashed!\n')
      // stream.emit('restart', 20)  // restart the server in 20 seconds
    })
})

gulp.task('start', function () {
  return nodemon({
    script: 'build/dev-server.js',
    execMap: {
      js: jsScript
    },
    verbose: true,
    ignore: ['build/*.js', 'dist/*.js', 'nodemon.json', '.git', 'node_modules/**/node_modules', 'gulpfile.js'],
    env: {
      NODE_ENV: 'development'
    },
    ext: 'js json'
  })
})

gulp.task('default', ['lint', 'eslint_start'], function () {
  // console.log('ESlin检查完成')
})
