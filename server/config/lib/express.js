var config = require('../config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    path = require('path'),
    http = require('http'),
    jwt = require('jsonwebtoken'),
    cors = require('cors'),
    cookieParser = require('cookie-parser'),
    _ = require('lodash');

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
    // Initialize express app
    var app = express();

    // Initialize local variables
    this.initLocalVariables(app);

    // Initialize Express middleware
    this.initMiddleware(app);

    // Initialize modules static client routes, before session!
    this.initModulesClientRoutes(app);

    // Initialize modules server routes
    this.initModulesServerRoutes(app);

    // Initialize error routes
    this.initErrorRoutes(app);

    // Create a new HTTP server
    server = http.createServer(app);

    return server;
};

module.exports.initLocalVariables = function (app) {
    // Setting application local variables
    app.locals.livereload = config.livereload;
    app.locals.env = process.env.NODE_ENV;
    app.locals.domain = config.domain;

    // Passing the request url to environment locals
    app.use(function (req, res, next) {
        res.locals.host = req.protocol + '://' + req.hostname;
        res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
        next();
    });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {

    // Should be placed before express.static
    app.use(compress({
        filter: function (req, res) {
            return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));


    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Add the cookie parser and flash middleware
    app.use(cookieParser());

    app.use(function(req, res, next) {
        var oneof = false;
        if(req.headers.origin) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            oneof = true;
        }
        if(req.headers['access-control-request-method']) {
            res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
            oneof = true;
        }
        if(req.headers['access-control-request-headers']) {
            res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
            oneof = true;
        }
        if(oneof) {
            res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
        }

        // intercept OPTIONS method
        if (oneof && req.method == 'OPTIONS') {
            res.send(200);
        }
        else {
            next();
        }
    });
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
    // Setting the app router and static folder
    app.use('/', express.static(path.resolve('./client'), { maxAge: 86400000 }));
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
    app.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) {
            return next();
        }

        // Log it
        console.error(err.stack);
        // Redirect to error page
        res.redirect('/server-error');
    });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
    // Globbing routing files


    app.use(function (req, res, next) {
        if('/api/auth/login' !== req.path){
            var authHeader = req.get('Authorization');
            if(authHeader){
                var jwtToken = authHeader.split(' ')[1];
                try {
                    var decoded = jwt.verify(jwtToken, config.jwtOption.secretOrKey);
                    req.user = decoded;
                } catch(err) {
                    console.error('token is invalid');
                    console.error('err', err);
                    res.sendStatus(401);
                }
            }else{
                console.error('No Authorization found.');
                res.sendStatus(401);
            }
        }
        next();
    });

    config.files.server.routes.forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });
};
