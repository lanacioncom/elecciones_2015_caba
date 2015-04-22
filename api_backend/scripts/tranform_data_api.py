# coding: utf-8
import io
import json
import logging
import requests
import config
from time import sleep

BASE_URL = 'http://elecciones.santafe.gov.ar/departamento'

def run():
    config.init()
    logging.info("Contacting API endpoint")
    headers = {'user-agent': 'Mozilla/5.0',
               'X-Requested-With': 'XMLHttpRequest'}

    for i in range(1,4):
        url = BASE_URL + '/departamento-%02d/gobernador' % (i)
        logging.info("Get url %s" % (url))
        response = requests.get(url, headers=headers)


        if response.status_code == 200:
            with io.open('%s/results_santafe_dep%02d.json' % (config.REL_DATA_PATH, i),
                        'w', encoding='utf8') as f:
                f.write(json.dumps(response.json(), ensure_ascii=False))
        else:
            logging.error("API responded with code %s" % (response.status_code))

        # Give the server a break
        sleep(1)
if __name__ == '__main__':
    run()
