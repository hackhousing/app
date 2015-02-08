'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({
    clean: {
      src: ['build/']
    },
    copy: {
      dev: {
        files: [
          {expand: true, src: ['**/*.html', 'css/**/*.css'], dest: 'build/'},

          {cwd: 'bower_components/bootstrap/dist/css', expand: true, src: ['bootstrap.min.css'], dest: 'build/css'}
        ]
      }
    },
    browserify: {
      dev: {
        src: ['js/**/*.js'],
        dest: 'build/client-bundle.js',
        options: {
          transform: ['debowerify']
        }
      }
    },
    jshint: {
      all: ['./server.js', './lib/**/*.js', './routes/**/*.js', './models/**/*.js'],
      options: {
        jshintrc: true
      }
    },
    jscs: {
      src: ['./server.js', './lib/**/*.js', './routes/**/*.js', './models/**/*.js'],
      options: {
        config: '.jscsrc'
      }
    },
    simplemocha: {
      src: ['./tests/**/*.js']
    }
  });

  grunt.registerTask('test', ['jshint', 'jscs', 'simplemocha']);
  grunt.registerTask('build', ['clean', 'copy', 'browserify:dev']);
  grunt.registerTask('default', ['build']);
};
