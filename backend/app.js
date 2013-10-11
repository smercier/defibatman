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
app.use("/public",ecstatic({ root: __dirname + '/public' }));
app.use("/doc",ecstatic({ root: __dirname + '/doc' }));
app.use("/app",ecstatic({ root: __dirname + '/app' }));

//Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
// ***

// ## API

// ### /api/site/:id
// ### Site By ID // Endpoint (GET)
// > 'Content-Type': 'application/json'
app.get('/api/site/:id', function (req, res) {
    var auth = req.cookies['AuthSession'],
        batman,
        siteId;

    res.set({'Content-Type': 'application/json'});

    //Auth Check
    if (!auth) { res.send(401, '{"status":"err","code":401,"msg":"Unauthorized."}'); return; }

    batman = require('nano')({ url : 'http://localhost:5984/batman', cookie: 'AuthSession=' + auth });

    siteId = req.params['id'] || 'null';
    batman.get(siteId, {}, function(err, body) {
        if (err) { res.send(401, '{"status":"err","code":401,"msg":"' + err.reason + '"}'); return; }
        console.log(body);
        res.send(200, body);
    });

//    > Exemple de output (401):
//        >
//    >     $ {
//    >         "status": "err",
//    >            "code": 401,
//    >             "msg": "Unauthorized."
//    >     }
//    > Exemple de output (200)
//    > api/site/55014ad9ce38169d296773554e001f48
//        >
//    >     $ {
//    >         "_id": "55014ad9ce38169d296773554e001f48",
//    >         "_rev": "4-d3a4803abd4cbbf13dfdef2efe7b0f72",
//    >         "type": "Feature",
//    >         "geometry": {
//    >             "type": "Point",
//    >             "coordinates": [-73.5716, 45.52716]
//    >         },
//    >         "properties": {
//    >             "type": "cs:observation",
//    >             "site_structure": "Nichoir",
//    >             "site_habitat": "Parc",
//    >             "obs_nom": "Steflef",
//    >             "obs_adresse": "52 Sherbrooke",
//    >             "obs_ville": "Montréal",
//    >             "obs_codepostal": "G6H 4R6",
//    >             "obs_telephone": "418-444-5555",
//    >             "obs_courriel": "prof_lebrun@gmail.com",
//    >             "prop_nom": null,
//    >             "prop_adresse": null,
//    >             "prop_ville": null,
//    >             "prop_codepostal": null,
//    >             "prop_telephone": null,
//    >             "prop_courriel": null,
//    >             "id_user": "prof_lebrun@gmail.com",
//    >             "mat_photo": null,
//    >             "created_at": "2013/05/25 06:10:40 +0000"
//    >         }
//    >     }
});
// ***

// ### /api/site [list]
// ### List All Sites // Endpoint (GET)
// > 'Content-Type': 'application/json'
app.get('/api/site/',function(req, res){

    var auth = req.cookies['AuthSession'],
        batman,
        features = [];

    res.set({'Content-Type': 'application/json'});

    //Auth Check
    if (!auth) { res.send(401, '{"status":"err","code":401,"msg":"Unauthorized."}'); return; }

    batman = require('nano')({ url : 'http://localhost:5984/batman', cookie: 'AuthSession=' + auth });

    batman.view('cs_sites', 'all', function(err, body) {
        if (err) { res.send(401, '{"status":"err","code":401,"msg":"' + err.reason + '"}'); return; }

        body.rows.forEach(function(doc) {
            console.log(doc.value);
            features.push(doc.value);
        });
        res.send(200, features);
    });

//    > Exemple de output (401):
//        >
//    >     $ {
//    >         "status": "err",
//    >            "code": 401,
//    >             "msg": "Unauthorized."
//    >     }
//    > Exemple de output (200):
//        >
//    >     $ [{
//    >         "_id": "55014ad9ce38169d296773554e000aef",
//    >             "_rev": "1-b3d9e9b4e789ed8c69ff9c3e6d378c44",
//    >             "type": "Feature",
//    >             "geometry": {
//    >             "type": "Point",
//    >                 "coordinates": [-73.5716, 45.52716]
//    >         },
//    >         "properties": {
//    >             "type": "cs:observation",
//    >                 "site_structure": "Nichoir",
//    >                 "site_habitat": "Parc",
//    >                 "obs_nom": "Steflef",
//    >                 "obs_adresse": "52 Sherbrooke",
//    >                 "obs_ville": "Montréal",
//    >                 "obs_codepostal": "G6H 4R6",
//    >                 "obs_telephone": "418-444-5555",
//    >                 "obs_courriel": "prof_lebrun@gmail.com",
//    >                 "prop_nom": null,
//    >                 "prop_adresse": null,
//    >                 "prop_ville": null,
//    >                 "prop_codepostal": null,
//    >                 "prop_telephone": null,
//    >                 "prop_courriel": null,
//    >                 "id_user": "prof_lebrun@gmail.com",
//    >                 "mat_photo": null
//    >         }
//    >     },
//    >     ...
//    >     ]
});
// ***

