var SecretSharing = require('./secret_sharing');

var dictionary = SecretSharing.generate("0xf87db6f54", 10, 7);
var text = SecretSharing.solve(dictionary.shares, 7, 16);

console.log('Text: ', text);

