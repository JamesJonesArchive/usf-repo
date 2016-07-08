'use strict';
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    // Project configuration.
    // Configurable paths for the application
    var appConfig = {
        name: require('./package.json').name,
        version: require('./package.json').version,
        release: require('./package.json').release,
        description: require('./package.json').description,
        homepage: require('./package.json').homepage,
        license: require('./package.json').license
    };
    grunt.initConfig({
        appEnv: appConfig,
        clean: {
            deploy: {
                src: ['deploy/*.rpm', 'deploy/*.deb']
            }
        },
        shell: {
            options: {
                stdout: true,
                stderr: true,
                failOnError: true
            },
            mkdeploy: {
                command: 'mkdir -p deploy'
            },
            for_centos7: {
                "command": [
                    [
                        '/usr/local/bin/fpm -s dir -t rpm -n \'<%= appEnv.name %>\' -v <%= appEnv.version %> '
                    ].join(' -d '),
                    '--description "<%= appEnv.description %>"',
                    '--url "<%= appEnv.homepage %>"',
                    '--license "<%= appEnv.license %>"',
                    '--vendor "University of South Florida"',
                    '--iteration "<%= appEnv.release %>.el7"',
                    '--after-install ./enable.sh',
                    '--before-remove ./disable.sh',
                    '-p deploy ./yum.repos.d/centos-usf-repo.repo=/etc/yum.repos.d/usf-repo.repo'
                ].join(' ')
            },
            for_fedora23: {
                "command": [
                    [
                        '/usr/local/bin/fpm -s dir -t rpm -n \'<%= appEnv.name %>\' -v <%= appEnv.version %> '
                    ].join(' -d '),
                    '--description "<%= appEnv.description %>"',
                    '--url "<%= appEnv.homepage %>"',
                    '--license "<%= appEnv.license %>"',
                    '--vendor "University of South Florida"',
                    '--iteration "<%= appEnv.release %>.fc23"',
                    '--after-install ./enable.sh',
                    '--before-remove ./disable.sh',
                    '-p deploy ./yum.repos.d/fedora-usf-repo.repo=/etc/yum.repos.d/usf-repo.repo'
                ].join(' ')
            }
        }
    });
    
    grunt.registerTask('default', []);
    
    grunt.registerTask('buildforcentos7', [
        // "chmod:pharbits",
        "clean:deploy",
        "shell:mkdeploy",
        "shell:for_centos7"
        // "shell:mkdeploy",
        // "shell:fpmrpm"
    ]);
};
