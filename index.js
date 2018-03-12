'use strict';




var config = require('./server/config/config');
var mongooseService = require('./server/config/lib/mongoose');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var app = express();
var passport = require('passport');
var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


var strategy  = new Strategy({secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()}, function (payload, done) {
    console.log('payload', payload);
    var UserSchema = mongoose.model('User');
    UserSchema.findById(payload.id, function (err, user) {
        if (err) {
            return done(new Error("User not found"), null);
        }else if (!user){
            return done(new Error("User not found"), null);
        }else{
            return done(null, user);
        }
    });
});

passport.use(strategy);
app.use(passport.initialize());

mongooseService.connect(function (db) {
 //Initialize Models
    mongooseService.loadModels(function () {
        console.log('Mongo models loaded...');
    });
});

app.get('/', function (req, res) {
    res.json({status: "My API is alive!"});
});

app.post('/token', function (req, res) {
    console.log('entering token...');
    if(req.body.username && req.body.password){
        var username = req.body.username;
        var password = req.body.password;
        console.log('username: ', username);
        console.log('password: ', password);
        var UserSchema = mongoose.model('User');
        UserSchema.find({username: username}, function (err, users) {
            if (err) {
                console.error(err);
                res.sendStatus(401);
            }else if (!users || users.length === 0){
                console.error('No user found with name ', username);
                res.sendStatus(401);
            }else{
                var user = users[0];
                if(user.authenticate(password)){
                    var payload = {id : user._id};
                    var token = jwt.sign(payload, config.jwtSecret);
                    res.json({token : token});
                }else{
                    console.error('Password is incorrect of ', username);
                    res.sendStatus(401);
                }
            }
        });
    }else{
        res.sendStatus(401);
    }
});

app.get('/user', passport.authenticate('jwt', {session: false}) , function (req, res) {
    res.json(req.user);
});

app.listen(3000, function () {
   console.log('My API is running...');
});

module.exports = app;