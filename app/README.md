# Projet Défi Batman

Le **Défi Batman** est un outil  réalisé dans le cadre du GéoHack 2013.

Ce projet est le résultat du travail de l'équipe **Défi Batman** tenu lors
du [Défi GéoHack MTL le 2 octobre 2013](http://defigeohackmtl.org/).  L'objectif de ce défi était de créer une
application mobile pour recenser et localiser les colonies de Chauves-Souris.


**Répertoire officiel:** [https://github.com/smercier/defibatman](https://github.com/smercier/defibatman)


###**Contexte**

En moins de trois ans, plusieurs espèces de chauves-souris, ont connu un déclin supérieur à 90%.
La principale cause est une infection fongique qui s’est propagée au Québec en 2010. Pour mieux
suivre le déclin des populations de chauves-souris, le Ministère du Développement Durable, Environnement,
Faune et Parc (MDDEFP) [sollicite la collaboration des citoyens](http://www.mddefp.gouv.qc.ca/infuseur/communique.asp?no=2538) pour trouver des colonies de chauves-souris, mais
aimerait avoir un moyen plus simple que de recueillir l’information par téléphone.
Ce projet vise à doter cette organisation d’une application Web mobile simple qui permettrait de localiser
dynamiquement sur une carte les maternités de chauves-souris et de pouvoir y faire des recensements d’individu.

###**Documentation & Support**

La documentation (Readme.md) et le Wiki se retrouvent sur le [site officiel du projet](https://github.com/smercier/defibatman). La documentation du code, générée en format HTML via [Grok](https://github.com/nevir/groc), est disponible (pour le code couvert) dans le dossier /doc ou simplement en consultant les liens suivants:  

[Serveur (app.js)](app.html)   
[API (routes/api.js)](routes/api.html)   
[AUTH (routes/auth.js)](routes/auth.html)   
[Modèle CouchDB (models/model.html)](models/model.html)   

###**Utilisation**
La façon la plus facile d'utiliser le projet consiste à accéder à la version disponible sur le serveur mapgears en visitant le url [...](). Vous pouvez également faire rouler le tout en local sur votre machine, juste à suivre les instrucions un peu plus bas.


###**Installation**
  
####**Prérequis**

[Git](http://git-scm.com/book/en/Getting-Started-Installing-Git)   
[NodeJs (v0.10.20)](http://nodejs.org/)    
[CouchDB (v1.2.2 et +)](http://couchdb.apache.org/)    
[ElasticSearch (optionnel pour l'instant)](http://www.elasticsearch.org/)    
    
    

###**Étapes**   

######**1. Cloner le projet**   

Clonage du projet via lignes de commandes:

``` sh
$ git clone git@github.com:smercier/defibatman.git
```

**!** Ou encore mieux, faire un fork du projet via [GitHub](https://github.com) et cloner votre fork. 
Il sera ainsi plus facile de collaborer et de soumettre des pull request. 

######**2. Configuration et gestion des dépendances**   

Naviguer vers le dossier racine de l'application:

``` sh
$ cd defibatman/app/
```

**Installation des dépendances globales**

Nodemon
``` sh
$ npm install -g nodemon
```

Grunt-cli
``` sh
$ npm install -g grunt-cli
```

**Installation du Frontend**

Naviguer vers le dossier /mobile (defibatman/app/mobile):

``` sh
$ cd mobile
```
Installer les modules nécessaires:

``` sh
$ npm install
```

Construire l'application (build):
``` sh
$ grunt build
```

**Installation du Backend**

Revenir au dossier /app (defibatman/app):

``` sh
$ cd ..
```
Installer les modules nécessaires au serveur:

``` sh
$ npm install
```

Construire l'application serveur(build):

``` sh
$ grunt build
```

Votre application est maintenant installée!

######**3. Activer le serveur**

Activer le serveur avec Nodemon:

``` sh
$ nodemon --debug ./app.js 3000
```

Vous pouvez maintenant visiter [http://localhost:3000/](http://localhost:3000/).

***
***

######**Pour générer/modifier le frontend**

Naviguer vers le dossier racine du frontend:

``` sh
$ cd defibatman/app/mobile
```

**Installation des dépendances globales du côté serveur**

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
Ex.: Partir un serveur:

``` sh
$ grunt server
```

Ex.: Créer des *builds*:

``` sh
$ grunt build
```

Vous pouvez maintenant déplacer les builds dans la structure du serveur backend dans le dossier /build. En mode manuel ou via la commande grunt build du dossier app.    
Visitez [Yeoman generator-mobile](https://github.com/yeoman/generator-mobile) pour en savoir plus!

###**Libraries**

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
[Nano](https://github.com/dscape/nano)  
[Ecstatic](https://github.com/jesusabdullah/node-ecstatic)  
[Mustache](https://npmjs.org/package/mustache)  
[Grok](https://github.com/nevir/groc)  

[CouchDB](http://couchdb.apache.org/)  
[ElasticSearch](http://www.elasticsearch.org/)  


###**Feuille de route  ... TODO**

> Améliorer la documentation   

**Backend**   
> Verbes GET, PUT et DELETE de l'API REST   
> Volet Administratif   
> Gestion des utilisateurs   
> Tests unitaires et fonctionnels   

**Frontend**  

> Liste des sites cs    
> Édition d'un site cs    
> Suppression d'un site cs    
> Vue utilisateur (liste des sites cs rapportés, etc.)   
> Vues Informations sur le projet   
> Vues Admin   

Interfaces pour les écrans plus large ... actuellement seulement pour les mobiles   

**Geo**  
> Lier CouchDB avec ElasticSearch via river    
      
      

###**Équipe de développement**    
###**& Contacts**

L'application pour recenser et localiser les colonies de Chauves-Souris a été développée et maintenue par:  
   
Simon Mercier <smercier@mapgears.com>   
Stephane Lefebvre <prof.lebrun@gmail.com>    
Camille VIOT <viotcam@gmail.com>  
Renaud Dedenon <r.dedenon@gmail.com>  
Anouk Simard <Anouk.Simard@mrn.gouv.qc.ca>  

Si vous voulez en savoir plus sur le projet **Défi Batman**, le fonctionnement de l'application et les futurs développements, veuillez consulter le [site officiel du projet](https://github.com/smercier/defibatman).

Vous désirez contribuer à la suite du projet? Super! Juste à faire un *fork* du repo et à utiliser le système de Github pour signaller des problématiques et émettre des *pull requests*.


###**Licence**    

> <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.fr">
> <img alt="Licence Creative Commons" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/3.0/80x15.png" />
> </a><br />Cette application est mise à disposition selon les termes de la <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.fr">Licence Creative Commons Attribution -  Partage dans les Mêmes Conditions 3.0 non transposé</a>.