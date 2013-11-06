// # BATMAN SERVER
// ####**Module dependencies & Environments** 
// > **[ExpressJS](http://expressjs.com/)**  
// > **[nconf](https://npmjs.org/package/nconf)**  
//   
// **Template Engine [Hogan](http://twitter.github.io/hogan.js/)   
// Parse .hjs & .hmtl files only when needed**   
//    
// **Static Directories: /public | /doc**   
//    > Pour partir le serveur en mode prod:
//        >
//    >     $  NODE_ENV=production nodemon app.js
//    > Pour partir le serveur en mode dev:
//        >
//    >     $  NODE_ENV=development nodemon app.js

//Module dependencies  
var  express = require('express')
    ,api =  require('./routes/api') 
    ,auth = require('./routes/auth') 
    ,http = require('http')
    ,path = require('path')
    ,fs = require('fs')
    ,expressWinston = require('express-winston')
    ,winston = require('winston')
    ,logTransports = []
    ,errorsTransports = []
    ,uploadLimit = 5 * 1024 * 1024
    ,expressLogFile = fs.createWriteStream('./logs/server.log', {flags: 'a'})
    ,server
    ,app = express();

app.configure('development',function(){
    console.log('!! DEVELOPMENT MODE !!');
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    
    var logOptions = {
        json: true,
        colorize: true
    };
    logTransports.push(new (winston.transports.Console)(logOptions));
    errorsTransports.push(new (winston.transports.Console)(logOptions));
});

app.configure('production',function(){
    console.log('!! PRODUCTION MODE !!');
    logTransports.push(new (winston.transports.File)({
        filename: './logs/server-production.json'
    }));
    errorsTransports.push(new (winston.transports.File)({
        filename: './logs/server-errors.json'
    }));
});

//Environments
app.set('port', process.env.PORT || 3000);

//Template Engine [Hogan]
app.engine('hjs',  require('hjs').renderFile);
app.engine('html',  require('hjs').renderFile);
app.set('views', path.join(__dirname, 'views'));

//DEBUG ONLY
consoleHeaders = function(req, res, next){

        console.log("**********");
        console.log("** "+ req.get('content-type') +" **");
        console.log("** "+ req.get('Content-Type') +" **");
        console.log("**********");  
    next();
}

//Middleware Stack
app.use(express.logger({stream: expressLogFile}))
   .use(express.json({limit:uploadLimit}))
   .use(express.urlencoded())
   //.use(consoleHeaders)
   .use(express.methodOverride())
   .use(express.cookieParser('jhwger98qwehewkjr#$#%^#____'))
   .use(express.session())
   .use(express.favicon('dist/favicon.ico'))
   .use(expressWinston.logger({transports: logTransports }))
   .use(app.router)
   .use(require('less-middleware')({ src: path.join(__dirname, '/public') }))
   .use(express.static(path.join(__dirname, '/public')))
   .use(express.static(path.join(__dirname, '/dist')))
   .use('/doc',express.static(path.join(__dirname, '/doc')))
   .use(expressWinston.errorLogger({transports: errorsTransports }));
// ***

// ####**Error Handling**
app.use(function(err, req, res, next) {
    //do logging and user-friendly error message display
    console.log("*****************");
    console.log(err);
    if(err.status){
        console.log("*################");
        //res.set({'Content-Type': 'application/json'});
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = err.status;
        res.end(JSON.stringify({
                code:err.status,
                msg: err.message,
                status:'err',
                stack:err.stack
            }));
    }
});
// ***

// ###**404**   
// **End of Middleware Stack**
app.use(function(req, res, next){
    //res.send(404, 'BATMAN 404 !');
    console.log("404 EOL");
    //Render
    //var accept = req.get()
    
    if( req.get('content-type') == 'application/json'){
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({
            code:404,
            msg: "URI non disponible.",
            status:'err'
        }));
    }else{
        //res.send(404,"END OF LINE [404]");
        //res.statusCode = 404;
        res.render('../dist/404.html',{});
    }
});

// ***
// ###**Routes**
// ***

// ####**API MAP**
//CRUD
app.get('/api/site/:id', api.get_site_by_id);
app.get('/api/site', api.get_sites);
app.get('/api/site_open', api.get_sites_open);
app.post('/api/site', api.add_site);
app.put('/api/site/:id/:rev', api.update_site);
app.delete('/api/site/:id/:rev', api.delete_site);

//AUTH
app.post('/api/login', auth.login);
app.get('/api/logout', auth.logout);
app.get('/api/admin', auth.admin);
app.get('/api/status', auth.status);
// ***

// ####**/ aka HOME (GET)**
app.get('/', function(req,res){
    
    var fs = require('fs'),
        file = __dirname+ '/dist/app.html';
    console.log(__dirname+ '/dist/app.html');

    fs.exists(file, function(exists) {
        if (exists) {
            res.render('../dist/app.html',{
                title: '^^ö^^',
                version: '0.0.1',
                base: '/'
            });
        } else {
            res.send(200, 'Generate your FrontEnd Build > should be in /dist');
        }
    });
});
// ***

// ####**/error TEST LOG**
app.get('/error', function(req, res, next) {
    // here we cause an error in the pipeline so we see express-winston in action.
    return next(new Error("This is an error and it should be logged to the console"));
});
// ***
// ***

// ###**SERVER UP ^**
//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});

function start() {
    //routes.setup(app, handlers);
    var port = process.env.PORT || 3000;
    server = app.listen(port);
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
}

function stop() {
    server.close();
    //process.exit(1);
}

// *******************************************************
exports.start = start;
exports.stop = stop;
exports.app = app;