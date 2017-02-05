var authRouter = require('./auth.router');
var caseRouter = require('./case.router');
var verificationRouter = require('./verificationData.router');
var emailRouter = require('./email.router');
var heareeRouter = require('./hearee.router');

var restify = require('restify');
var server = restify.createServer();
var config = require('../config/config.json');
var logger = require('restify-logger');

var port;

if(config.debug == true)
    port = config.apiDevPort;
else
    port = config.apiPort;

server.listen(port);
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(logger('default'));
server.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    next();
});

heareeRouter.applyRoutes(server);
authRouter.applyRoutes(server);
caseRouter.applyRoutes(server);
verificationRouter.applyRoutes(server);
emailRouter.applyRoutes(server);