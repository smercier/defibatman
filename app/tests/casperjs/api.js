var casper = require('casper').create({
        httpStatusHandlers: {
            404: function(self, resource) {
                this.echo(
                    "Resource at " + resource.url + " not found (404)",
                    "COMMENT"
                );
            },
            500: function(self, resource) {
                this.echo(
                    "Resource at " + resource.url + " server error (500)",
                    "COMMENT"
                );
            }
        },
        onLoadError: function(self, resource){
            this.echo("LOAD ERROR", 'ERROR');
            this.echo(resource, 'ERROR');
            //this.test.done();
            this.test.renderResults(true);
        },
        verbose: false,
        logLevel: 'debug',
        exitOnError: true
});
casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

//## ACCUEIL
casper.test.begin('Accueil aka /', 2, function suite(test) {
    casper.start('http://127.0.0.1:3000', function(response) {
        this.echo(response.headers.get('Date') + " ===============================",'INFO');
        this.echo("===== CHECKING HOME PAGE =====",'INFO');
        this.echo("http://127.0.0.1:3000/ [GET]",'INFO');
        
        test.assertHttpStatus(200, 'Status');
        test.assertTitle("^^ö^^", "TITLE OK!");
        this.log("I'm logging an error", "error");
    });

    casper.run(function() {
        test.done();
    });
});

//## AUTH // LOGIN
casper.test.begin('AUTH // LOGIN // COOKIES', 18, function suite(test) {
    casper.start().then(function() {
        this.echo("===== TESTING WRONG LOGIN =====",'INFO');
        this.echo("http://127.0.0.1:3000/api/login [POST]",'INFO');

        this.open('http://127.0.0.1:3000/api/login', {
            method: 'post',
            headers: {
                'Accept': 'application/json'
            },
            data: {
                username: "steflef_",
                userpass: "test"
            }
        });
    });

    casper.then(function() {
        var resp_data = JSON.parse(this.getPageContent());

        test.assertHttpStatus(401, 'HTTP Status 401 [Unauthorized]');
        test.assertEquals(resp_data.status, "err", 'Err OK');
        test.assertEquals(resp_data.code, 401, 'Code OK');
        test.assertEquals(resp_data.msg, "Name or password is incorrect.", 'Msg OK');
        
        this.echo(">> JSON RESPONSE",'INFO');
        require('utils').dump(JSON.parse(this.getPageContent()));
    });

    casper.then(function() {
        this.echo("===== TESTING AUTH STATUS =====",'INFO');
        this.echo("http://127.0.0.1:3000/api/status [GET]",'INFO');

        this.open('http://127.0.0.1:3000/api/status', {
            method: 'get',
            headers: {
                'Accept': 'application/json'
            }
        });
    });
    
    casper.then(function() {

        var resp_data = JSON.parse(this.getPageContent());

        this.test.assertHttpStatus(401, 'HTTP Status 401 [Unauthorized]');
        this.test.assertEquals(resp_data.status, "err", 'Status OK');
        this.test.assertEquals(resp_data.code, 401, 'Code OK');
        this.test.assertEquals(resp_data.msg, "Unauthorized", 'Msg OK');

        this.echo(">> JSON RESPONSE",'INFO');
        require('utils').dump(JSON.parse(this.getPageContent()));
    });
    
    casper.then(function() {
        this.echo("===== TESTING GOOD LOGIN =====",'INFO');
        this.echo("http://127.0.0.1:3000/api/login [POST]",'INFO');

        this.open('http://127.0.0.1:3000/api/login', {
            method: 'post',
            headers: {
                'Accept': 'application/json'
            },
            data: {
                username: "steflef",
                userpass: "test"
            }
        });
    });

    casper.then(function() {
        
        //Cookies fixing
        var fs = require('fs');
        var cookies = JSON.stringify(phantom.cookies);
        fs.write("cookies.txt", cookies, 644);

        var resp_data = JSON.parse(this.getPageContent());

        this.test.assertHttpStatus(200, 'HTTP Status 200 [Authorized]');
        this.test.assertEquals(resp_data.status, "ok", 'Status OK');
        this.test.assertEquals(resp_data.code, 200, 'Code OK');
        this.test.assertEquals(resp_data.msg, "LOGGED_IN", 'Msg OK');
        this.test.assertEquals(resp_data.role instanceof Array,true, 'Role OK');

        this.echo(">> JSON RESPONSE",'INFO');
        require('utils').dump(JSON.parse(this.getPageContent()));
    });


    casper.then(function() {
        this.echo("===== TESTING AUTH STATUS WITH COOKIES =====",'INFO');
        this.echo("http://127.0.0.1:3000/api/status [GET]",'INFO');

        var fs = require('fs');
        var data = fs.read("cookies.txt");
        var cookies = JSON.parse(data);

        this.page.setCookies(JSON.parse(data));
        
        this.open('http://127.0.0.1:3000/api/status', {
            method: 'get',
            headers: {
                'Accept': 'application/json'
            }
        });
    });

    casper.then(function() {

        var resp_data = JSON.parse(this.getPageContent());

        this.test.assertHttpStatus(200, 'HTTP Status 401 [Unauthorized]');
        this.test.assertEquals(resp_data.status, "ok", 'Status OK');
        this.test.assertEquals(resp_data.code, 200, 'Code OK');
        this.test.assertEquals(resp_data.msg, "LOGGED_IN", 'Msg OK');
        this.test.assertEquals(resp_data.role instanceof Array,true, 'Role OK');

        this.echo(">> JSON RESPONSE",'INFO');
        require('utils').dump(JSON.parse(this.getPageContent()));
    });    
    
    casper.run(function() {
        test.done();
    });
});

