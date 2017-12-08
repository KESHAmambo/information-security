var urlManager = require('url');
var User = require('../models/users').User;
var Text = require('../models/texts').Text;
var UserPermissions = require('../models/user_permission').UserPermissions;

function RequestManager() {};

var requestManager = new RequestManager();
var urlWrapper;
var username;
var password;

requestManager.signIn = function(req, res){
    urlWrapper = new urlManager.URL('http://localhost' + req.url);
    username = urlWrapper.searchParams.get('username');
    password = urlWrapper.searchParams.get('password');
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
    urlWrapper = new urlManager.URL('http://localhost' + req.url);
    username = urlWrapper.searchParams.get('username');
    password = urlWrapper.searchParams.get('password');
    var user = new User({user_name: username, password: password});

    user.save(function(err, result) {
        if(err){
            res.end("Error : can't save new user");
        } else {
            res.end("Successful registration!");
        }
    });
};

requestManager.createdTexts = function (req, res) {
    Text.find({}, function(err, texts) {
        var textMap = {};
        texts.forEach(function (text) {
            textMap[text._id] = text;
        });
        res.end(JSON.stringify({textMap}));
    });
};

requestManager.saveText = function (req, res) {
    urlWrapper = new urlManager.URL('http://localhost' + req.url);
    var now = new Date();
    var text = new Text({title: urlWrapper.searchParams.get('title'), creator_id: urlWrapper.searchParams.get('creator_id'), creation_date: now});
    text.save(function (err, result) {
        if(err){
            res.end("Error : can't save new text");
        } else {
            res.end("Add new text: ", text.id);
        }
    });
}

module.exports = requestManager;