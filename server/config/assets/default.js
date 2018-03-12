'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
    server: {
        gulpConfig: ['gulpfile.js'],
        allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
        models: 'server/models/**/*.js',
        routes: ['server/routes/**/*.js'],
        policies: 'modules/*/server/policies/*.js',
        views: ['modules/*/server/views/*.html']
    }
};