//### /api/site/:id  
casper.test.begin('/api/site/:id', 8, function suite(test) {
    casper.start().then(function() {
        this.echo("===== TESTING API /api/site/:id WITH WRONG ID =====",'INFO');
        this.echo("http://127.0.0.1:3000/api/site/007 [GET]",'INFO');

        var fs = require('fs');
        var data = fs.read("cookies.txt");
        var cookies = JSON.parse(data);

        this.page.setCookies(JSON.parse(data));

        this.page.cookies = cookies;
        this.open('http://127.0.0.1:3000/api/site/007', {
            method: 'get',
            headers: {
                'Accept': 'application/json'
            }
        });
    });

    casper.then(function() {
        var resp_data = JSON.parse(this.getPageContent());

        this.test.assertHttpStatus(200, 'HTTP Status 200 [Authorized]');
        this.test.assertEquals(resp_data.status, "err", 'Status OK');
        this.test.assertEquals(resp_data.code, 404, 'Code OK');
        this.test.assertEquals(resp_data.msg, "missing", 'Msg OK');

        this.echo(">> JSON RESPONSE",'INFO');
        require('utils').dump(resp_data);
    });

    casper.then(function() {
        this.echo("===== TESTING API /api/site/:id WITH GOOD ID =====",'INFO');
        this.echo("http://127.0.0.1:3000/api/site/55014ad9ce38169d296773554e000aef [GET]",'INFO');

        var fs = require('fs');
        var data = fs.read("cookies.txt");
        var cookies = JSON.parse(data);

        this.page.cookies = cookies;
        this.open('http://127.0.0.1:3000/api/site/55014ad9ce38169d296773554e000aef', {
            method: 'get',
            headers: {
                'Accept': 'application/json'
            }
        });
    });

    casper.then(function() {
        var resp_data = JSON.parse(this.getPageContent());

        this.test.assertHttpStatus(200, 'HTTP Status 200 [Authorized]');
        this.test.assertEquals(resp_data.status, "ok", 'Status OK');
        this.test.assertEquals(resp_data.code, 200, 'Code OK');
        this.test.assertEquals(resp_data.features instanceof Array,true, 'Sites OK');

        this.echo(">> JSON RESPONSE",'INFO');
        require('utils').dump(resp_data);
    });
    
    casper.run(function() {
        test.done();
    });
});

//### /api/site/ [GET]
casper.test.begin('/api/site/ [GET]', 4, function suite(test) {
    casper.start().then(function() {
        this.echo("===== TESTING API /api/site/ =====",'INFO');
        this.echo("http://127.0.0.1:3000/api/site/ [GET]",'INFO');

        var fs = require('fs');
        var data = fs.read("cookies.txt");
        var cookies = JSON.parse(data);

        this.page.cookies = cookies;
        this.open('http://127.0.0.1:3000/api/site/', {
            method: 'get',
            headers: {
                'Accept': 'application/json'
            }
        });
    });

    casper.then(function() {

        var resp_data = JSON.parse(this.getPageContent());

        this.test.assertHttpStatus(200, 'HTTP Status 200 [Authorized]');
        this.test.assertEquals(resp_data.status, "ok", 'Status OK');
        this.test.assertEquals(resp_data.code, 200, 'Code OK');
        this.test.assertEquals(resp_data.features instanceof Array,true, 'Sites OK');

        // this.echo(">> JSON RESPONSE",'INFO');
        // require('utils').dump(JSON.parse(this.getPageContent()));
    });

    casper.run(function() {
        test.done();
    });
});

