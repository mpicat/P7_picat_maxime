# PROJET 7 OPENCLASSROOM : Groupomania : Réseau social d'entreprise



## Prérequis
<ul>
    <li>Git</li>
    <li>Node.js et nvm.setup</li>
    <li>MySQL</li>
</ul>

Créer un dossier vide puis cloner ce repository à l'intérieur



## MySQL

Dans le dossier back, créer un fichier .env, puis à l'intérieur placer ces informations pour connecter votre future base de données MySQL : 
<ul>
    <li>DB_DATABASE = "groupomania"</li>
    <li>DB_USER = "root"</li>
    <li>DB_PASSWORD = "votre-password-MySQL"</li>
    <li>DB_DIALECT = "mysql"</li>
    <li>DB_HOST = "localhost"</li>
</ul>

Ajouter le mail de votre admin :
<ul>
    <li>SUPER_ADMIN_EMAIL = "votre-mail-d'admin"</li>
</ul>


Ouvrir MySQL Command Line Client, puis effectuer les deux lignes de code suivantes :

```
CREATE DATABASE groupomania;
USE groupomania;
```

Ouvrir MySQL Workbench, se connecter puis sélectionner la database groupomania créée précédemment, puis dans l'onglet Query :
<ul>
    <li>Cliquer sur l'icône "open a script file in this editor"</li>
    <li>Sélectionner un fichier .sql depuis le dossier groupomania récupéré avec le clone github</li>
    <li>Ouvrez le puis cliquez sur l'icône éclair "execute"</li>
    <li>Recommencez pour chaque fichier .sql du dossier, chacun représentant une table de la base de données</li>
</ul>



## SENDGRID
(Cette partie permet l'envoi de mails aux utilisateurs par l'application lors de leur création de compte)
<ul>
   <li>Aller sur le site de sendgrid : https://sendgrid.com/</li>
   <li>Créer un compte</li>
   <li>Une fois sur votre compte, cliquer sur settings, puis sender authentification</li>
   <li>Cliquer sur verify a single sender</li>
   <li>Créer le sender puis cliquer sur Create</li>
   <li>Une fois créé, revenir dans settings et cliquer sur API keys</li>
   <li>Cliquez sur Create API Key</li>
   <li>Donnez lui un nom</li>
   <li>Sélectionnez Resctricted Access</li>
   <li>Cliquez sur Mail Send et sélectionner tout (en cliquant à droite) puis cliquer sur Create & View</li>
   <li>Cliquer sur Done</li>
   <li>Une fois la clé obtenue, aller dans le dossier .env précédemment créé, et créer : API_KEY_NAME = "nom-de-votre-key-sendgrid"</li>
</ul>



## BACK END

Dans le fichier .env précédemment créé, créer :
<ul>
    <li>SECRET_TOKEN = "nom-de-votre-token"</li>
    <li>ADMIN_TOKEN = "nom-de-votre-token-admin"</li>
</ul>

Ouvrir un terminal dans le dossier back puis effectuer les lignes de commandes suivantes :

```
npm install
node server
```


## FRONT END
Ouvrir un autre terminal dans le dossier front-groupomania puis effectuer les lignes de commandes suivantes :
```
npm install
ng serve
```

Ouvrir le navigateur à l'adresse http://localhost:4200/


## APPLICATION
Créer l'utilisateur ADMIN avant tout autre utilisateur.