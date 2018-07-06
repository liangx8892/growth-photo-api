var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    config = require('../config/config');


exports.savePhoto = function (req, res, next) {
    var photo = {
        userId: req.user.id,
        localPath: req.body.localPath,
        createDate: req.body.createDate
    };

    var PhotoSchema = mongoose.model('Photo');
    var photoObj = new PhotoSchema(photo);
    photoObj.save(function(err, doc){
        if (err) {
            return res.sendStatus(500, { error: err });
        } else {
            console.log('photo succesfully saved');
            return res.json({success: true, photoId: doc._id});
        }
    });
};

exports.getPhotos = function (req, res, next) {

    var currentPage = parseInt(req.params.currentPage);
    var pageSize = parseInt(req.params.pageSize);
    var PhotoSchema = mongoose.model('Photo');
    console.log('currentPage:', currentPage, 'pageSize:', pageSize);
    PhotoSchema.find({userId: req.user.id}).skip(currentPage * pageSize).limit(pageSize).sort({createDate: -1}).exec(function(err, docs){
        if (err) {
            return res.sendStatus(500, { error: err });
        } else {
            console.log('photo succesfully retrieved.');
            return res.json(docs);
        }
    });
};

exports.deletePhoto = function (req, res, next) {
    var PhotoSchema = mongoose.model('Photo');
    PhotoSchema.deleteOne({_id: req.params.photoId}, function(err, doc){
        if (err) {
            return res.sendStatus(500, { error: err });
        } else {
            console.log('photo succesfully deleted');
            return res.json({success: true});
        }
    });
};

exports.updatePhoto = function (req, res, next) {
    var photo = {
        userId: req.user.id,
        localPath: req.body.localPath,
        createDate: req.body.createDate,
        photoId: req.body._id,
        description: req.body.description
    };

    var PhotoSchema = mongoose.model('Photo');

    PhotoSchema.findOneAndUpdate({_id: photo.photoId}, {description: photo.description}, {upsert: true}, function(err, doc){
        if (err) {
            return res.sendStatus(500, { error: err });
        } else {
            console.log('photo succesfully updated');
            return res.json(doc);
        }
    });
};