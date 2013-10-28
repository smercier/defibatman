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
//    >     $  NODE_ENV=prod nodemon app.js
//    > Pour partir le serveur en mode dev:
//        >
//    >     $  NODE_ENV=dev nodemon app.js

//Module dependencies  
var  express = require('express')
    ,api =  require('./routes/api') 
    ,auth = require('./routes/auth') 
    ,http = require('http')
    ,path = require('path')
    ,nconf = require('nconf')   
    ,app = express();

//Environments
app.set('port', process.env.PORT || 3000);

//Template Engine [Hogan]
app.engine('hjs',  require('hjs').renderFile);
app.engine('html',  require('hjs').renderFile);
app.set('views', path.join(__dirname, 'views'));

//Middleware Stack
app.use(express.logger('dev'))
   .use(express.json())
   .use(express.urlencoded())
   .use(express.methodOverride())
   .use(express.cookieParser('jhwger98qwehewkjr#$#%^#____'))
   .use(express.session())
    .use(express.favicon('dist/favicon.ico'))
   .use(app.router)
   .use(require('less-middleware')({ src: path.join(__dirname, '/public') }))
   .use(express.static(path.join(__dirname, '/public')))
   .use(express.static(path.join(__dirname, '/dist')))
   .use('/doc',express.static(path.join(__dirname, '/doc')));
// ***

// #####**Multipart/form-data handler**   
// ####(**uploads**)
var upload = function(req, res) {
        var form = new formidable.IncomingForm;
        form.keepExtensions = true;
        form.uploadDir = path.join(__dirname, '/public/uploads');

        form.parse(req, function(err, fields, files){
            if (err) return res.end('You found error');
            //do something with files.image etc
            console.log(files.image);
        });

        form.on('progress', function(bytesReceived, bytesExpected) {
            console.log(bytesReceived + ' ' + bytesExpected);
        });

        form.on('error', function(err) {
            res.writeHead(200, {'content-type': 'text/plain'});
            res.end('error:\n\n'+util.inspect(err));
        });
        res.end('Done');
    };
// ***

// ####**Error Handling**
//    > Terminal:
//        >
//    >     $ NODE_ENV=prod nodemon app.js
    app.use(function(err, req, res, next) {
        //do logging and user-friendly error message display
        console.log(err);
        res
            .set({'Content-Type': 'application/json'})
            .send(err.status, {
                code:err.status,
                msg: err.message,
                status:'err',
                stack:err.stack
            });
        next();
    });
// ***

// ###**404**   
// **End of Middleware Stack**
app.use(function(req, res, next){
    //res.send(404, 'BATMAN 404 !');
    console.log("EOL");
    //Render
    res.send(404,"END OF LINE");
    //res.render('../dist/404.html',{});
});

//app.get('/', express.json(), routes.index);
//app.get('/users', user.list);
//app.post('/images', upload, user.list);
// ***
// ###**Routes**
// ***

// ####**API MAP**
//CRUD
app.get('/api/site/:id', api.get_site_by_id);
app.get('/api/site', api.get_sites);
app.post('/api/site', api.add_site);
app.put('/api/site/:id/:rev', api.add_site);
app.delete('/api/site/:id/:rev', api.delete_site);

//AUTH
app.post('/api/login', auth.login);
app.get('/api/logout', auth.logout);
app.get('/api/admin', auth.admin);
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
// ***

// ###**SERVER UP ^**
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});