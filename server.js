
var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var read = require('./read');

var root = path.resolve(process.argv[2] || '.');

console.log('Static root dir: ' + root);

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var filepath = path.join(root, pathname);
    read.analyseFile(filepath, request, response);
});
server.listen(8080);
console.log('Server is running at http://127.0.0.1:8080/');
