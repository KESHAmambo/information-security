var http = require('http');
var fs = require('fs');
var requestManager = require('./libs/requestManager');
var User = require('./models/user').User;

var devMode = true;

http.createServer(function (req, res) {
    if(devMode) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-File-Upload, content-type");
    }

    var apiRequestRegexp = /^\/api\/.*$/;
    if(req.url === '/') {
        sendFile('./ThemeDemoApp/index.html', res);
    } else if(!apiRequestRegexp.test(req.url)) {
        sendViewFile(req, res);
    } else {
        onRequest(req, res);
    }
}).listen(3000);

function sendViewFile(req, res) {
    var pathToViewFile = './ThemeDemoApp' + req.url;
    pathToViewFile = pathToViewFile.slice(0, pathToViewFile.indexOf('?'));
    sendFile(pathToViewFile, res);
}

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


function onRequest(req, res) {
    var requestPath = req.url;
    if (req.url.indexOf('?') > -1) {
        requestPath = req.url.slice(0, req.url.indexOf('?'));
    }

    if(req.method === 'POST') {
        onPostRequest(requestPath, req, res);
    } else if(req.method === 'GET') {
        onGetRequest(requestPath, req, res);
    } else if(req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
    }
}

function onPostRequest(requestPath, req, res) {
    var body = [];
    req.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();
        body = JSON.parse(body);

        switch (requestPath) {
            case '/api/saveText':
                requestManager.saveText(req, res, body);
                break;
            default:
                console.log('Unhandled request url: ', requestPath);
                res.statusCode = 404;
                res.end("End-point not found");
        }
    });

}

function onGetRequest(requestPath, req, res) {
    switch (requestPath) {
        case '/api/signin':
            requestManager.signIn(req, res);
            break;
        case '/api/signup':
            requestManager.signUp(req, res);
            break;
        case '/api/users':
            requestManager.getUsers(req, res);
            break;
        case '/api/createdTexts':
            requestManager.getCreatedTexts(req, res);
            break;
        case '/api/encryptedTexts':
            requestManager.getEncryptedTexts(req, res);
            break;
        default:
            console.log('Unhandled request url: ', requestPath);
            res.statusCode = 404;
            res.end("End-point not found");
    }
}