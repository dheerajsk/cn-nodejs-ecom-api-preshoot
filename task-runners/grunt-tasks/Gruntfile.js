module.exports = function(grunt) {
    grunt.initConfig({
      cssminz: {
        target: {
          files: [{
            expand: true,
            cwd: 'src/css',
            src: ['*.css', '!*.min.css'],
            dest: 'dist/css',
            ext: '.min.css'
          }]
        }
      },
      uglify: {
        target: {
          files: {
            'dist/js/main.min.js': ['src/js/*.js']
          }
        }
      }
    });
  
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
  
    grunt.registerTask('default', ['cssmin', 'uglify']);
  };
  