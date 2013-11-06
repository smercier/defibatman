// #AUTH BATMAN   
// ***

// ####**/api/login** (**POST**) [**JSON**] 
// ###Login  
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
exports.login = function (req, res) {

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
};
// ***

// ####**/api/logout** (**GET**) [**JSON**]  
// ###Logout  
//    > Exemple de output (200):
//        >
//    >     $ {
//    >         "status": "ok",
//    >           "code": 200,
//    >            "msg": "LOGGED_OUT"
//    >     }  
//  
// *The CouchDB cookie name is AuthSession*
exports.logout = function (req, res) {
    res.set({
        'Content-Type': 'application/json'
    });
    res.clearCookie('AuthSession');
    res.send(200, '{"status":"ok","code":200,"msg":"LOGGED_OUT"}');
};
// ***

// ####**/api/admin** (**GET**) [**JSON**]  
// ###Administartion  
// #### TODO
exports.admin =  function (req, res) {

    var auth = req.cookies['AuthSession'],
        batman;

    req.accepts('application/json');
    res.set({'Content-Type': 'application/json'});

    //Auth Check
    if (!auth) { res.send(401, '{"status":"err","code":401,"msg":"Unauthorized."}'); return; }

    //Role Check
    //Check with stored role or with a _session on CouchDB
    //TODO
};
// ***

exports.status = function(req, res) {

    var  auth = req.cookies['AuthSession'] || null
        ,nano = require('nano')({
            url: 'http://localhost:5984',
            cookie: 'AuthSession=' + auth
            })
        ,user;
    
    res.set({'Content-Type': 'application/json'});
    //Auth Check
    if (!auth) {
        res.send(401, '{"status":"err","code":401,"msg":"Unauthorized"}');
        return;
    }
    
    //==========
    nano.request({
            method: "GET",
            db: "_session"
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
            //res.send(200,body);
            
            res.send(200, '{"status":"ok","code":200,"msg":"LOGGED_IN","name":"'+body.userCtx.name+'","role":'+ JSON.stringify( body.userCtx.roles ) +'}');
        });

    //==========

//    
//    user = {
//        status: 'ok',
//        code: 200,
//        msg: 'Authorize',
//        logged_in_email: req.session.user || null
//    };
//    
//    res.send(200, JSON.stringify(user));
};