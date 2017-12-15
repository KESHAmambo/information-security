var mongoose = require('../libs/mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
    title: {
        type: String,
        required: true
    },
    creator_id: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    decrypted_text: {
        type: String
    },
    decryption_date: {
        type: Date
    }
});



exports.Text = mongoose.model('Text', schema);