# Projet Défi Batman

Le **Défi Batman** est un outil  réalisé dans le cadre du GéoHack 2013.
..is an open web tool developed at the [DensityDesign Research Lab](http://www.densitydesign.org) (Politecnico di Milano) to create custom vector-based visualizations on top of the amazing [d3.js](https://github.com/mbostock/d3) library by [Mike Bostock](http://bost.ocks.org/mike/).
Primarily conceived as a tool for designers and vis geeks, **Raw** aims at providing a missing link  between spreadsheet applications (e.g. Microsoft Excel, Apple Numbers, Google Docs, OpenRefine, …) and vector graphics editors (e.g. Adobe Illustrator, Inkscape, ...).

Ce projet est le résultat du travail de l'équipe **Défi Batman** tenu lors
du [Défi GéoHack MTL le 2 octobre 2013](http://defigeohackmtl.org/).  L'objectif de ce défi était de créer une
application mobile pour recenser et localiser les colonies de Chauves-Souris.


**Répertoire officiel:** [https://github.com/smercier/defibatman](https://github.com/smercier/defibatman)


## Contexte

En moins de trois ans, plusieurs espèces de chauves-souris, ont connu un déclin supérieur à 90%.
La principale cause est une infection fongique qui s’est propagée au Québec en 2010. Pour mieux
suivre le déclin des populations de chauves-souris, le Ministère du Développement Durable, Environnement,
Faune et Parc (MDDEFP) [sollicite la collaboration des citoyens](http://www.mddefp.gouv.qc.ca/infuseur/communique.asp?no=2538) pour trouver des colonies de chauves-souris, mais
aimerait avoir un moyen plus simple que de recueillir l’information par téléphone.
Ce projet vise à doter cette organisation d’une application Web mobile simple qui permettrait de localiser
dynamiquement sur une carte les maternités de chauves-souris et de pouvoir y faire des recensements d’individu.


##Utilisation
La façon la plus facile d'utiliser le projet consiste à accéder à la version disponible sur le serveur mapgears en visitant le url [...](). Vous pouvez également faire rouler le tout en local sur votre machine, juste à suivre les instrucions un peu plus bas.


##Installation
If you want to run your instance of Raw locally on your machine, be sure you have the following requirements installed. **Starting from version 0.1.2, we decided to simplify the code and removing Node.js: only Bower is needed to install client-side dependencies.**


###Prérequis

- [Git](http://git-scm.com/book/en/Getting-Started-Installing-Git)
- [NodeJs (v0.10.20)](http://nodejs.org/)
- [CouchDB (v1.2.2 et +)](http://couchdb.apache.org/)
- [ElasticSearch (optionnel pour l'instant)](http://www.elasticsearch.org/)

###Étapes

####Pour faire rouler le serveur

Clonage du projet via lignes de commandes:

``` sh
$ git clone git@github.com:smercier/defibatman.git
```

Naviguer vers le dossier racine du serveur:

``` sh
$ cd defibatman/backend/
```

Installation des dépendances globales du côté serveur:

``` sh
$ npm install -g nodemon
```

Installation des modules NodeJs du projet:

``` sh
$ npm install
```

Activer le serveur avec Nodemon:

``` sh
$ nodemon --debug ./app.js 3000
```

Vous pouvez maintenant visiter [http://localhost:3000/](http://localhost:3000/).
La distribution *frontend* est accessible via [http://localhost:3000/dist/app.html](http://localhost:3000/dist/app.html).

####Pour générer/modifier le frontend

Naviguer vers le dossier racine du frontend:

``` sh
$ cd defibatman/frontend-mobile/mobile
```

Installation des dépendances globales du côté serveur:

Grunt-cli
``` sh
$ npm install -g grunt-cli
```
Yeoman
``` sh
$ npm install -g yo
```
Yeoman / generator-mobile
``` sh
$ npm install -g generator-mobile
```

Visualiser les tâches Grunt disponibles:

``` sh
$ grunt -h
```
Partir un serveur:

``` sh
$ grunt server
```

Créer des *builds*:

``` sh
$ grunt build
```

Vous pouvez maintenant déplacer les builds dans la structure du serveur backend dans le dossier /build


##Documentation and Support

La documentation (Readme.md) et le Wiki se retrouvent sur le [site officiel du projet](https://github.com/smercier/defibatman). La documentation du code, générée en format HTML via [Grok](https://github.com/nevir/groc), est disponible (pour le code couvert) dans le dossier backend/doc
Documentation and FAQs about how to use Raw can be found on the [official website](http://raw.densitydesign.org). Development guide will be available soon on the Wiki of this repository. Sorry for this.


##Libraries

Le projet à été développé en utilisant beaucoup de librairies vraiment cool:

[Bootstrap (3.0.0)](https://github.com/twbs/bootstrap)
[Bower](https://github.com/bower/bower)
[jQuery](https://github.com/jquery/jquery)
[Leaflet](http://leafletjs.com/)
[Yeoman](http://yeoman.io/)
[Grunt](http://gruntjs.com/)

[NodeJs](http://nodejs.org/)
[Npm](https://npmjs.org/)
[Express (3.4.0)](http://expressjs.com/)
[Connect](https://github.com/senchalabs/connect)
[Consolidate](https://npmjs.org/package/consolidate)
[Nano](https://github.com/dscape/nano)
[Ecstatic](https://github.com/jesusabdullah/node-ecstatic)
[Mustache](https://npmjs.org/package/mustache)
[Grok](https://github.com/nevir/groc)

[CouchDB](http://couchdb.apache.org/)
[ElasticSearch](http://www.elasticsearch.org/)


##Feuille de route  ... TODO

- Améliorer la documentation

###Backend
- Verbes GET, PUT et DELETE de l'API REST.
- Volet Administratif
- Gestion des utilisateurs
- Tests unitaires et fonctionnels.

###Frontend

- Liste des sites cs
- Édition d'un site cs
- Suppression d'un site cs
- Vue utilisateur (liste des sites cs rapportés, etc.)
- Vues Informations sur le projet
- Vues Admin

Interfaces pour les écrans plus large ... actuellement seulement pour les mobiles.

###Geo
- Lier CouchDB avec ElasticSearch via river


##Équipe de développement & Contacts

L'application pour recenser et localiser les colonies de Chauves-Souris a été développée et maintenue par:

Simon Mercier <smercier@mapgears.com>
Stephane Lefebvre <prof.lebrun@gmail.com>
Camille VIOT <viotcam@gmail.com>
Renaud Dedenon <r.dedenon@gmail.com>
Anouk Simard <Anouk.Simard@mrn.gouv.qc.ca>

Si vous voulez en savoir plus sur le projet **Défi Batman**, le fonctionnement de l'application et les futurs développements, veuillez consulter le [site officiel du projet](https://github.com/smercier/defibatman).

Vous désirez contribuer à la suite du projet? Super! Juste à faire un *fork* du repo et à utiliser le système de Github pour signaller des problématiques et émettre des *pull requests*.


##Licence

>
> <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.fr">
> <img alt="Licence Creative Commons" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/3.0/80x15.png" />
> </a><br />Cette application est mise à disposition selon les termes de la <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.fr">Licence Creative Commons Attribution -  Partage dans les Mêmes Conditions 3.0 non transposé</a>.