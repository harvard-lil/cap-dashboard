watch_src      = [
  'public/app/**/*.coffee',
  'bower_components/ngDraggable/ngDraggable.js'
]
module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffee:
      compile:
        files:
          'public/js/app.js': 'app/web/src/**/*.coffee'

    watch:
      coffeescript:
        files: 'app/web/**/*.coffee'
        tasks: ["newer:coffee"]
        options: { livereload: true }

      stylus:
        files: ['app/web/styles/*.styl'],
        tasks: ['stylus:compile']
        options: { livereload: true }

      compile:
        files: 'app/web/src/**/*.coffee'
        tasks: ["newer:coffee", "concat"]
      options:
        livereload: true

    concat:
      options:
        separator: ';'

      dist:
        src: ['public/vendor/src/*.js'],
        dest: 'public/vendor/js/app-vendor.js'

    stylus:
      compile:
        options:
          use: [ 'nib', ()  -> return require('autoprefixer-stylus')('last 2 versions', 'ie 8') ]
          linenos: true
        files:
          'public/css/styles.css': 'app/web/styles/*.styl'



  #Load Tasks
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-newer'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-autoprefixer'

  grunt.registerTask 'compile', ['coffee']
  grunt.registerTask 'default', ['coffee', 'stylus', 'concat', 'watch']
