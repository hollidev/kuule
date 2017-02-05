var Router = require('restify-router').Router;
var router = new Router();
var User = require('../models/user');

router.post('/login', function(req, res, next) {
    if(req.body == undefined) {
        res.statusCode = 400;
        res.end();
    }

    User.findOne({name: req.body.username}, function(err, result) {
        if(err || result == undefined)
        {
            res.statusCode = 401;
            res.end();
        }

        var user = result.toObject();

        if(user.password === req.body.password) {
            user.active = true;
            res.statusCode = 200;
        }
        else {
            res.statusCode = 401;
        }

        res.end();
    });


});

router.post('/logout', function(req, res, next) {
    if(req.body == undefined) {
        res.statusCode = 400;
        res.end();
    }

    User.findOne({name: req.body.username}, function(err, result) {
        if(err || result == undefined)
        {
            res.statusCode = 401;
            res.end();
        }

        var user = result.toObject();

        if(user.password === req.body.password) {
            user.active = false;
            res.statusCode = 200;
        }
        else {
            res.statusCode = 401;
        }

        res.end();
    });
});

router.post('/user', function(req, res, next) {
    if(req.body == undefined) {
        res.statusCode = 400;
        res.end();
    }

    var user = new User();
    user.name = req.body.username;
    user.password = req.body.password;

    user.save();

    res.end();
});

module.exports = router;