// ### /api/site
// ### Create a New Site // Endpoint (POST)
// ##### Autocreate _id
// JSON
app.post('/api/site',function(req, res){

    var auth = req.cookies['AuthSession'],
        batman,
        feature;

    req.accepts('application/json');
    console.log(req.body);
    if (!req.body.site) {res.send(401, '{"status":"err","code":401,"msg":"Aucun document site."}'); return; }
    console.log(req.body.site);
    feature = req.body.site;

    res.set({'Content-Type': 'application/json'});

    //Auth Check
    if (!auth) { res.send(401, '{"status":"err","code":401,"msg":"Unauthorized."}'); return; }

    batman = require('nano')({ url : 'http://localhost:5984/batman', cookie: 'AuthSession=' + auth });

    // TODO VÉRIFICATION DES DONNÉES

    batman.insert(feature, null, function(err, body) {
        if (err) { res.send(401, '{"status":"err","code":401,"msg":"' + err.reason + '"}'); return; }

        console.log(body);
        res.send(200, body);
    });

//    > Exemple de output (401):
//        >
//    >     $ {
//    >         "ok":  false,
//    >         "err": "Unauthaurized User",
//    >       };
//    > Exemple de output (200):
//        >
//    >     $ {
//    >         "ok": true,
//    >         "id": "55014ad9ce38169d296773554e001f48",
//    >         "rev": "4-d3a4803abd4cbbf13dfdef2efe7b0f72"
//    >       };
});
// ***


// ### /api/site/:id/:rev
// ### Edit a Site // Endpoint (PUT)
// *A new revision ... as per CouchDB*
// > 'Content-Type': 'application/json'
app.put('/api/site/:id/:rev',function(req, res){

    var auth = req.cookies['AuthSession'],
        batman,
        feature,
        _id = req.params['id'] || 'null',
        _rev = req.params['rev'] || 'null';

    req.accepts('application/json');
    res.set({'Content-Type': 'application/json'});

    //Body Check
    if (!req.body.site) { res.send(401, '{"status":"err","code":401,"msg":"Aucun document."}'); return; }
    console.log("Feature:");
    console.log(req.body.site);
    feature = req.body.site;

    //Auth Check
    if (!auth) { res.send(401, '{"status":"err","code":401,"msg":"Unauthorized."}'); return; }

    batman = require('nano')({ url : 'http://localhost:5984/batman', cookie: 'AuthSession=' + auth });

    // TODO VÉRIFICATION DES DONNÉES
    feature._rev = _rev;
    feature._id =  _id;

    batman.insert(feature, _id, function(err, body) {

        console.log(body);
        console.log(err);

        if (err) { res.send(401, '{"status":"err","code":401,"msg":"' + err.reason + '"}'); return; }

        console.log(body);

        //Augmenting res
        body.code = 200;
        body.status = "ok";

        res.send(200, body);
    });

//    > Exemple de output (401):
//        >
//    >     $ {
//    >         "status": "err",
//    >            "code": 401,
//    >             "msg": "Conflict."
//    >     }
//    > Exemple de output (200):
//        >
//    >     $ {
//    >         "status": "ok",
//    >           "code": 200,
//    >             "ok": true,
//    >             "id": "55014ad9ce38169d296773554e001f48",
//    >            "rev": "4-d3a4803abd4cbbf13dfdef2efe7b0f72"
//    >       };
});
// ***

