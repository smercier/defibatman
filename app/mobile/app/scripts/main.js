var batman_api,map;
$(document).ready(function() {
    L.Icon.Default.imagePath = '/dist/images';
    map = new L.Map('map-canvas',{'scrollWheelZoom':false,minZoom:9, maxZoom:17});
    map.attributionControl.setPrefix('');

    //Si jamais nous avons besoin des clusters pour afficher les sites
    //markersLayer = new L.LayerGroup();
    //markers = new L.MarkerClusterGroup({ showCoverageOnHover: false, animateAddingMarkers : true });

    var stamenAttributions ='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.';
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        osmAttrib = 'Map data © openstreetmap contributors',
    //osm = new L.TileLayer(osmUrl, {minZoom:8, maxZoom:18, attribution:osmAttrib}),
    //stamenTonerHybrid = new L.TileLayer('http://{s}.tile.stamen.com/toner-hybrid/{z}/{x}/{y}.png', {attribution: 'Stamen'});
    //stamenTonerLines = new L.TileLayer('http://{s}.tile.stamen.com/toner-lines/{z}/{x}/{y}.png', {attribution: 'Stamen'});
    //stamenTonerBackground = new L.TileLayer('http://{s}.tile.stamen.com/toner-background/{z}/{x}/{y}.png', {attribution: 'Stamen'});
    //stamenTonerLite = new L.TileLayer('https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {attribution: 'Stamen'});
        stamenTonerLite = new L.TileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {attribution: stamenAttributions});
    //mapCenter = new L.LatLng(origin.lat, origin.lon);

    map.addLayer(stamenTonerLite);


    function onLocationFound(position) {
        console.info("Location fund!!!");
        console.log(position);
        site_model.geometry.coordinates = [position.latlng.lat, position.latlng.lng];
        //var radius = position.accuracy / 2;
        //L.marker(position.latlng).addTo(map).bindPopup("Vous êtes à environ " + radius + " mètres de ce point").openPopup();
        //L.circle(position.latlng, radius).addTo(map);
        map.setView( position.latlng, 16);
    }

    function onLocationError(e) {
        console.log(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.locate({watch: false, locate: true, setView: true, enableHighAccuracy:true});//,timeout:15000,maximumAge:20000});

    var site_model = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-73.5716, 45.52716]
        },
        "properties": {
            "type": "cs:observation",
            "site_structure": null,
            "site_habitat": null,
            "site_individus": null,
            "site_image": null,
            "obs_nom": null,
            "obs_adresse": null,
            "obs_ville": null,
            "obs_codepostal": null,
            "obs_telephone": null,
            "obs_courriel": null,
            "prop_nom": null,
            "prop_adresse": null,
            "prop_ville": null,
            "prop_codepostal": null,
            "prop_telephone": null,
            "prop_courriel": null,
            "notes": null,
            "id_user": null,
            "suivi": null,
            "created_at": null
        }
    };
    var structures_model = [
        "Chalet",
        "Entrepôt",
        "Hangar",
        "Mine",
        "Grange",
        "Pont",
        "Caverne ou grotte",
        "Maison habitée",
        "Nichoir à chauves-sourir",
        "Maison abandonnée",
        "Arbre",
        "Autre"
    ];
    var habitats_model = [
        "Champs agricoles",
        "Parc",
        "Forêt",
        "Bordure de lac",
        "Bordure de rivière",
        "Bordure de route",
        "Milieu humide",
        "Friche",
        "Zone urbaine",
        "Autre"
    ];

    // ## batman_api
     batman_api = (function($){

        var _url = "http://127.0.0.1:3000/api/";
        //var _url = "http://192.168.1.102:3000/api/";
        var _formId = "cs-form";
        var _user = null;
        var _LatLng = {};
        var _img = null;
         
        var api = {
            getUrl: function(){
                return _url;
            },
            getImage: function(){
                return _img;
            },
            setImage: function(img){
                 _img = img;
                console.log(img);
                return _img;
            },
            clearImage: function(){
                this.setImage(null);
            },
            add: function(){
                var _self = this;
                console.log(_url);

                $.ajax({
                    url: _url + "site/",
                    type: 'POST',
                    contentType: 'application/json',
                    data: '{"site":'+JSON.stringify(this.formToJson())+'}',
                    dataType: 'json'
                }).then(
                    function(rsp){
                        console.log(rsp);
                        _self.showAlert("id:"+rsp.id+" | rev:"+rsp.rev,"Succès!","OK",_self.closeFormPanel);
                    },
                    function(e){
                        console.log("== add fail ==");
                        console.log(e.status);
                        var infos = jQuery.parseJSON(e.responseText);
                        if(infos.code == "401"){
                            _self.showLoginPanel();
                        }
                        _self.showAlert(infos.msg, infos.code);
                    }
                )
            },
            update:function(_id,_rev){
                var _self = this;
                $.ajax({
                    url: _url + "site/" +_id +"/"+_rev,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: '{"site":'+JSON.stringify(this.formToJson())+'}',
                    dataType: 'json'
                }).then(
                    function(rsp){
                        console.info("== update done ==");
                        console.log(rsp);
                        _self.populateForm(rsp);
                        _self.showAlert("Mise à jour effectuée.","Succès!");
                    },
                    function(e){
                        console.error("== update fail ==");
                        console.log(e);
                        var infos = jQuery.parseJSON(e.responseText);
                        if(infos.code == "401"){
                            _self.showLoginPanel();
                        }
                        _self.showAlert(infos.msg,infos.code);
                    }
                )
            },
            remove:function(_id,_rev){
                var _self = this;
                $.ajax({
                    url: _url + "site/" +_id +"/"+_rev,
                    type: 'DELETE'
                }).then(
                    function(rsp){
                        console.info("== remove done ==");
                        console.log(rsp);
                        _self.clearForm();
                    },
                    function(e){
                        console.error("== get fail ==");
                        console.log(e);
                        var infos = jQuery.parseJSON(e.responseText);
                        if(infos.code == "401"){
                            _self.showLoginPanel();
                        }
                        _self.showAlert(infos.msg,infos.code);
                    }
                )
            },
            get:function(_id){
                var _self = this;
                $.ajax({
                    url: _url + "site/"+_id,
                    type: 'GET',
                    contentType: 'application/json'//,
                   // dataType: 'json'
                }).then(
                    function(rsp){
                        console.info("== get done ==");
                        console.log(rsp);
                        // TODO Populate Form with data
                        _self.populateForm(rsp)
                    },
                    function(e){
                        console.error("== get fail ==");
                        console.log(e);
                        var infos = jQuery.parseJSON(e.responseText);
                        if(infos.code == "401"){
                            _self.showLoginPanel();
                        }
                        _self.showAlert(infos.msg,infos.code);
                    }
                )
            },
            listSites:function(){
                console.log(_url);
                var _self = this;
                $.ajax({
                    url: _url + "site/",
                    type: 'GET',
                    contentType: 'application/json'
                }).then(
                    function(rsp){
                        //TODO List sites on the map
                        //!! Just for admin role.
                        console.info("=== listSites fail ===");
                        console.log(rsp);
                    },
                    function(e){
                        console.error("=== listSites fail ===");
                        var infos = jQuery.parseJSON(e.responseText);
                        if(infos.code == "401"){
                            _self.showLoginPanel();
                        }
                        _self.showAlert(infos.msg,infos.code);
                    }
                )
            },
            setGeom:function(m){
                var _self = this;
                console.log(m.getCenter());
                this._LatLng = m.getCenter();
                _self.showFormPanel();
                console.log(this);
            },
            login:function(){
                console.info("LOGIN SUBMIT");
                this._user = $("#input-username").val();
                var _psw = $("#input-password").val();
                var _self = this;
                $.ajax({
                    url: _url + "login/",
                    type: 'POST',
                    contentType: 'application/json',
                    data: '{"username":"'+this._user+'","userpass":"'+_psw+'"}',
                    dataType: 'json'
                }).then(
                    function(rsp){
                        console.info("== _login done ==");
                        console.log(rsp);
                        _self.closeLoginPanel();
                        // TODO put username in cookie for auto remember me?
                    },
                    function(e){
                        console.error("== _login fail ==");
                        console.log(e);
                        console.log(e.status);
                        if(e.status == 0){
                            _self.showAlert("Serveur Down ou introuvable",0);
                            return;
                        }
                        
                        var infos = jQuery.parseJSON(e.responseText);
                        _self.showAlert(infos.msg,infos.code);
                    }
                )
            },
            logout:function(){
                var _self = this;
                $.ajax({
                    url: _url + "logout/",
                    type: 'GET'
                }).then(
                    function(rsp){
                        console.info("== logout fail ===");
                        console.log(rsp);
                        _self.showLoginPanel();
                    },
                    function(e){
                        console.error("== logout fail ===");
                        var infos = jQuery.parseJSON(e.responseText);
                        _self.showAlert(infos.msg,infos.code);
                    }
                )
            },
            userStatus:function(){
                var _self = this;
                $.ajax({
                    url: _url + "status",
                    type: 'GET',
                    contentType: 'application/json'
                }).then(
                    function(rsp){
                        console.info("== _loged ==");
                        console.log(rsp);
                        _self.closeLoginPanel();
                    },
                    function(e){
                        console.error("== _status fail ==");
                        console.log(e);
                        console.log(e.status);
                        if(e.status == 0){
                            _self.showAlert("Serveur Down ou introuvable",0);
                            return;
                        }
                        _self.showLoginPanel();
                        var infos = jQuery.parseJSON(e.responseText);
                        _self.showAlert(infos.msg,infos.code);
                    }
                )
            },
            signup:function(){
                // TODO
            },
            _cUrl:function(_url, _verb, _data, done_cb, fail_cb){

                $.ajax({
                    url: _url,
                    type: _verb,
                    contentType: 'application/json',
                    data: _data,
                    dataType: 'json'
                }).then( done_cb, fail_cb)
            },
            populateForm:function(data){
                //TODO populate Form with server data
            },
            clearForm:function(){
                //TODO populate Form with default data
            },
            formToJson:function(){
                // PROCESS
                //parse Form
                var values = {};
                var model = site_model;
                var serialized = $('#cs-form').serializeArray();
                var latlng;
                var _img = this.getImage();
                
                $.each(serialized,function(){
                    values[this.name] = this.value;
                });

                $.each(model.properties,function(index) {
                    if(index in values){
                        model.properties[index] = values[index];
                    }
                });

                //AUTO EMAIL
                model.properties.obs_courriel = this._user;

                //AUTO PASTE INFOS
                if($('#cs-coord').is(':checked')){
                    model.properties.prop_nom = $("#obs-nom").val();
                    model.properties.prop_adresse= $("#obs-adresse").val();
                    model.properties.prop_ville=$("#obs-ville").val();
                    model.properties.prop_codepostal= $("#obs-codepostal").val();
                    model.properties.prop_telephone= $("#obs-telephone").val();
                    model.properties.prop_courriel= this._user;
                }

                console.log(model);

                //GEO
                latlng = map.getCenter();
                model.geometry.coordinates[0] = latlng.lng;
                model.geometry.coordinates[1] = latlng.lat;
                
                //IMAGE
                if(_img){
                    model.properties.site_image = _img.name;
                    
                    var attachments = {};
                    attachments[_img.name] = {
                        "content-type" : _img.type,
                        "data" : _img.b64
                    }
                    
                    model._attachments = attachments;
                }else{
                    model.properties.site_image = null;
                }

                return model;
            },
            showLoginPanel:function(){
                $("#login-panel").show();
            },
            showAlert:function(){
                var _msg = arguments[0] || '';
                var _title = arguments[1] || 'Alerte!';
                var _button = arguments[2] || 'OK';
                var _cb = arguments[3] || function(){ console.info("== Alert Close =="); };
                var _panel= $("#top-panel");
                _panel.find(".alert-msg").text(_msg);
                _panel.find(".alert-title").text(_title);
                _panel.find(".alert-button").text(_button);
                _panel.show()
                    .find('button')
                    .bind('click',function(){
                        batman_api.closeAlertPanel();
                        _cb();
                    });
            },
            showFormPanel: function(){
                $("#form-panel").fadeIn();
            },
            closeAlertPanel: function(){
                $("#top-panel").slideUp();
            },
            closeLoginPanel: function(){
                $("#login-panel").hide();
            },
            closeFormPanel: function(){
                //$("#form-panel").hide();
                $("#form-panel").fadeOut();
            }
        };
        return api;
    })(jQuery);

    // ### DOM BINDINGS
    $('#cs-coord').change(function(){
        if($(this).is(':checked')){
            $("#prop").hide();
        }else{
            $("#prop").show();
        }
    }).change();

    $( "#cs-login" ).submit(function( event ) {
        event.preventDefault();
        batman_api.login();
    });

    $('#cs-connexion').bind(['click','submit'],function(){
        $( "#cs-login" ).submit();
    });

    $( "#cs-form" ).submit(function( event ) {
        event.preventDefault();
        batman_api.add();
        
    });

    $("#top-panel").hide();

    $('#map-button')
        .bind('click', function(){
            batman_api.setGeom(map);
        });
    $('.form-cancel')
        .bind('click', function(){
            batman_api.closeFormPanel();
        });

    $('#follow-switch').on('switch-change', function(e, data) {
        console.log(data.value);
        var serialized = $('input:checkbox').map(function() {
            return { name: this.name, value: this.checked ? this.value : "false" };
        });
        console.log(serialized);
        
    });

    $("input[type=file]").change(function(){
        var file = $("input[type=file]")[0].files[0];
        var imgInfos;

        // Check for the various File API support.
        if(!window.File || !window.FileReader || !window.FileList || !window.Blob){ 
            batman_api.showAlert('The File APIs are not fully supported in this browser.');
            return;
        }
        
        if (file) {
            imgInfos = {
                name: file.name,
                type: file.type,
                size: file.size,
                lastModifiedDate: file.lastModifiedDate,
                b64: null
            };
            var reader = new FileReader();

            reader.onload = function(readerEvt) {
                var _img = imgInfos;
                var binaryString = readerEvt.target.result;
                _img.b64 = btoa(binaryString);
                
                batman_api.setImage(_img);
                //TODO - HIDE Spinner
            };

            //TODO - SHOW Spinner
            reader.readAsBinaryString(file);
        }
    });

    batman_api.userStatus();
});