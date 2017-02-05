var express = require('express');
var router = express.Router();
var restify = require('restify');
var Verification = require('../models/verificationData');

var config = require('../config/config.json');

/* GET home page. */
router.get('/api-doc', function(req, res, next) {
  res.render('api', { title: 'API' });
});

/* GET verifications view */
router.get('/data', function(req, res, next) {
  var apiAddress;

  if(config.debug == true)
    apiAddress = "http://localhost:" + config.apiDevPort;
  else
    apiAddress = config.apiAddress;

  var client = restify.createJsonClient(apiAddress);
  var verifications;

  client.get('/api/verification-data/demo', function(err, request, response, obj) {
    if(err) {
      console.log('Error getting demo data: ' + err);
      res.render('error');
    }

    verifications = obj;
    console.log('Verification data fetched');

    res.render('index', { title: 'Verification data', data: verifications });
  });
});

router.get('/', function(req, res, next) {
  res.render('api');
});

module.exports = router;
