Backend usage
=============

## Requirements
* Python 2.7.\* && virtualenv && pip installed 

## Process
1. Create a virtualenv

        $ virtualenv .venv

2. Activate the created virtualenv

        $ source .venv/bin/activate

3. Install dependencies

        $ pip install -r requirements.txt

4. Create PROD_SERVER1, PROD_SERVER2 environment variables to detect when the scripts are being executed on the production servers or change the default values inside default_settings.py

5. Run the script to test that everything is running correctly

        $ python scripts/pasocaba2015.py 

6. In the production environment we have created a cronjob (_backend/scripts/cron_script.sh_) that executes each minute to see if there are new results.

7. If we got new results (_checking the update timestamp_) we consumed the required API endpoints and transform them into the desired output. 

## Implementation notes

* Due to problems with the API availability we have implemented a simulated data API so that we could test the execution of the transformations without relying on the API endpoint availability. We can switch between real data and simulated data by changing the SIMULATE flag to True inside the _backend/scripts/config.py_ file.

* Since we needed to hit the API endpoint 16 times in order to get the required data for the frontend app. We decided that we would only generate new data if all the API calls were sucessful.




