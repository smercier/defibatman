// # BATMAN SERVER
// ### NODEJS backend supporting the API.

//Requirements
var express = require('express');
var ecstatic = require('ecstatic');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();

//Environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('jhwger98qwehewkjr#$#%^#____'));
app.use(express.session());
app.use(app.router);

//Static Servers
app.use("/app",ecstatic({ root: __dirname + '/app' }));

//Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
// ***

// ## SERVER UP ^^
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});