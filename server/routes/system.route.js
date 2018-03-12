'use strict';

var loginCtl = require('../controllers/login.controller');

module.exports = function (app) {
    app.route('/api/auth/login').post(loginCtl.login);
    app.route('/api/user').get(loginCtl.getUser);
}