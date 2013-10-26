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
        //now: Date.now()
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
};