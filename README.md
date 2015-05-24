2015 PASO CABA Elections realtime results tracking
==================================================

## Introduction
This project was built to track the realtime results of the past 2015 PASO CABA elections in terms of which party and primary candidate has won in each district.

## Backend
For the backend we have used the provided [REST API](https://apipaso.buenosaires.gob.ar/api) for the 2015 Buenos Aires PASO elections.

We have parsed the results to generate the desired JSON files that the frontend app will display for the elections results in a map by district.

The automation of the execution is configured as a cronjob that was configured to run each minute _backend/scripts/cron_script.sh_

Usage info: [here](backend/README.md)

## Frontend
For the frontend we have opted to use _handlebars templates_ to dinamically generate the HTML code for the application.

We have shown the realtime results by district allowing the user to filter the results by clicking in a district.

The visualization also let's readers drill down the results by political party giving the resulting candidates ranking by district.

Usage info: [here](webapp/README.md)


## Server
We are using _npm_, _bower_ and _gulp_ to automate the optimization and deployment process.

The deployment takes care of minimizing, uglifying and versioning the static files so that it plays nice with the newsroom http cache configuration.

Usage info: [here](server/README.md)

## Technologies && Libraries
* Backend:
    [requests](http://docs.python-requests.org/en/latest/)
* Frontend:
    [handlebars](http://handlebarsjs.com/), [jquery](https://jquery.com/), [jquery.nicescroll](https://github.com/inuyaksa/jquery.nicescroll), [select2](https://select2.github.io/)

## Credits
* [Cristian Bertelegni](https://twitter.com/cbertelegni)
* [Juan Elosua](https://twitter.com/jjelosua)
* [Gastón de la llana](https://twitter.com/gasgas83)
* [Pablo Loscri](https://twitter.com/ploscri)

## Acknowledgments
* Florencia Fernandez Blanco && Mariana Trigo Viera for the generated copy and UX tips respectively 

