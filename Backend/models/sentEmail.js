var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Hearee = require('./hearee');

var SentEmailSchema = new Schema({
    hearee: {
        type: Schema.ObjectId,
        ref: 'Hearee'
    },
    token: String,
    heard: Boolean
});

module.exports = mongoose.model('SentEmail', SentEmailSchema);