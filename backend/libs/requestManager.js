var urlManager = require('url');
var mongoose = require('../libs/mongoose');
var ObjectID = require('mongodb').ObjectID;
var User = require('../models/user').User;
var Text = require('../models/text').Text;
var UserTextShare = require('../models/userTextShare').UserTextShare;
var encryptor = require('../libs/encryption/encrypt');
var BigInteger = require('../libs/encryption/biginteger');

/**
 * @type {Array}
 * contains objects:
 * {
 *      userId,
 *      userTextShare,
 *      res
 * }
 */
var onlineUsers = [];

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

requestManager.addUserToOnlineUsers = function (req, res) {
    var urlWrapper = new urlManager.URL('http://localhost' + req.url);
    var userId = urlWrapper.searchParams.get('userId');
    var username = urlWrapper.searchParams.get('username');

    var onlineUser = {
        userId: userId,
        username: username,
        res: res
    };
    req.on('close', function() {
        var userIndex = onlineUsers.indexOf(onlineUser);
        onlineUsers.splice(userIndex, 1);
    });

    onlineUsers.forEach(function(item, index) {
        if(item.userId === userId) {
            onlineUsers.splice(index, 1);
            console.log('There was a duplicate for online user id=' + userId);
        }
    });
    onlineUsers.push(onlineUser);
};

requestManager.getOnlineUsers = function (req, res) {
    var publicOnlineUsers = onlineUsers.map(function(item) {
        return {
            userId: item.userId,
            username: item.username
        }
    });
    res.statusCode = 200;
    res.end(JSON.stringify(publicOnlineUsers));
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
                        sortTexts(createdTexts);
                        res.end(JSON.stringify(createdTexts));
                    }
                })
            });
        } else {
            res.end(JSON.stringify([]));
        }
    });
};

requestManager.getDecryptedTexts = function(req, res) {
    var urlWrapper = new urlManager.URL('http://localhost' + req.url);
    var userId = urlWrapper.searchParams.get('userId');

    UserTextShare.find({user_id: userId}, function (err, userShares) {
        if (userShares.length > 0) {
            var decryptedTextIds = [];
            userShares.forEach(function (item) {
                decryptedTextIds.push(new ObjectID(item.text_id));
                var textsCount = decryptedTextIds.length;
                Text.where('_id').in(decryptedTextIds).exec(function (err, texts) {
                    textsCount--;
                    if (textsCount === 0) {
                        var decryptedTexts = texts.filter(function(item) {
                            return !!item.decryption_date;
                        });
                        decryptedTexts = decryptedTexts.map(function(item) {
                            return {
                                textId: item.id,
                                title: item.title,
                                creator: item.creator,
                                creationDate: item.creation_date,
                                decryptionDate: item.decryption_date
                            }
                        });
                        sortTexts(decryptedTexts);
                        res.end(JSON.stringify(decryptedTexts));
                    }
                });
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
        if(userShares.length > 0) {
            var textsPermissions = [];
            var textsIds = [];
            userShares.forEach(function(item) {
                textsPermissions.push({
                    textId: item.text_id,
                    permission: item.permission
                });
                textsIds.push(new ObjectID(item.text_id));

                var textsCount = textsIds.length;
                Text.where('_id').in(textsIds).exec(function(err, texts) {
                    // counter to react only on one callback(callbacks are for each found item)
                    textsCount--;
                    if(textsCount === 0) {
                        var encryptedTexts = [];
                        texts = texts.filter(function(item) {
                            return !item.decryption_date;
                        });
                        textsCount = texts.length;
                        if(textsCount > 0) {
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
                                        creator: text.creator,
                                        creationDate: text.creation_date,
                                        keepers: usersShares.length,
                                        confirmed: confirmed,
                                        permission: userSelfPermission
                                    });

                                    textsCount--;
                                    if(textsCount === 0) {
                                        sortTexts(encryptedTexts);
                                        res.end(JSON.stringify(encryptedTexts));
                                    }
                                })
                            });
                        } else {
                            res.end(JSON.stringify([]));
                        }
                    }
                });
            });
        } else {
            res.end(JSON.stringify([]));
        }
    });
};

requestManager.withdrawTextKey = function (req, res) {
    var urlWrapper = new urlManager.URL('http://localhost' + req.url);
    var userId = urlWrapper.searchParams.get('userId');
    var textId = urlWrapper.searchParams.get('textId');

    UserTextShare.findOne({user_id: userId, text_id: textId}, function(err, userShare) {
        var userPrivateTextKey = userShare.share;
        userShare.key_withdrawn = true;
        userShare.permission = false;
        userShare.share = 'withdrawn';
        userShare.save(function(err, userShare) {
            res.end(JSON.stringify({
                share: userPrivateTextKey
            }));
        });
    });
};

