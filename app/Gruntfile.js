// Steflef 2013
'use strict';

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var batConfig = {
        app: 'mobile/dist',
        dist: 'dist',
        db: 'batman',
        now: (new Date()).toISOString()
    };

    grunt.initConfig({
        batman: batConfig,
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= batman.dist %>/*'
                    ]
                }]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= batman.app %>',
                        dest: '<%= batman.dist %>',
                        src: '**'
                    }
                ]
            },
            backup: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd:'<%= batman.dist %>',
                        src: '**',
                        dest: '<%= batman.dist %>_<%= batman.now %>'
                    }
                ]
            }
        },
        'couch-configure': {
            options: {
                user: 'robin',
                pass: 'hood'
            },
            files: {
                src: 'models/couch/<%= batman.db %>/config.json',
                dest: 'http://localhost:5984/<%= batman.db %>'
            }
        },
        'couch-push': {
    
                options: {
                    user: 'robin',
                    pass: 'hood'
                },
                files: {
                    src: 'models/couch/<%= batman.db %>/docs.json',
                    dest: 'http://localhost:5984/<%= batman.db %>'
                }


        },
        'couch-security': {
            options: {
                user: 'robin',
                pass: 'hood'
            },
            files: {
                src: 'models/couch/<%= batman.db %>/security.json',
                dest: 'http://localhost:5984/<%= batman.db %>'
            }
        }
 
    });

    grunt.registerTask('build', 'Backup /dist + Copy mobile/dist to /dist', 
        [
            'copy:backup',
            'clean:dist',
            'copy:dist'
        ]
    );
    
    grunt.registerTask('backup', 'Backup of /dist', 
        [
            'copy:backup'
        ]
    );


    grunt.registerTask('couch', 'Init CouchDB',
        [
            //'couch-configure',
            'couch-push',
            'couch-security'
        ]
    );
};