//### /api/site/ [POST] [PUT] [DELETE]
casper.test.begin('/api/site/ [POST][PUT][DELETE]', 15, function suite(test) {
    
    casper.start().then(function() {
        this.echo("===== API NEW SITE /api/site/ =====",'INFO');
        this.echo("http://127.0.0.1:3000/api/site/ [POST]",'INFO');

        var fs = require('fs');
        var data = fs.read("cookies.txt");
        var cookies = JSON.parse(data);

        this.page.cookies = cookies;
        var site = JSON.stringify({
                                    site :{
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [-73.5716, 45.52716]
                                        },
                                        "properties": {
                                            "type": "cs:observation",
                                            "site_structure": "Nichoir",
                                            "site_habitat": "Parc",
                                            "obs_nom": "Steflef",
                                            "obs_adresse": "52 Sherbrooke",
                                            "obs_ville": "Montréal",
                                            "obs_codepostal": "G6H 4R6",
                                            "obs_telephone": "418-444-5555",
                                            "obs_courriel": "prof_lebrun@gmail.com",
                                            "prop_nom": '',
                                            "prop_adresse": '',
                                            "prop_ville": '',
                                            "prop_codepostal": '',
                                            "prop_telephone": '',
                                            "prop_courriel": '',
                                            "id_user": "prof_lebrun@gmail.com",
                                            "mat_photo": ''
                                        }
                                    }
                                });
        this.open('http://127.0.0.1:3000/api/site/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: site
        });
    });

    casper.then(function() {
        this.echo("TEST",'INFO');
        //this.echo(casper.getPageContent(),"INFO");
        var resp_data = JSON.parse(this.getPageContent());

        test.assertHttpStatus(200, 'HTTP Status 200 [Authorized]');
        test.assertEquals(resp_data.status, "ok", 'Status OK');
        test.assertEquals(resp_data.code, 200, 'Code OK');
        
        test.assertEquals( typeof resp_data.id === 'string', true, 'id OK');
        test.assertEquals( typeof resp_data.rev === 'string', true, 'rev OK');
        
         this.echo(">> JSON RESPONSE",'INFO');
         require('utils').dump(resp_data);
    });

    //UPDATE
    casper.then(function() {
        this.echo("===== API EDIT SITE /api/site/ =====",'INFO');
        this.echo("http://127.0.0.1:3000/api/site/ [PUT]",'INFO');
        
        var resp_data = JSON.parse(this.getPageContent());
        var fs = require('fs');
        var data = fs.read("cookies.txt");
        var cookies = JSON.parse(data);

        this.page.cookies = cookies;
        var updated_site = JSON.stringify({
            site :{
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-73.5716, 45.52716]
                },
                "properties": {
                    "type": "cs:observation",
                    "site_structure": "Nichoir",
                    "site_habitat": "Parc",
                    "obs_nom": "Steflef",
                    "obs_adresse": "52 Sherbrooke",
                    "obs_ville": "Montréal",
                    "obs_codepostal": "G6H 4R6",
                    "obs_telephone": "418-444-5555",
                    "obs_courriel": "prof_lebrun@gmail.com",
                    "prop_nom": 'EDIT',
                    "prop_adresse": '',
                    "prop_ville": '',
                    "prop_codepostal": '',
                    "prop_telephone": '',
                    "prop_courriel": '',
                    "id_user": "prof_lebrun@gmail.com",
                    "mat_photo": ''
                }
            }
        });
        this.echo(">http://127.0.0.1:3000/api/site/"+resp_data.id+"/"+resp_data.rev,'INFO');
        this.open('http://127.0.0.1:3000/api/site/'+resp_data.id+'/'+resp_data.rev, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Charset': 'utf-8'
                
            },
            data: updated_site
        });
    });
    
    casper.then(function() {
        this.echo("UPDATE",'INFO');
        //this.echo(casper.getPageContent(),"INFO");
        var resp_data = JSON.parse(this.getPageContent());

        test.assertHttpStatus(200, 'HTTP Status 200 [Authorized]');
        test.assertEquals(resp_data.status, "ok", 'Status OK');
        test.assertEquals(resp_data.code, 200, 'Code OK');

        test.assertEquals( typeof resp_data.id === 'string', true, 'id OK');
        test.assertEquals( typeof resp_data.rev === 'string', true, 'rev OK');

        this.echo(">> JSON RESPONSE",'INFO');
        require('utils').dump(resp_data);
    });

    //DELETE call
    casper.then(function() {
        this.echo("===== API DELETE SITE /api/site/ =====",'INFO');
        this.echo("http://127.0.0.1:3000/api/site/ [DELETE]",'INFO');

        var resp_data = JSON.parse(this.getPageContent());
        var fs = require('fs');
        var data = fs.read("cookies.txt");
        var cookies = JSON.parse(data);

        this.page.cookies = cookies;
        this.echo(">http://127.0.0.1:3000/api/site/"+resp_data.id+"/"+resp_data.rev,'INFO');
        this.open('http://127.0.0.1:3000/api/site/'+resp_data.id+'/'+resp_data.rev, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Charset': 'utf-8'

            }
        });
    });

    //####Delete site [DELETE]
    casper.then(function() {
        this.echo("DELETE",'INFO');
        var resp_data = JSON.parse(this.getPageContent());

        test.assertHttpStatus(200, 'HTTP Status 200 [Authorized]');
        test.assertEquals(resp_data.status, "ok", 'Status OK');
        test.assertEquals(resp_data.code, 200, 'Code OK');

        test.assertEquals( typeof resp_data.id === 'string', true, 'id OK');
        test.assertEquals( typeof resp_data.rev === 'string', true, 'rev OK');

        this.echo(">> JSON RESPONSE",'INFO');
        require('utils').dump(resp_data);
    });
    
    casper.run(function() {
        test.done();
    });
});