requestManager.returnTextKey = function(req, res, body) {
    Text.findOne({_id: body.textId}, function(err, text) {
        if(text.decryption_date) {
            res.statusCode = 409;
            res.end();
        } else {
            UserTextShare.findOne({user_id: body.userId, text_id: body.textId}, function(err, userShare) {
                userShare.permission = true;
                userShare.share = body.share;
                UserTextShare.find({text_id: body.textId}, function(err, usersShares) {
                    var permissions = usersShares.filter(function(item) {
                        return item.permission;
                    }).length;
                    // (permissions + 1) due to current permission has not yet been saved
                    if((permissions + 1) === usersShares.length) {
                        text.decryption_date = Date.now();
                        text.save(function(err, text) {
                            userShare.save(function(err, userShare) {
                                res.end();
                            });
                        });
                    } else {
                        userShare.save(function(err, userShare) {
                            res.end();
                        });
                    }
                })
            });
        }
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
        creator_id: body.creatorId,
        creator: body.username
    });

    text.save(function (err, persistedText) {
        if(err){
            res.statusCode = 500;
            res.end("Error : can't save new text");
        } else {
            sortHolders(body.holders);
            var encryptInput = {
                text: body.text,
                numshares: body.holders.length,
                threshold: body.holders.length,
                usersId: body.holders
            };
            var shares = encryptor.makeShares(encryptInput);
            var usersShares = shares.users.map(function (holder) {
                var userShare = JSON.stringify(holder.shares);
                var onlineUser = onlineUsers.find(function(onlineUser) {
                    return holder.userId === onlineUser.userId;
                });
                onlineUser.res.end(JSON.stringify({
                    share: userShare,
                    title: body.title
                }));
                return new UserTextShare({
                    text_id: persistedText.id,
                    user_id: holder.userId,
                    share: 'withdrawn'
                });
            });
            UserTextShare.create(usersShares, function (err, persistedUserShares) {
                res.statusCode = 200;
                res.end();
            });
        }
    });
};

requestManager.getTextsCount = function(req, res) {
    var urlWrapper = new urlManager.URL('http://localhost' + req.url);
    var section = urlWrapper.searchParams.get('section');
    var userId = urlWrapper.searchParams.get('userId');
    switch(section) {
        case 'decrypted':
            countTexts(userId, res, function(item) {
                return !!item.decryption_date;
            });
            break;
        case 'encrypted':
            countTexts(userId, res, function(item) {
                return !item.decryption_date;
            });
            break;
        case 'created':
            Text.find({creator_id: userId}, function(err, texts) {
                res.end(JSON.stringify({
                    count: texts.length
                }));
            });
            break;
        default:
            res.statusCode = 400;
            res.end('Unknown section name: ' + section);
    }
};

requestManager.getTextDecryptedValue = function(req, res) {
    var urlWrapper = new urlManager.URL('http://localhost' + req.url);
    var textId = urlWrapper.searchParams.get('textId');
    Text.findById(textId, function(err, text) {
        if(!text) {
            res.statusCode = 400;
            res.end('No text with this id exists!');
        } else if(!text.decryption_date) {
            res.statusCode = 400;
            res.end('Text is not yet allowed to be decrypted!');
        } else {
            UserTextShare.find({text_id: textId}, function(err, usersShares) {
                var decryptPayload = {
                    numshares: usersShares.length,
                    users: []
                };
                sortUsersShares(usersShares);
                usersShares.forEach(function(item) {
                    try {
                        var sharesByLettersCount = JSON.parse(item.share);
                    } catch (e) {
                        // No error message is needed here because we try to decrypt text after for loop
                        // and if here was invalid share, decryption will throw exception
                        return;
                    }
                    sharesByLettersCount.forEach(function(sharedDividedByUsersCount) {
                        sharedDividedByUsersCount.forEach(function(item) {
                            var parsedBigInt = item[1];
                            item[1] = new BigInteger(parsedBigInt._d, parsedBigInt._s);
                            //shares.users[0].shares[0][0][1] //new BigInteger([3,2,1], -1)
                        })
                    });
                    decryptPayload.users.push({
                        shares: sharesByLettersCount
                    });
                });

                try {
                    var decryptedText = encryptor.decrypt(decryptPayload);

                    res.end(JSON.stringify({
                        text: decryptedText
                    }))
                } catch (e) {
                    res.statusCode = 403;
                    res.end();
                }
            });
        }
    })
};

function countTexts(userId, res, textCheckFunction) {
    UserTextShare.find({user_id: userId}, function (err, userShares) {
        if (userShares.length > 0) {
            var decryptedTextIds = [];
            userShares.forEach(function (item) {
                decryptedTextIds.push(new ObjectID(item.text_id));
                var textsCount = decryptedTextIds.length;
                Text.where('_id').in(decryptedTextIds).exec(function (err, texts) {
                    textsCount--;
                    if (textsCount === 0) {
                        var suitableTextsCount = texts.filter(textCheckFunction).length;
                        res.end(JSON.stringify({
                            count: suitableTextsCount
                        }))
                    }
                });
            });
        } else {
            res.end(JSON.stringify({
                count: 0
            }));
        }
    });
}

function sortTexts(texts) {
    texts.sort(function(t1, t2) {
        if (t1.creationDate > t2.creationDate) {
            return -1;
        }
        if (t1.creationDate < t2.creationDate) {
            return 1;
        }
        return 0;
    });
}

function sortHolders(holders) {
    holders.sort(function(h1, h2) {
        if (h1.userId > h2.userId) {
            return -1;
        }
        if (h1.userId < h2.userId) {
            return 1;
        }
        return 0;
    });
}

function sortUsersShares(usersShares) {
    usersShares.sort(function(h1, h2) {
        if (h1.user_id > h2.user_id) {
            return -1;
        }
        if (h1.user_id < h2.user_id) {
            return 1;
        }
        return 0;
    });
}

module.exports = requestManager;