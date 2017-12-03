var SecretSharing = require('./secret_sharing');

var dictionary = SecretSharing.generate("0xf87db6f54", 10, 7);
var text = SecretSharing.solve(dictionary.shares, 7, 16);

console.log('Text: ', text);

var Encryptor = function() {};

Encryptor.encrypt = function(text, users) {
    var result = {};

    return result;
};

Encryptor.decrypt = function(encryptedText) {
    var text = '';

    return text;
};

var encryptor = new Encryptor();

module.exports = encryptor;