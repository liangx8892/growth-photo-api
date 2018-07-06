'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
    db: {
        uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://'+ process.env.MONGODB_USER + ':' + process.env.MONGODB_PWD + '@' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/growth-photo-api-dev',
        options: {},
        // Enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false
    },
    jwtSecret: 'lTc#aT73Bst#jS7R',
    jwtOption: {
        secretOrKey: 'lTc#aT73Bst#jS7R',
        jwtSession: {
            session: false
        }
    },
    log: {
        // logging with Morgan - https://github.com/expressjs/morgan
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'dev',
        fileLogger: {
            directoryPath: process.env.WORKINGDIR,
            fileName: 'app.log',
            maxsize: 10485760,
            maxFiles: 2,
            json: false
        }
    },
    livereload: true,
    seedDB: {
        seed: process.env.MONGO_SEED === 'true',
        options: {
            logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false',
            seedUser: {
                username: process.env.MONGO_SEED_USER_USERNAME || 'ddxiong',
                provider: 'local',
                email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
                firstName: 'User',
                lastName: 'Local',
                displayName: 'User Local',
                roles: ['user']
            },
            seedAdmin: {
                username: process.env.MONGO_SEED_ADMIN_USERNAME || 'seedadmin',
                provider: 'local',
                email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
                firstName: 'Admin',
                lastName: 'Local',
                displayName: 'Admin Local',
                roles: ['user', 'admin']
            }
        }
    }
};
