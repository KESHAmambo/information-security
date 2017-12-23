var crypto = require('crypto');

var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user_name: {
        type: String,
        unique: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    }
});
var secretKey = 'asdkf ;aslkjd f;laksjd f;l kajsd;lfkja;lkj;ljsdlkfjlkasjdfljlaajjsd faksdfk jas;dlkjf a;slkdjf;l aksjdf;lk jsad;lfkjas;lkjdf;lkasjdf;lja s;ldkjf ;laskjdf;lk jasdlfkjl;skdjf;lkasjdf;lkjas;dlfkja;l kdfj;laks djflka j;lkdj a;lskdjf ;lkajsd;lkjasslk;lfakjsd;lfkja;s ldkfja lkdf j;alk djf; lkjd;lk ja;lkdfj ;alkjdf ;lakjfd ;lkjasdf; lkj;dfl kjas;ldfj ;laskdj ;lakjdf ;lkajsdf ;lkjsa;dlfjashdhqhpieruhgoisdyvbonlasjkn;kslcmz;xvijpai jhgpo visjegpvm';
schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', secretKey).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () { return this._plainPassword; });

schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashed_password;
};

exports.User = mongoose.model('User', schema);