var express = require('express');
var router = express.Router();
const querystring = require('querystring');
var config = require('../config/config.json');
var restify = require('restify');
var SentEmail = require('../models/sentEmail');
var Verification = require('../models/verificationData');

/* GET case by id */
router.get('/:id', function(req, res, next) {
    var query = querystring.parse(req._parsedUrl.query);
    var caseId = req.params.id;
    var token = query.token;

    if(token == undefined)
        res.render('error');
    else if(query.heard == undefined)
        res.render('case', { title: 'Case data' });
    else if(query.heard == 'true') {
        verifyHearee(caseId, token, function() {
            res.render('index');
        });
    }

    else
        res.render('error');
});

function verifyHearee(caseId, token, callback)
{
    var verification = new Verification();

    verification.caseId = caseId;
    verification.method = "email";

    findHearee(token, function(err, result) {
        if(result)
        {
            verification.hearee = result._id;
            verification.save();
        }

        callback();
    });
}

function findHearee(token, callback) {
    SentEmail.findOne({token: token})
        .populate('hearee')
        .exec(function(err, result) {
            if(result) {
                result.heard = true;
                result.hearee.heard = true;

                result.save();
                result.hearee.save();

                callback(err, result.hearee);
            }
        });
}

module.exports = router;
