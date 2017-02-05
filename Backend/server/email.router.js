var Router = require('restify-router').Router;
var router = new Router();
var nodemailer = require('nodemailer');
var smtpTransporter = require('nodemailer-smtp-transport');
var SentEmail = require('../models/sentEmail');
var Hearee = require('../models/hearee');
var uuid = require('node-uuid');

router.post('/send-email', function(req, res, next) {
    if(req.body == undefined) {
        res.statusCode = 400;
        res.end();
    }

    var data;

    if(req.headers['content-type'] == "application/json")
        data = req.body;
    else
        data = JSON.parse(req.body);

    sendEmail(data, function(token) {
        var sentEmail = new SentEmail();

        findHearee(data.hearee.firstName, data.hearee.lastName, data.hearee.address, function(err, result) {
           if(result)
           {
               sentEmail.hearee = result._id;
           }
           else {
               var hearee = new Hearee();
               hearee.address = data.hearee.address;
               hearee.firstName = data.hearee.firstName;
               hearee.lastName = data.hearee.lastName;
               hearee.heard = false;
               hearee.caseId = "demo";
               hearee.save();

               sentEmail.hearee = hearee._doc._id;

           }

            sentEmail.token = token;
            sentEmail.heard = false;

            sentEmail.save();

            res.end();
        });


    });

});

function sendEmail(data, callback) {
    var emailAddress = data.emailAddress;
    var hearee = data.hearee;
    var token = generateToken();

    // set up transporter
    var smtpTransport = nodemailer.createTransport(smtpTransporter({
        host: "smtp-mail.outlook.com",
        secureConnection: true,
        port: 587,
        auth: {
            user: "lupapistos@outlook.com",
            pass: "kaakatikaak67"
        }
    }));

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'lupapistos@outlook.com', // sender address
        to: emailAddress, // list of receivers
        subject: 'Kuule naapurisi rakennushanke', // Subject line
        text: 'Hei ' + hearee.firstName + ', tässä sulle linkki hankkeeseen: http://holli.kapsi.fi/case/demo?token=' + token, // plaintext body
        html: 'Hei ' + hearee.firstName + ', tässä sulle linkki hankkeeseen: http://holli.kapsi.fi/case/demo?token=' + token // html body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function (error, info) {
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

        callback(token);
    });
}

function generateToken() {
    var token;

    token = uuid.v4();

    return token;
}

function findHearee(firstName, lastName, address, callback) {
    Hearee.findOne({firstName: firstName, lastName: lastName, address: address}, function(err, result) {
        if(err)
            callback(err, null);
        else if(result) {
            callback(null, result);
        }
        else
            callback(null, null);
    });
}

module.exports = router;