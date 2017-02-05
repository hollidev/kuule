var Router = require('restify-router').Router;
var router = new Router();
var Hearee = require('../models/hearee');

router.post('/hearee', function(req, res, next) {
    var hearee = new Hearee();

    if(req.body == undefined){
        res.statusCode = 400;
        res.end();
    }

    hearee.firstName = req.body.firstName;
    hearee.lastName = req.body.lastName;
    hearee.address = req.body.address;
    hearee.heard = false;
    hearee.caseId = req.body.caseId;

    hearee.save();

    res.end();

});

router.del('/hearee/:id', function(req, res, next) {
    Hearee.remove({_id: req.params.id}, function(err, removed) {
        if(err)
        {
            res.statusCode = 400;
            res.end(err);
        }

        else
            console.log('Hearee removed');

        res.end();
    });


});

router.del('/hearee', function(req, res, next) {
    Hearee.remove({}, function(err, removed) {
        if(err)
        {
            res.statusCode = 400;
            res.end(err);
        }

        else
            console.log('Hearees removed');

        res.end();
    });
});


module.exports = router;