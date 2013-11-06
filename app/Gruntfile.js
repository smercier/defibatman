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
        },
        run_grunt: {
            options: {
                log: true,
                minimumFiles: 2,
                concurrent: 1
            },
            simple_target: {
                options: {
                    log: true,
                    task: ['build'],
                    process: function(res){
                        if (res.fail){
                            res.output = 'FAIL'
                            grunt.log.writeln('Process Failed');
                        }
                    }
                },
                src: ['mobile/Gruntfile.js','Gruntfile.js']
            }
        },
        prompt: {
            mochacli: {
                options: {
                    questions: [
                        {
                            config: 'mochacli.options.reporter',
                            type: 'list',
                            message: 'Which Mocha reporter would you like to use?',
                            default: 'spec',
                            choices: ['dot', 'spec', 'nyan', 'TAP', 'landing', 'list',
                                'progress', 'json', 'JSONconv', 'HTMLconv', 'min', 'doc']
                        }
                    ]
                }
            }
        },
        mochacli: {
            options: {
                require: ['should'],
                reporter: 'nyan',
                bail: true
            },
            all: ['test/m-api.js']
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
            'couch-push',
            'couch-security'
        ]
    );


    grunt.registerTask('couch-config', 'Set CouchDB _config. Check models/couch/batman/config.json first.',
        [
            'couch-configure'
        ]
    );
    
    grunt.registerTask('run', 'Run Grunt Builds',
        [
            'run_grunt'
        ]
    );

    grunt.registerTask('q', 'Test Prompt',
        [
            'prompt:mochacli',
            'mochacli'
        ]
    );
};