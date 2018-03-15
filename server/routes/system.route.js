'use strict';

var loginCtl = require('../controllers/login.controller');
var settingsCtl = require('../controllers/settings.controller');
var photoCtl = require('../controllers/photo.controller');

module.exports = function (app) {
    app.route('/api/auth/login').post(loginCtl.login);
    app.route('/api/user').get(loginCtl.getUser);
    app.route('/api/settings').put(settingsCtl.saveSettings);
    app.route('/api/settings').get(settingsCtl.getSettings);
    app.route('/api/photo').put(photoCtl.savePhoto);
    app.route('/api/photo').post(photoCtl.updatePhoto);
    app.route('/api/photo').get(photoCtl.getPhotos);
    app.route('/api/photo/:photoId').delete(photoCtl.deletePhoto);
}