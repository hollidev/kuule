var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var HeareeSchema = new Schema({
    firstName: String,
    lastName: String,
    address: String,
    heard: Boolean,
    caseId: String
});

module.exports = mongoose.model('Hearee', HeareeSchema);