// # BATMAN MODÈLES #
// ### JSON COUCHDB

// *cs pour chauves-souris.*
// *Utilisation en prefix ou structuration de document design CouchDB*
// ***

// ### USER
// ### Utilisation de la gestion des utilisateurs de CouchDB
// *Utilisation du courriel comme clef unique*
var user_model = {
    "_id": "org.couchdb.user:email",
    "name": "email",
    "type": "user",
    "roles": ["cs:reporter"],
    "password": "plaintext_password"
};
//    > Exemple d'utilisateur:
//        >
//    >     $ {
//    >               "_id": "org.couchdb.user:prof.lebrun@gmail.com",
//    >              "name": "prof.lebrun@gmail.com",
//    >              "type": "user",
//    >             "roles": ["cs:reporter"],
//    >          "password": "oss118"
//    >       }
// ***

// ### OBSERVATIONS
// ### Sites d'observations en format GeoJSON
// *Clef unique (_id) générée par CouchDB*
// *Clef de révision (_rev) générée par CouchDB*
// *"type": "cs:observation" comme type de doc.*
var site_model = {
    "_id": "ury78325y3krwhrejfds",
    "_rev": "jmfhdgdjgdagf",
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-73.5716, 45.52716]
    },
    "properties": {
        "type": "cs:observation",
        "site_structure": "Nichoir",
        "site_habitat": "Parc",
        "site_individus": "Parc",
        "site_image": null,
        "obs_nom": "Steflef",
        "obs_adresse": "52 Sherbrooke",
        "obs_ville": "Montréal",
        "obs_codepostal": "G6H 4R6",
        "obs_telephone": "418-444-5555",
        "obs_courriel": "prof_lebrun@gmail.com",
        "prop_nom": null,
        "prop_adresse": null,
        "prop_ville": null,
        "prop_codepostal": null,
        "prop_telephone": null,
        "prop_courriel": null,
        "notes": "",
        "id_user": "prof_lebrun@gmail.com",
        "suivi":"",
        "created_at": "2013/05/25 06:10:40 +0000"
    }
};
// ***

// ### VALIDATION DES CHAMPS DU FORMULAIRE
// ### TODO
var validation_model = {
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

// ### SITES
// ### Liste des valeurs possibles pour les structures et habitats associées à un site d'observation
// *Utilisation pour les select box*
var site_model = {
    "type": "cs:site",
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

// ### BATMAN VIEWS
// ### batman design documents
// #### batman/_design/cs_sites
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