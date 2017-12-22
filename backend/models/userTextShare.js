var mongoose = require('../libs/mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
    text_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    permission: {
        type: Boolean,
        required: true,
        default: false
    },
    share: {
        type: String,
        required: true
    }
});



module.exports.UserTextShare = mongoose.model('UserTextShare', schema);