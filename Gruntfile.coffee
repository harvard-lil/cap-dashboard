watch_src      = [
  'public/app/**/*.coffee',
  'bower_components/ngDraggable/ngDraggable.js'
]
module.exports = (grunt) ->
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    coffee:
      coffee_to_js:
        options:
          bare: true
          sourceMap: false
        expand: true
        flatten: false
        cwd: "public"
        src: ["*.coffee"]
        dest: 'public'
        ext: ".js"
    watch:
      coffeescript:
        files: 'public/*.coffee'
        tasks: ["newer:coffee"]
      compile:
        files: watch_src
        tasks: ["newer:coffee", "concat"]
    concat:
      options:
        separator: ';'

      dist:
        src: ['bower_components/ngDraggable/ngDraggable.js'],
        dest: 'public/app/app-vendor.js'
  })

  #Load Tasks
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-newer'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'compile', ['coffee']
  grunt.registerTask 'default', ['coffee', 'concat', 'watch']
