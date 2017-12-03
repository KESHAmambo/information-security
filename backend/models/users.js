var crypto = require('crypto');

var mongoose = require('lib/mongoose');

var users = new Users({
    user_name: {
        type: String,
        unique: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

users.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}

users.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () { return this._plainPassword; });

users.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashed_password;
};

exports.User = mongoose('User', users);
