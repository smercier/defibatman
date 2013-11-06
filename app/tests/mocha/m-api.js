var http = require('http');
var should = require('should');

var app  = require(__dirname + '/../server.js');
var port = 3333;
var sessionCookie = null;


function defaultGetOptions(path) {
    var options = {
        "host": "localhost",
        "port": port,
        "path": path,
        "method": "GET",
        "headers": {
            "Cookie": sessionCookie
        }
    };
    return options;
}

describe('app', function () {

//    before (function (done) {
//        app.listen(port, function (err, result) {
//            if (err) {
//                done(err);
//            } else {
//                done();
//            }
//        });
//    });    
//
//    after(function (done) {
//        app.close();
//    });
    before (function (done) {
        app.start();
        done();
    });

    after(function (done) {
        app.stop();
        done();
    });
    it('should exist', function (done) {
        should.exist(app);
        done();
    });

    it('should be listening at localhost:3000', function (done) {
        //var headers = defaultGetOptions('/');
        http.get('http://localhost:3000/', function (res) {
            res.statusCode.should.eql(200);
            done();
        });
    });

});