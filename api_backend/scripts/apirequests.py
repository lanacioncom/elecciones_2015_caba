# coding: utf-8
import logging
import requests
from config import BASE_URL, HEADERS, TIMEOUT
from config import GENERALES_SERVICE, COMUNA_SERVICE
from config import PRODUCTION
# For testing with no data
import json
import io
from config import SIMULATE, JSON_EXAMPLE_PATH

log = logging.getLogger('paso.%s' % (__name__))


def get_data_API(url=None, fname=None):
    if PRODUCTION or not SIMULATE:
        log.debug("Get url %s" % (url))
        response = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        if response.status_code == 200:
            return response.json()
        else:
            log.error("API responded with code %s" %
                      (response.status_code))
            return None
    else:
        log.warning('Simulating API data for url %s' % (url))
        try:
            with io.open('%s/%s.json'
                         % (JSON_EXAMPLE_PATH, fname), 'r') as f:
                j = json.loads(f.read(), encoding='utf8')
            return j
        except (IOError):
            log.error("Did not find JSON example file")
            return None


def get_results_API(o_l=None):
    '''Loop to get all the needed
       results from the API'''
    # Loop through the needed API services by section
    for i in range(0, 16):
        # Get the results by section
        if not i:
            suffix = GENERALES_SERVICE
        else:
            suffix = COMUNA_SERVICE + "?id=%s" % (i)
        url = BASE_URL + suffix
        r = get_data_API(url, 'comuna%d' % (i))
        if not r:
            return False
        o_l.append(r)
    return True
