var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Hearee = require('./hearee');

var VerificationDataSchema = new Schema({
    hearee: {
        type: Schema.ObjectId,
        ref: 'Hearee'
    },
    method: String,
    data: {},
    caseId: String

});

module.exports = mongoose.model('Verification', VerificationDataSchema);