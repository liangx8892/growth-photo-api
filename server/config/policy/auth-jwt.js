var passport = require("passport");
var config = require('../config');
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

var params = {
    secretOrKey: config.jwtOption.secretOrKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};


module.exports = function() {
    var strategy = new Strategy(params, function(payload, done) {
        console.log('payload', payload);
        done(null, {
            id: payload.id,
            displayName: payload.displayName,
            username: payload.username,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName
        });
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", config.jwtOption.jwtSession);
        }
    };
};