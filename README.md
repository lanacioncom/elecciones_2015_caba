# elecciones_2015_caba


## Front End

### Install dependences

```bash
$ npm install & bower install
```

### Build web app for production

```bash
$ gulp build
```

### Run server

```bash
$ gulp server
```

### Deploy build to ftp production

Rename 'keys_ftp.js.example' to 'keys_ftp.js' and put in your keys

```bash
$ gulp deploy_ftp
```
## Backend

Uses the provided [REST API](https://apipaso.buenosaires.gob.ar/api) for the 2015 Buenos Aires PASO elections and parse the results to generate the desired JSON files that the frontend app will display for the elections results in a map by district.

The automation of the execution is configured as a cronjob that will run each minute 

[More info](api_backend/README.md)

## Tecnologías utilizadas:

+ Python
+ Handlebars
+ Jquery
+ Nice Scroll
+ Gulp.js
+ Bower


## Créditos:

+ Pablo Loscri
+ Juan Elosua
+ Gaston De La Llana
+ Mariana Trigo Viera
+ Florencia Fernandez Blanco
+ Cristian Bertelegni