casper.test.begin('Formulaire', 8, function suite(test) {
    var data;
    casper.start().then(function() {
        this.echo("===== FORM TESTING / =====",'INFO');
        this.echo("http://127.0.0.1:3000/ [GET]",'INFO');

        var fs = require('fs');
        var data = fs.read("cookies.txt");
        var cookies = JSON.parse(data);

        this.page.cookies = cookies;

        this.open('http://127.0.0.1:3000/', {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        });
    });
        
    casper.then(function() {
        test.assertHttpStatus(200, 'HTTP Status 200 [Authorized]');
        test.assertExists('#map-button');
        test.assertExists('#map-panel');
        test.assertNotVisible('#login-panel');
        this.click('#map-button');
    });
    
    casper.then(function() {

        require('clientutils');
        
        this.test.comment('Creating site ...');

        //this.debugHTML();
        this.test.assertExists('#cs-form');
        this.test.assertExists('form#cs-form');
        this.test.assertExists('button#cs-form-submit');
        this.test.comment('Filling Form ...');
        this.fill('form#cs-form', {
            "notes": "Mes notes",
            "obs_adresse": "5314 Saint Denis",
            "obs_codepostal": "H2J 2Y4",
            "obs_nom": "Stef Test",
            "obs_telephone": "514-543-9348",
            "obs_ville": "Montréal",
            "prop_adresse": "",
            "prop_codepostal": "",
            "prop_courriel": "steflef",
            "prop_nom": "",
            "prop_ville": "",
            "site_habitat": "Champs agricoles",
            "site_individus": "1 - 5",
            "site_structure": "Chalet",
            "suivi": "Oui"
        }, false);

        this.test.comment('Submiting Form ...');

        var url = this.evaluate(function() {
            return batman_api.getUrl();
        });
        this.echo('url >> '+ url, 'INFO');

        var batman_api = this.evaluate(function() {
            return batman_api;
        });
        
        //SET MAP COORDINATES
        this.evaluate(function() {
            map.setView( {lat:45.52842,lng:-73.59282}, 16);
        });
        
        data = this.evaluate(function() {
            return JSON.parse(__utils__.sendAJAX(batman_api.getUrl() + "site/", 'POST', '{"site":'+JSON.stringify(batman_api.formToJson())+'}', false, {contentType:'application/json'}));
        });
    });
    casper.then(function() {
        require('utils').dump(data);
        //this.debugHTML();
        //var resp_data = JSON.parse(this.getPageContent());
        //require('utils').dump(resp_data);
        
        test.assertHttpStatus(200, 'HTTP Status 200 [Authorized]');
        
//        test.assertExists('#map-button');
//        test.assertExists('#map-panel');
//        test.assertVisible('#map-panel');
//        test.assertNotVisible('#login-panel');
    });
    
    casper.run(function() {
        //Phantom Log to file
        var fs = require('fs');
        var logs = require('utils').serialize(this.result.log);
        fs.write("phantom.log", logs, 644);

        test.renderResults(true);
    });
});