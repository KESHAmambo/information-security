var urlManager = require('url');
var User = require('../models/users').User;

function RequestManager() {};

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
                res.end(responseText);
            } else {
                res.end("Invalid credentials");
            }
        } else {
            res.end("Invalid credentials");
        }
    });
};

module.exports = requestManager;