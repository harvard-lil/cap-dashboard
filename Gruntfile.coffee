watch_src      = [
  'public/app/**/*.coffee',
  'bower_components/ngDraggable/ngDraggable.js'
]
module.exports = (grunt) ->
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    coffee:
      compile:
        files:
          'public/js/app.js': 'app/web/src/**/*.coffee'
        options: {
          livereload: true,
        }
    watch:
      coffeescript:
        files: 'app/**/*.coffee'
        tasks: ["newer:coffee"]
      compile:
        files: 'app/web/src/**/*.coffee'
        tasks: ["newer:coffee", "concat"]
    concat:
      options:
        separator: ';'

      dist:
        src: ['public/vendor/*.js'],
        dest: 'public/app/app-vendor.js'
      # dist:
      #   src: ['public/vendor/*.css'],
      #   dest: 'public/app/app-vendor.css'
  })

  #Load Tasks
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-newer'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'compile', ['coffee']
  grunt.registerTask 'default', ['coffee', 'concat', 'watch']
