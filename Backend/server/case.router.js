var Router = require('restify-router').Router;
var router = new Router();
var Hearee = require('../models/hearee');

router.get('/case-data/:id', function(req, res, next) {
    readFile('./server/static/latokuja-9.json', function(obj) {
        res.json(obj);
    });
});

router.get('/case-data/:id/hearees', function(req, res, next) {
    initializeHearees(req.params.id, function(data) {
        res.json(data);
    });

});

function readFile(path, callback){
    var fs = require('fs');
    var obj;
    fs.readFile(path, 'utf8', function (err, data) {
        if (err)
            throw err;
        obj = JSON.parse(data);
        callback(obj);
    });
}

function initializeHearees(caseId, callback) {
    Hearee.find({caseId: caseId}, function(err, results) {
        if(results.length == 0) {
            readFile('./server/static/latokuja-9-hearees.json', function(obj) {
                obj.forEach(function(item) {
                    var hearee = new Hearee();
                    hearee.firstName = item.firstName;
                    hearee.lastName = item.lastName;
                    hearee.address = item.address;
                    hearee.heard = item.heard;
                    hearee.caseId = caseId;
                    hearee.save();
                });

                callback(obj);
            });
        }
        else
            callback(results);
    });
}

module.exports = router;