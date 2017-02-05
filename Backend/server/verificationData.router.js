var Router = require('restify-router').Router;
var router = new Router();
var Verification = require('../models/verificationData');
var Hearee = require('../models/hearee');

router.post('/verification-data', function(req, res, next) {
    // process and save incoming verification data to db
    processVerificationData(req, res);
});

function processVerificationData(req, res) {
    var verification = new Verification();

    try {
        if(req.headers['content-type'] == "application/json")
            data = req.body;
        else {
            data = JSON.parse(req.body);
            data.hearee = JSON.parse(data.hearee);
        }

        findHearee(data.hearee.firstName, data.hearee.lastName, data.hearee.address, function(err, result) {
            if(result == null)
            {
                var hearee = new Hearee();
                hearee.firstName = data.hearee.firstName;
                hearee.lastName = data.hearee.lastName;
                hearee.address = data.hearee.address;
                hearee.heard = true;
                hearee.caseId = data.caseId;

                hearee.save();

                verification.hearee = hearee._doc._id;
            }
            else
            {
                verification.hearee = result._id;
            }

            verification.method = data.method;
            verification.comments = data.comments;
            verification.caseId = data.caseId;
            verification.data = data.data;

            verification.save();

            res.end('Verification from ' + data.hearee.lastName + ' saved');
        });
    }
    catch(err)
    {
        res.statusCode = 400;
        res.end();
    }
}

router.get('/verification-data/:caseId', function(req, res, next) {
    var data = [];

    // get all data
    Verification.find({caseId: req.params.caseId})
        .populate('hearee')
        .exec(function(err, results) {
            results.forEach(function(result) {
                data.push(result.toObject());
        });

        res.json(data);
    });
});

router.del('/verification-data/:caseId', function(req, res, next) {
    Verification.remove({caseId: req.params.caseId}, function(err) {
        if(err)
            res.end(err);
        else
            res.end();
    });
});

function findHearee(firstName, lastName, address, callback) {
    Hearee.findOne({firstName: firstName, lastName: lastName, address: address}, function(err, result) {
        if(err)
            callback(err, null);
        else if(result) {
            result.heard = true;
            result.save();
            callback(null, result);
        }
        else
            callback(null, null);
    });
}

module.exports = router;