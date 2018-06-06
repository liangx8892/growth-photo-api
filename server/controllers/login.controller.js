'use strict';

var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    config = require('../config/config');


exports.login = function (req, res, next) {
    if(req.body.username && req.body.password){
        var username = req.body.username;
        var password = req.body.password;

        var UserSchema = mongoose.model('User');
        UserSchema.findOne({username: username}, function (err, user) {
            if(err){
                console.error(err);
                res.sendStatus(401);
            }else if(!user){
                console.error('User', username, 'not found.');
                res.sendStatus(401);
            }else{
                if(user.authenticate(password)){
                    var payload = {
                        id: user._id,
                        displayName: user.displayName,
                        username: user.username,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }

                    console.log('Issue JWT token for 1 year.');
                    var token = jwt.sign(payload, config.jwtOption.secretOrKey, { expiresIn: 60 * 60 * 24 * 365});// * 60 * 24 * 7
                    res.json({token: token});
                }else{
                    console.error('Password is incorrect.');
                    res.sendStatus(401);
                }
            }
        });
    }else{
        res.sendStatus(401);
    }
};

exports.getUser = function(req, res, next){
    res.json(req.user);
}