// ### /api/site/:id/:rev
// ### Delete a Site // Endpoint (DELETE)
// *Delete a revision of a doc ... as per CouchDB*
app.delete('/api/site/:id/:rev',function(req, res){

    var auth = req.cookies['AuthSession'],
        batman,
        _id = req.params['id'] || 'null',
        _rev = req.params['rev'] || 'null';

    res.set({'Content-Type': 'application/json'});

    //Auth Check
    if (!auth) { res.send(401, '{"status":"err","code":401,"msg":"Unauthorized."}'); return; }
    batman = require('nano')({ url : 'http://localhost:5984/batman', cookie: 'AuthSession=' + auth });

    batman.destroy(_id, _rev, function(err, body) {
        if (err) { res.send(401, '{"status":"err","code":401,"msg":"' + err.reason + '"}'); return; }

        console.log(body);

        //Augmenting res
        body.code = 200;
        body.status = "ok";

        res.send(200, body);
    });

//    > Exemple de output (200):
//        >
//    >     $ {
//    >         "status": "ok",
//    >           "code": 200,
//    >             "ok": true,
//    >             "id": "55014ad9ce38169d296773554e001f48",
//    >            "rev": "4-d3a4803abd4cbbf13dfdef2efe7b0f72"
//    >       };
});
// ***

// ### /api/login
// ### Login // Endpoint (POST)
// > 'Content-Type': 'application/json'
app.post('/api/login', function (req, res) {

    var nano = require('nano')('http://localhost:5984'),
        username = req.body.username || 'null',
        userpass = req.body.userpass || 'null',
        role;

    res.set({
        'Content-Type': 'application/json'
    });

    nano.request({
            method: "POST",
            db: "_session",
            form: { name: username, password: userpass },
            content_type: "application/x-www-form-urlencoded; charset=utf-8"
        },
        function (err, body, headers) {
            if (err) { res.send(401, '{"status":"err","code":401,"msg":"' + err.reason + '"}'); return; }

            //Send CouchDB's cookie right on through to the client
            // *The CouchDB cookie name is AuthSession*
            if (headers && headers['set-cookie']) {
                res.cookie(headers['set-cookie']);
            }

            console.log(body);
            //Augmenting res with roles.
            res.send(200, '{"status":"ok","code":200,"msg":"LOGGED_IN","role":'+ JSON.stringify( body.roles ) +'}');
        });

//    > Exemple de output (401):
//        >
//    >     $ {
//    >         "status": "err",
//    >            "code": 401,
//    >             "msg": "Name or password is incorrect."
//    >     }
//    > Exemple de output (200):
//        >
//    >     $ {
//    >         "status": "ok",
//    >           "code": 200,
//    >            "msg": "LOGGED_IN"
//    >     }
});
// ***

// ### /api/logout
// ### Logout // Endpoint (GET)
app.get('/api/logout', function (req, res) {
    // *The CouchDB cookie name is AuthSession*
    res.set({
        'Content-Type': 'application/json'
    });
    res.clearCookie('AuthSession');
    res.send(200, '{"status":"ok","code":200,"msg":"LOGGED_OUT"}');


//    > Exemple de output (200):
//        >
//    >     $ {
//    >         "status": "ok",
//    >           "code": 200,
//    >            "msg": "LOGGED_OUT"
//    >     }
});
// ***

// ### /api/admin
// ### Administartion // Endpoint (GET)
// #### TODO
app.get('/api/admin', function (req, res) {

    var auth = req.cookies['AuthSession'],
        batman;

    req.accepts('application/json');
    res.set({'Content-Type': 'application/json'});

    //Auth Check
    if (!auth) { res.send(401, '{"status":"err","code":401,"msg":"Unauthorized."}'); return; }

    //Role Check
    //Check with stored role or with a _session on CouchDB
    //TODO
});
// ***
// ***

// ## DYNAMIC CONTENT VIA TEMPLATING (MUSTACHE)

// ### /admin (GET)
// ### Show Admin UI
// #### TODO
app.get('/admin', function(req,res){
    res.send(200, 'TODO');
});
// ***

// ### / aka HOME (GET)
// ### Show Main UI
// #### TODO
app.get('/', function(req,res){
    res.send(200, 'TODO HOME SWEET HOME');
});
// ***


// ## SERVER UP ^^
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});