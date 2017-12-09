var devMode = true;

var SecretSharing = require('./secret_sharing');
var input = {
    text: 'Vadim norm sorre',
    numshares: 3,
    threshold: 3,
    usersId: [ 1 , 2, 3]
};
var output = {
    numshares: 2,
    encryptedText: '',
    users: []
};
String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
};

var Encryptor = {};
Encryptor.makeShares = function (input) {
    var str = input.text;
    var numOfUsers = input.numshares;
    var numOfUsersForEncryption = input.threshold;
    var strOne = str.split('');
    var ArrayForEncryption = [];

//Перевод текста в числа
    var EncodedChars = []; // Массив из символов переведенных в код
    var output = {users: []};
    output.numshares = input.threshold;
    for (var j = 0; j < str.length; j++) {
        EncodedChars.push(str.charCodeAt(j));
    }
    var string1 = "";
    for (var k = 0; k < str.length; k++) {
        string1 = string1 + String.fromCharCode(EncodedChars[k]);
    }

//массив ключей от чисел
    var Keys = [];

    for (var l = 0; l < str.length; l++) {
        var string2 = EncodedChars[l];
        Keys.push(SecretSharing.generate(string2, numOfUsers, numOfUsersForEncryption));
    }

    for (var t = 0; t < numOfUsers; t++) {
        var user = {
            id: 0,
            shares: []
        };
        output.users.push(user);
        for (var i = 0; i < str.length; i++) {
            output.users[t].id = input.usersId[t];
            output.users[t].shares.push(Keys[i].shares[t]);
        }
    }

    return output;
};

Encryptor.decrypt = function (output) {
    var Keys = [];
    var textLength = output.users[0].shares.length;
    //для каждого слова соберем все ключи
    for(var i = 0; i < textLength; i++)
    {
        var key = {data: [],
        shares:[]};
        Keys.push(key);
    }
    for(j = 0; j < textLength; j++) {
        for(k = 0; k < output.numshares; k++) {
            Keys[j].shares.push(output.users[k].shares[j]);
        }
    }

    var decryptedTextFromKeys = "";
    for (var l = 0; l < textLength; l++) {
        decryptedTextFromKeys = decryptedTextFromKeys + (SecretSharing.solve(Keys[l].shares, output.numshares, 16).hexDecode());
    }
    return decryptedTextFromKeys;
};



// TEST-----------------------------------------------------------------------------------
if(devMode) {
    var beforeEncrypt = Date.now();
    var encryptedText = Encryptor.makeShares(input);
    console.log('Encrypted text: ', encryptedText);
    console.log('Share: ', JSON.stringify(encryptedText.users[2].shares[0]));
    var afterEncrypt = Date.now();
    console.log('Encryption time:' + (afterEncrypt - beforeEncrypt));


    // encryptedText.for(function(item) {
    //     var shares = item.shares;
    //     shares = JSON.stringify(shares);
    //     console.log()
    // })


    var decryptedText = Encryptor.decrypt(encryptedText);
    var afterDecrypt = Date.now();
    console.log('Decryption time:' + (afterDecrypt - afterEncrypt));
    console.log('Right result: ' + (decryptedText === input.text) + '. Text length: ' +
        decryptedText.length);
}

