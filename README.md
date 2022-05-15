# PROJET 7 OPENCLASSROOM : Groupomania : Réseau social d'entreprise



## Prérequis :
<ul>
    <li>Git</li>
    <li>Node.js et nvm.setup</li>
    <li>MySQL</li>
</ul>

Créer un dossier vide puis cloner ce repository à l'intérieur



## MySQL :

Dans le fichier back, créer un dossier .en, puis à l'intérieur placer ces informations pour connecter votre future base de données MySQL : 
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


Ouvrir MySQL Command Line Client puis effectuer les deux lignes de code suivantes :

```
CREATE DATABASE groupomania;
USE groupomania;
```

Ouvrir MySQL Workbench et se connecter sur la database groupomania créée précédemment, puis :
<ul>
    <li>Cliquer sur Server</li>
    <li>Cliquer sur Data import</li>
    <li>Cliquer sur les ... et sélectionnez le dossier groupomania depuis le repository cloné</li>
    <li>Cliquer sur Start Import</li>
</ul>



## SENDGRID
(Cette partie permet l'envoi de mails par l'application aux users lors de leur création de compte)
<ul>
   <li>Aller sur le site de sendgrid : https://sendgrid.com/</li>
   <li>Créer un compte</li>
   <li>Puis une fois sur votre compte, cliquer sur settings, puis sender authentification</li>
   <li>Cliquer sur verify a single sender</li>
   <li>Créer le sender puis cliquer sur Create</li>
   <li>Une fois créé, revenir dans settings et cliquer sur API keys</li>
   <li>Cliquez sur Create API Key</li>
   <li>Donnez lui un nom</li>
   <li>Sélectionnez Resctricted Access</li>
   <li>Cliquez sur Mail Send et sélectionner tout (en cliquant à droite) puis cliquer sur Create & View</li>
   <li>Cliquer sur Done</li>
   <li>Une fois la clé obtenue, aller dans le dossier .env précédemment créé, créer : API_KEY_NAME = "nom-de-votre-key-sendgrid"</li>
</ul>



## BACK END

Dans le dossier .env précédemment créé, créer :
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
npm run serve
```

Ouvrir le navigateur à l'adresse http://localhost:4200/