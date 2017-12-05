var urlManager = require('url');
var User = require('../models/users').User;

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
            res.end("Error :c an't save new user");
        } else {
            res.end("Successful registration!");
        }
    });
};

module.exports = requestManager;