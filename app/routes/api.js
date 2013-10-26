// # API BATMAN   
// ***

// ####**/api/site/:id** (**GET**) [**JSON**] 
// ###Site By ID   
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
exports.get_site_by_id = function (req, res) {
    var auth = req.cookies['AuthSession'],
        batman,
        siteId;

    res.set({'Content-Type': 'application/json'});

    //Auth Check
    if (!auth) { res.send(401, '{"status":"err","code":401,"msg":"Unauthorized."}'); return; }

    batman = require('nano')({ url : 'http://localhost:5984/batman', cookie: 'AuthSession=' + auth });

    siteId = req.params['id'] || 'null';
    batman.get(siteId, {}, function(err, body) {

        if (err) {
            var output = {
                status: "err",
                code: 401,
                msg: err.reason
            };
            res.send(401, output);
            return;
        }
        console.log(body);
        res.send(200, body);
    });
};
// ***

// ####**/api/site** (**GET**) [**JSON**] 
// ### List Sites
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
exports.get_sites = function(req, res){

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
};
// ***

// ####**/api/site** (**POST**) [**JSON**] 
// ### Create a New Site
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
exports.add_site =function(req, res){

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

    console.log(auth);
    // TODO VÉRIFICATION DES DONNÉES
    //Complete Feature infos
    feature.properties.created_at = Date.now();

    batman.insert(feature, null, function(err, body) {
        if (err) { res.send(401, '{"status":"err","code":401,"msg":"' + err.reason + '"}'); return; }

        console.log(body);
        res.send(200, body);
    });
};
// ***

// ####**/api/site/:id/:rev** (**PUT**) [**JSON**] 
// ### Update a Site  
// *A new revision ... as per CouchDB*
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
exports.update_site = function(req, res){
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
};
// ***

// ####**/api/site/:id/:rev** (**DELETE**) [**JSON**] 
// ### Delete a Site  
// *Delete a revision of a doc ... as per CouchDB*  
//    > Exemple de output (200):
//        >
//    >     $ {
//    >         "status": "ok",
//    >           "code": 200,
//    >             "ok": true,
//    >             "id": "55014ad9ce38169d296773554e001f48",
//    >            "rev": "4-d3a4803abd4cbbf13dfdef2efe7b0f72"
//    >       };
exports.delete_site = function(req, res){
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
};
// ***