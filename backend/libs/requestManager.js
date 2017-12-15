var urlManager = require('url');
var ObjectID = require('mongodb').ObjectID;
var User = require('../models/user').User;
var Text = require('../models/text').Text;
var UserTextShare = require('../models/userTextShare').UserTextShare;
var encryptor = require('../libs/encryption/encrypt');

function RequestManager() {}

var requestManager = new RequestManager();

requestManager.signIn = function(req, res){
    var urlWrapper = new urlManager.URL('http://localhost' + req.url);
    var username = urlWrapper.searchParams.get('username');
    var password = urlWrapper.searchParams.get('password');
    var responseText;

    User.find({user_name: username}, function(err, users) {
        if(users.length > 1) {
            res.end("Database is not valid");
        } else if (users.length === 1) {
            var user = users[0];
            if (user.checkPassword(password)) {
                responseText = JSON.stringify({
                    username: username,
                    id: user.id
                });
                res.statusCode = 200;
                res.end(responseText);
            } else {
                res.end("Invalid credentials");
            }
        } else {
            res.end("Invalid credentials");
        }
    });
};

requestManager.signUp = function(req, res){
    var urlWrapper = new urlManager.URL('http://localhost' + req.url);
    var username = urlWrapper.searchParams.get('username');
    var password = urlWrapper.searchParams.get('password');
    var user = new User({user_name: username, password: password});

    user.save(function(err, user) {
        if(err){
            res.statusCode = 409;
            res.end();
        } else {
            res.end(JSON.stringify({
                username: username,
                id: user.id
            }));
        }
    });
};

requestManager.getCreatedTexts = function (req, res) {
    Text.find({}, function(err, texts) {
        var textMap = {};
        texts.forEach(function (text) {
            textMap[text._id] = text;
        });
        res.end(JSON.stringify(textMap));
    });
};

requestManager.getUsers = function (req, res) {
    User.find({}, function(err, users) {
        var usersForRes = users.map(function (item) {
            return {
                id: item.id,
                username: item.user_name
            }
        });
        res.statusCode = 200;
        res.end(JSON.stringify(usersForRes));
    });
};

requestManager.saveText = function (req, res, body) {
    var now = new Date();
    var text = new Text({
        title: body.title,
        creator_id: body.creatorId});

    text.save(function (err, persistedText) {
        if(err){
            res.statusCode = 500;
            res.end("Error : can't save new text");
        } else {
            var encryptInput = {
                text: body.text,
                numshares: body.holders.length,
                threshold: body.holders.length,
                usersId: body.holders
            };
            var shares = encryptor.makeShares(encryptInput);
            var usersShares = shares.users.map(function (item) {
                var userShare = JSON.stringify(item.shares);
                return new UserTextShare({
                    text_id: persistedText.id,
                    user_id: item.usersId,
                    share: userShare
                })
            });
            UserTextShare.create(usersShares, function (err, persistedUserShares) {
                res.statusCode = 200;
                res.end();
            });
            //shares.users[0].shares[0][0][1] //new BigInteger([3,2,1], -1)
        }
    });
};

module.exports = requestManager;