'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash'),
    gulp = require('gulp'),
    fs = require('fs');
// Local settings
var changedTestFiles = [];

// Set NODE_ENV to 'test'
gulp.task('env:test', function () {
    process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
    process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
    process.env.NODE_ENV = 'production';
});

gulp.task('mongo-seed', function(done){
    var db = require('./server/config/lib/mongoose');
    var seed = require('./server/config/lib/seed');

    db.connect(function () {
        db.loadModels();

        seed.start({
            options : {
                logResults: true
            }
        }).then(function () {
            db.disconnect(done);
        }).catch(function (err) {
            db.disconnect(function (disconnectError) {
               if(disconnectError){
                   console.log('Error disconnecting from database, but was preceded by a Mongo seed error.');
               }

               done(err);
            });
        });
    });
});