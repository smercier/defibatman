// # BATMAN MODÈLES #
// ### JSON COUCHDB

// *cs pour chauves-souris.*    
// *Utilisation en prefix ou structuration de document design CouchDB*
// ***

// ###**Utilisateurs**
// #####**Utilisation de la gestion des utilisateurs de CouchDB**
// *Utilisation du courriel comme clef unique*

// Rôles disponibles: ["cs:observateur","cs:admin"]   
//    > Exemple d'utilisateur:
//        >
//    >     $ {
//    >               "_id": "org.couchdb.user:prof.lebrun@gmail.com",
//    >              "name": "prof.lebrun@gmail.com",
//    >              "type": "user",
//    >             "roles": ["cs:observateur"],
//    >          "password": "oss118"
//    >       }
var user_model = {
    "_id": "org.couchdb.user:{email}",
    "name": "{email}",
    "type": "{user}",
    "roles": ["cs:observateur"],
    "password": "{plaintext_password}"
};

// ***

// ###**Observations**
// #####**Sites d'observations en format GeoJSON**    
// *Clef unique (_id) générée par CouchDB*    
// *Clef de révision (_rev) générée par CouchDB*    
// *"type": "cs:observation" comme type de doc.*    
// TODO: Vérifier l'utilisation d'image en document joint.   
//    > Exemple d'observation:
//        >
//    >     $ {
//    >          "_id": "e1aa0918805d6fff5bf258d6fa0033b0",
//    >          "_rev": "1-b172c358fdcb304d977cb47cbb1b1346",
//    >          "type": "Feature",
//    >          "geometry": {
//    >              "type": "Point",
//    >              "coordinates": [-73.5716, 45.52716]
//    >          },
//    >          "properties": {
//    >              "type": "cs:observation",
//    >              "site_structure": "Nichoir",
//    >              "site_habitat": "Parc",
//    >              "site_individus": "1 - 5",
//    >              "site_image": null,
//    >              "obs_nom": "Steflef",
//    >              "obs_adresse": "52 Sherbrooke",
//    >              "obs_ville": "Montréal",
//    >              "obs_codepostal": "G6H 4R6",
//    >              "obs_telephone": "418-444-5555",
//    >              "obs_courriel": "prof_lebrun@gmail.com",
//    >              "prop_nom": "Steflef",
//    >              "prop_adresse": "52 Sherbrooke",
//    >              "prop_ville": "Montréal",
//    >              "prop_codepostal": "G6H 4R6",
//    >              "prop_telephone": "418-444-5555",
//    >              "prop_courriel": "prof_lebrun@gmail.com",
//    >              "notes": "Lorem ipsum ...",
//    >              "id_user": "prof_lebrun@gmail.com",
//    >              "suivi":"Oui",
//    >              "created_at": 1381859931122
//    >          }
var cs_model = {
    "_id": null,
    "_rev": null,
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
// ***

// ###**Validation**
// TODO Validation des champs du formulaire
var cs_validation_model = {
    "type": "cs:validation",
    "obs_nom": {
        "required": true,
        "minlength": 4,
        "maxlength": 30,
        "pattern": "",
        "trim": true
    }
};
// ***

// ###**Listes**
// #####**Liste des valeurs possibles pour les structures et habitats associées à un site d'observation**
// *Utilisation pour les select box*
var cs_list_model = {
    "type": "cs:list",
    "structures":[
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
    ],
    "habitats":[
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
    ],
    "individus":[
        "1 - 5",
        "6 - 20",
        "21 - 50",
        "plus de 50"
    ],
    "suivi":[
        "Oui",
        "Non",
        "Je ne sais pas"
    ]
};
// ***

// ###**BATMAN VIEWS**
// ###**batman design documents**
// ####**batman/_design/cs_sites**
var cs_sites = {
    "_id": "_design/cs_sites",
    "_rev": "8-8fa36a5ae0c483829bde52ead143b3fb",
    "language": "javascript",
    "views": {
        "all": {
            "map": "function(doc) {\n  if(doc.properties.type == \"cs:observation\"){\n    emit(null,doc);\n  }\n}"
            },
        "ll": {
            "map": "function(doc) {\n  if(doc.properties.type == \"cs:observation\"){\n    emit(null, doc.geometry.coordinates);\n  }\n}"
            }
        }
    };

var cs_sites_v2 = {
    "_id": "_design/cs_sites",
    "_rev": "8-8fa36a5ae0c483829bde52ead143b3fb",
    "language": "javascript",
    "views": {
        "all": {
            "map": "function(doc) {if(doc.properties.type == \"cs:observation\"){emit(null,doc);}}"
        },
        "ll": {
            "map": "function(doc) {if(doc.properties.type == \"cs:observation\"){emit(null, doc.geometry.coordinates);}}"
        }
    },
    "updates": {
        "hello": "function(doc,req){if(!doc){if(req.id){return[{_id: req.id},'NewWorld']}return[null,'EmptyWorld'];}doc.world='hello';doc.edited_by=req.userCtx;return[doc,'hellodoc'];}",
        "in-place": "function(doc,req){var field = req.form.field;var value = req.form.value;varmessage = 'set' + field + 'to' + value;doc[field] = value;return [doc,message];}"
    }
};

//curl -X PUT http://127.0.0.1:5984/batman/_design/cs_sites/_updates  -u "robin:hood" -d '{"hello":"function(doc,req){if(!doc){if(req.id){return[{_id: req.id},'NewWorld']}return[null,'EmptyWorld'];}doc.world='hello';doc.edited_by=req.userCtx;return[doc,'hellodoc'];}","in-place":"function(doc,req){var field = req.form.field;var value = req.form.value;varmessage = 'set' + field + 'to' + value;doc[field] = value;return [doc,message];}"}'

//curl -v -H "Content-Type: application/json" -X PUT http://127.0.0.1:5984/batman/_design/cs_sites  -u "robin:hood" --data '@models/_design.json'
//curl http://127.0.0.1:5984/batman/_design/cs_sites/_view/all  -u "robin:hood" | python -mjson.tool