var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    config = require('../config/config');


exports.saveSettings = function (req, res, next) {
    if(req.body.babyName && req.body.expectedBirthDate){

        var Settings = mongoose.model('Settings');
        var settings = {
            userId: req.user.id,
            babyName: req.body.babyName,
            expectedBirthDate: req.body.expectedBirthDate,
            birthDate: req.body.birthDate,
        };

        Settings.findOneAndUpdate({userId: req.user.id}, settings, {upsert: true}, function(err, doc){
            if (err) {
                return res.sendStatus(500, { error: err });
            } else {
                console.log('settings succesfully saved');
                return res.json(doc);
            }
        });

    }else{
        res.sendStatus(400);
    }
};

exports.getSettings = function (req, res, next) {
    var userId = req.user.id;
    var Settings = mongoose.model('Settings');

    Settings.findOne({userId: userId}, function (err, settings) {
        if(err){
            console.error('failed to get user settings for userId: '+ userId, err);
            res.sendStatus(500, {error: err});
        }else if(!settings){
            console.log('user settings for userId: '+ userId + ' was not found');
            res.json({NoResult: true});
        }else{
            res.json(settings);
        }
    });
};