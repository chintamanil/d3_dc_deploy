'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadNpmTasks('grunt-awsebtdeploy');

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    yeomanConfig.app = require('./component.json').appPath || yeomanConfig.app;
  } catch (e) {
  }

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      haml: {
        files: ['<%= yeoman.app %>/views/{,*/}*.haml'],
        tasks: ['haml:dist']
      },
      awsebtdeploy: {
        demo: {
          options: {
            region: 'eu-west-1',
            applicationName: 'orbital-d3-dc',
            environmentCNAME: 'ec2-52-8-49-234.us-west-1.compute.amazonaws.com',
           // sourceBundle: "path/to/source/bundle.zip"
            // or via the AWS_ACCESS_KEY_ID environment variable
            //accessKeyId: "your access ID",
            // or via the AWS_SECRET_ACCESS_KEY environment variable
            secretAccessKey: "MIIEpAIBAAKCAQEAhyVhpypYNZvqr3N255oIlrDcEikN9uj4/v2J4dGHyZtxSHnAE+CWFq5Y/uZHkgCsgqSf8v2QT57HoaxX9OLiPR9Ih3hN3hZU/OGgOTzvI6fKCItJ8fwtk9hiYciEjizfJnT6yFViqq1mdGb/OpdYda0YyEyVtUrE5RaGpD/77MfmJ76/gDZmOP3TZZWW5d1AoGyKSsL5I7Gh0NgGsECpq0ne6DNAY9XomoIpSRCEqizGEYu8f17xiMdiOfiznatGwWHHehF07I09N6JS9SH8GNBBUYubGXB/JMdMtwQ68OtCeef4qHiUvNrammMYff/kvrtMbl6Q6oLdsgiDhSO7uQIDAQABAoIBAF5v/ME3kdREU8auxNQqiv3iMKZwEdYMDpMA0K0AIgb7nDms+k/pjHfk9UOJ31FjLylLqInALmu05INRT1VMhhN4HNKtepxKtrDPaYsVzXX49fDqhI2YTrEVcAoseJRxPq486FG9eOkTqpiEsK1cvO/eOYceHS9GRDhheUyleYGHVHZKYBOdEtlAjDY4IyIsvaUZG8mVV2VtMEkWoXr2BdtDlEZ2pSCzv7STfuGCbXByoOVeqC7bSKjB5W+NsWrDh/qUVf1yYpZaNcBF/qppXXF08jwU5AHzsdI3MnDRb62xJ5f+O+KMQ0zwwn/wrdcoZnrth/g44ThPIdwlKg1V81ECgYEA5vmO7zChMugvc+xSLaqYBNBhI0UFVENwePZBxH1Dmaw/hKisqgkmsTRB3KCIty3OD6/I9vvuYZJZ/AG9uRNmNCcshChvDZmkO4OSb0Ac68nY+OdP843exKfVSaM2yK9PMyAeF0xSCEm5XzphZ0o9WfkqfymeA/P46C2d/XTaAr8CgYEAlcndIqySXowE1XO9CsUTdhKYT3ZW8F7PHSWWq0hM59SX07gB8yyj5mMgDy9aqeUanl4BwEXRhKXwdid80tN+XbhkcH+gev8faHTI24sd7cqJVx9DxUpeewUF13mnNTfg2sagg9LWOJfHTps4dt2jkHR3OmXoRr7zLFkcNOH694cCgYEAhGfxQTrOXcFuWnTRky4lITVXSgGqEWjrk9wPTZVFaFWuv9x1xq+iR5keXFyGowOWCbYKbVN0juh3vxg8a1kskJ8YTNZk+xXlaNx+2FmXeq9mOyFW2tasKm3PvfvbTuX4b+VseoycxfWFV4q/BZgwXWCRtP3lgHyeZnKoDACtbT8CgYAOjMM8QQMex/8YNNviFe6kA35kCZy8UJlRvXr7PFSsGEx/NlqKIoXxNSPCFdl6s1R4ma0V3jJR7kSDVaacXArkU6r9+oe+KtYEMYPpP4Qyuv/IRLMykNzIml5M5fZGBx2CYtTouSwx5xxnGFDNyw2+VHHYbFm5tYatgiJpSKI2NQKBgQCy2J422lc6FCPZqRcbHJvsbpOt4Q8jT9wgrLL7mwdpHDx/Rr1XS9vfC9RRmE/5CvzFkTDbJSlY369yKdXT8H/5vu6u5uaBQIYe+JXb1kDibFn4LOQuAvCfoR6r+ahrz06UKcyXc58MPbmR48MBPAanKXahdKtLVQzM8ehTxS56CA=="
          }
        }
      },
      coffee: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/views/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= yeoman.dist %>/*',
              '!<%= yeoman.dist %>/.git*'
            ]
          }
        ]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    coffee: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/scripts',
            src: '{,*/}*.coffee',
            dest: '.tmp/scripts',
            ext: '.js'
          }
        ]
      },
      test: {
        files: [
          {
            expand: true,
            cwd: 'test/spec',
            src: '{,*/}*.coffee',
            dest: '.tmp/spec',
            ext: '.js'
          }
        ]
      }
    },
    haml: {
      options: {
        language: 'ruby'
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/views',
            src: '{,*/}*.haml',
            dest: '.tmp/views',
            ext: '.html'
          }
        ]
      }
    },
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/components',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    concat: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '.tmp/scripts/{,*/}*.js',
            '<%= yeoman.app %>/scripts/{,*/}*.js'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= yeoman.dist %>/images'
          }
        ]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= yeoman.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
           // https://github.com/yeoman/grunt-usemin/issues/44
           //collapseWhitespace: true,
           collapseBooleanAttributes: true,
           removeAttributeQuotes: true,
           removeRedundantAttributes: true,
           useShortDoctype: true,
           removeEmptyAttributes: true,
           removeOptionalTags: true*/
        },
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['*.html', 'views/*.html'],
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>/scripts',
            src: '*.js',
            dest: '<%= yeoman.dist %>/scripts'
          }
        ]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              '*.{ico,txt}',
              '.htaccess',
              'components/**/*',
              'images/{,*/}*.{gif,webp}',
              'styles/fonts/*'
            ]
          }
        ]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', [
    'clean:server',
    'coffee:dist',
    'haml:dist',
    'compass:server',
    'livereload-start',
    'connect:livereload',
    'open',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'coffee',
    'haml',
    'compass',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'jshint',
    'test',
    'coffee',
    'compass:dist',
    'useminPrepare',
    'imagemin',
    'cssmin',
    'htmlmin',
    'concat',
    'copy',
    'cdnify',
    'ngmin',
    'uglify',
    'rev',
    'usemin'
  ]);
  grunt.registerTask('default', ['build']);
};
