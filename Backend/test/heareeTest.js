var chai = require('chai');
var assert = chai.assert;

var config = require('../config/config.json');
var Hearee = require('../models/hearee');
var restify = require('restify');

var address = config.apiAddress;

var client = restify.createJsonClient(address);

describe('heareeRouter', function() {
    var testHearee;

    it('should delete all hearees', function() {
        client.del('/api/hearee', function(err, req, res) {
            Hearee.find({}, function(err, results) {
                assert.equal(0, results.length);
            });
        });
    });

    it('should save a valid hearee', function() {
        testHearee = new Hearee();

        testHearee._id = 'testHearee';
        testHearee.firstName = 'Joku';
        testHearee.lastName = 'Nimi';
        testHearee.address = 'Osoite 1';
        testHearee.caseId = 'demo';

        client.post('/api/hearee', testHearee, function(err, req, res, obj) {
            Hearee.findOne({firstName: testHearee.firstName, lastName: testHearee.lastName, address: testHearee.address}, function(findErr, result) {
                assert.equal(result.firstName, testHearee.firstName);
            });
        });
    });

    it('should not save an invalid hearee', function() {
        var hearee = new Hearee();

        client.post('/api/hearee', hearee, function(err, req, res, obj) {
            assert.equal(400, res.statusCode);
        });
    });

    it('should delete the given hearee', function() {
        // requires hearee saving to have succeeded
        client.del('/api/hearee/' + testHearee._id, function(err, req, res) {
            assert.equal(null, err);
        });
    });
});
