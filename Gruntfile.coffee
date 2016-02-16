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
          'public/js/src/src-app.js': ['app/web/src/**/*.coffee']

    watch:
      coffeescript:
        files: 'app/web/**/*.coffee'
        tasks: ["newer:coffee"]
        options: { livereload: true }

      stylus:
        files: ['app/web/styles/*.styl'],
        tasks: ['stylus:compile']
        options: { livereload: true }

      jade:
        files: ['app/web/templates/*.tpl.jade'],
        tasks: ['html2js:main']
        options: { livereload: true }

      compile:
        files: ['app/web/src/**/*.coffee', 'app/web/templates/*.tpl.jade']
        tasks: ["newer:coffee", "concat", "html2js"]

      options:
        livereload: true

    html2js:
      options:
        jade:
          doctype: 'html'
      main:
        options:
          base: 'app/web/src/templates'
        src: ['app/web/templates/*.tpl.jade']
        dest: 'public/js/src/templates.js'

    concat:
      options:
        separator: ';'

      vendor:
        src: [
           'node_modules/underscore/underscore-min.js',
           'node_modules/jquery/dist/jquery.min.js',
           'node_modules/angular/angular.min.js',
           'node_modules/bootstrap/dist/js/bootstrap.min.js',
           'node_modules/angular-ui-router/release/angular-ui-router.min.js',
           'node_modules/d3/d3.min.js',
           'node_modules/nvd3/build/nv.d3.js'
           ]
        dest:'public/vendor/js/app-vendor.js'
      css:
        src: [
          'node_modules/nvd3/build/nv.d3.css'
          'node_modules/bootstrap/dist/css/bootstrap.min.css'
        ]
        dest: 'public/vendor/css/app-vendor.css'

      js:
        src:  ['public/js/src/src-app.js', 'public/js/src/templates.js']
        dest: 'public/js/app.js'

    stylus:
      compile:
        options:
          use: [ 'nib', ()  -> return require('autoprefixer-stylus')('last 2 versions', 'ie 8') ]
          linenos: true
        files:
          'public/css/styles.css': 'app/web/styles/*.styl'


  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-newer'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-autoprefixer'
  grunt.loadNpmTasks 'grunt-html2js'

  grunt.registerTask 'vendor', ['concat:vendor']
  grunt.registerTask 'css', ['concat:css']
  grunt.registerTask 'compile', ['coffee']
  grunt.registerTask 'html', ['html2js']
  grunt.registerTask 'default', ['coffee', 'html2js', 'stylus', 'concat', 'watch']
