var urlManager = require('url');
var mongoose = require('../libs/mongoose');
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
                res.statusCode = 403;
                res.end("Invalid credentials");
            }
        } else {
            res.statusCode = 403;
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
    var urlWrapper = new urlManager.URL('http://localhost' + req.url);
    var userId = urlWrapper.searchParams.get('userId');

    Text.find({creator_id: userId}, function(err, texts) {
        var textsCount = texts.length;
        if(textsCount > 0) {
            var createdTexts = [];
            texts.forEach(function (text) {
                UserTextShare.find({text_id: text.id}, function(err, usersShares) {
                    var userHasShare = usersShares.some(function(item) {
                        return item.user_id === userId;
                    });
                    var confirmed = usersShares.filter(function(item) {
                        return item.permission;
                    }).length;
                    createdTexts.push({
                        textId: text.id,
                        title: text.title,
                        creationDate: text.creation_date,
                        decodingDate: text.decryption_date,
                        keepers: usersShares.length,
                        confirmed: confirmed,
                        share: userHasShare
                    });

                    textsCount--;
                    if(textsCount === 0) {
                        res.end(JSON.stringify(createdTexts));
                    }
                })
            });
        } else {
            res.end(JSON.stringify([]));
        }
    });
};

requestManager.getEncryptedTexts = function(req, res) {
    var urlWrapper = new urlManager.URL('http://localhost' + req.url);
    var userId = urlWrapper.searchParams.get('userId');

    UserTextShare.find({user_id: userId}, function(err, userShares) {
        var textsPermissions = [];
        var textsIds = [];
        userShares.forEach(function(item) {
            textsPermissions.push({
                textId: item.text_id,
                permission: item.permission
            });
            textsIds.push(new ObjectID(item.text_id));

            var textsCount = textsIds.length;
            if(textsCount > 0) {
                Text.where('_id').in(textsIds).exec(function(err, texts) {
                    // counter to react only on one callback(callbacks are for each found item)
                    textsCount--;
                    if(textsCount === 0) {
                        var encryptedTexts = [];
                        texts = texts.filter(function(item) {
                            return !item.decryption_date;
                        });
                        textsCount = texts.length;
                        texts.forEach(function (text) {
                            UserTextShare.find({text_id: text.id}, function(err, usersShares) {
                                var userSelfPermission = usersShares.some(function(item) {
                                    return (item.user_id === userId && item.permission);
                                });
                                var confirmed = usersShares.filter(function(item) {
                                    return item.permission;
                                }).length;
                                encryptedTexts.push({
                                    textId: text.id,
                                    title: text.title,
                                    creationDate: text.creation_date,
                                    keepers: usersShares.length,
                                    confirmed: confirmed,
                                    permission: userSelfPermission
                                });

                                textsCount--;
                                if(textsCount === 0) {
                                    res.end(JSON.stringify(encryptedTexts));
                                }
                            })
                        });
                    }
                })
            } else {
                res.end(JSON.stringify([]));
            }
            // Text.find({_id: {'$in': textsIds}}, function(err, texts) {
            //
            //     res.end(JSON.stringify([]));
            // })
        })
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
        creator_id: body.creatorId
    });

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