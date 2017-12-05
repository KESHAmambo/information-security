var http = require('http');
var fs = require('fs');
var requestManager = require('./libs/requestManager');
var User = require('./models/users').User;

http.createServer(function (req, res) {
    var viewReg = /^\/api\/.*$/;
    if(req.url === '/') {
        sendFile('./ThemeDemoApp/index.html', res);
    } else if(!viewReg.test(req.url)) {
        var pathToViewFile = './ThemeDemoApp' + req.url;
        pathToViewFile = pathToViewFile.slice(0, pathToViewFile.indexOf('?'));
        sendFile(pathToViewFile, res);
    } else {
        console.log('backend-request: ', req.url);
        var requestPath = req.url.slice(0, req.url.indexOf('?'));

        var responseText;
        switch (requestPath) {
            case '/api/signin':
                requestManager.signIn(req, res);
                break;
            case '/api/signup':
                requestManager.signUp(req, res);
                break;
            default:
                console.log('Unhandled request url: ', requestPath);
                res.statusCode = 404;
                res.end("Default not found");
         }
    }
}).listen(3000);

function sendFile(fileName, res) {
    var fileStream = fs.createReadStream(fileName);
    fileStream
        .on('error', function() {
            res.statusCode = 500;
            res.end("Server error");
        })
        .pipe(res)
        .on('close', function() {
            fileStream.destroy();
        });
}