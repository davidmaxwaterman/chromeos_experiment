module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadTasks('tools/grunt-tasks');

  grunt.initConfig({
    packageInfo: grunt.file.readJSON('package.json'),
    chromeInfo: grunt.file.readJSON('platforms/chrome-crx/manifest.json'),

    clean: ['build'],

    release: {
      options: {
        npm: false,
        npmtag: false,
        tagName: 'v<%= version %>'
      }
    },

    // minify JS
    uglify: {
      dist: {
        files: [
          { expand: true, cwd: '.', src: 'app/js/**/*.js', dest: 'build/' }
        ]
      }
    },

    // minify CSS
    cssmin: {
      dist: {
        files: [
          { expand: true, cwd: '.', src: ['app/css/**/*.css'], dest: 'build/' }
        ]
      }
    },

    copy: {
      common: {
        files: [
          { expand: true, cwd: '.', src: ['app/lib/**'], dest: 'build/' },
          { expand: true, cwd: '.', src: ['app/audio/**'], dest: 'build/' },
          { expand: true, cwd: '.', src: ['app/data/**'], dest: 'build/' },
          { expand: true, cwd: '.', src: ['LICENSE'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['app/README.txt'], dest: 'build/' },
          { expand: true, cwd: '.', src: ['app/_locales/**'], dest: 'build/' }
        ]
      },

      crx: {
        files: [
          { expand: true, cwd: 'build/app/', src: ['**'], dest: 'build/crx/' },
          { expand: true, cwd: '.', src: ['icon*.png'], dest: 'build/crx/' }
        ]
      },

      crx_unpacked: {
        files: [
          { expand: true, cwd: 'build/app/', src: ['**'], dest: 'build/crx/' },
          { expand: true, cwd: 'app/', src: ['js/**'], dest: 'build/crx/' },
          { expand: true, cwd: 'app/', src: ['css/**'], dest: 'build/crx/' },
          { expand: true, cwd: 'app/', src: ['*.html'], dest: 'build/crx/' },
          { expand: true, cwd: '.', src: ['icon*.png'], dest: 'build/crx/' }
        ]
      },

      crx_manifest:
      {
        files: [
          { expand: true, cwd: 'platforms/chrome-crx/', src: ['manifest.json'], dest: 'build/crx/' }
        ],

        options:
        {
          processContent: function(content, srcpath)
          {
            return grunt.template.process(content);
          }
        }

      },

    },

    htmlmin: {
      dist: {
        files: [
          { expand: true, cwd: '.', src: ['app/*.html'], dest: 'build/' },
          { expand: true, cwd: '.', src: ['app/html/*.html'], dest: 'build/' }
        ],
        options: {
          removeComments: true,
          collapseWhitespace: true,
          removeCommentsFromCDATA: false,
          removeCDATASectionsFromCDATA: false,
          removeEmptyAttributes: true,
          removeEmptyElements: false
        }
      }
    },

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3,
          progressive: true
        },
        files: [
          { expand: true, cwd: '.', src: ['app/images/**'], dest: 'build/' },
          { expand: true, cwd: '.', src: ['app/css/images/**'], dest: 'build/' }
        ]
      }
    },

    package: {
      'crx_zip': {
        appName: '<%= packageInfo.name %>-crx',
        version: '<%= packageInfo.version %>',
        files: 'build/crx/**',
        stripPrefix: 'build/crx/',
        outDir: 'build',
        suffix: '.zip'
      }
    },

  });

  grunt.registerTask('dist', [
    'clean',
    'imagemin:dist',
    'uglify:dist',
    'cssmin:dist',
    'htmlmin:dist',
    'copy:common'
  ]);

  grunt.registerTask('crx', ['dist', 'copy:crx', 'copy:crx_manifest']);
  grunt.registerTask('crx_unpacked', [
    'clean',
    'imagemin:dist',
    'copy:common',
    'copy:crx_unpacked',
    'copy:crx_manifest',
    'package:crx_zip'
  ]);
};
