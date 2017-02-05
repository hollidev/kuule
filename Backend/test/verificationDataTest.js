var chai = require('chai');
var assert = chai.assert;

var config = require('../config/config.json');
var Verification = require('../models/verificationData');
var Hearee = require('../models/hearee');
var restify = require('restify');

var address = config.apiAddress;

var client = restify.createJsonClient(address);

describe('verificationDataRouter', function() {
    it('should not process an invalid request', function() {
        var invalidVerification = {};

        client.post('/api/verification-data', invalidVerification, function(err, req, res, obj) {
            assert.equal(400, res.statusCode);
        });
    });

    it('should save a valid verification', function() {
        var validVerification = new Verification();
        var hearee = new Hearee();

        hearee.firstName = "Testi";
        hearee.lastName = "Testaaja";
        hearee.address = "Testikatu 1";
        hearee.caseId = "demo";

        validVerification.caseId = "demo";
        validVerification.comments = "En kommentoi";
        validVerification.method = "photo";
        validVerification.hearee = hearee;

        client.post('/api/verification-data', validVerification, function(err, req, res, obj) {
            assert.equal(err, null);
        });
    });

    it('should delete all verifications of a given case', function() {
        client.del('/api/verification-data/demo', function(err, req, res) {
           Verification.find({caseId: "demo"}, function(err, results) {
               assert.equal(0, results.length);
           });
        });
    });

});
