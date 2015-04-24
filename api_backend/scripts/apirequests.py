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


def get_resumen_API():
    '''Get data about the election progress'''
    if PRODUCTION or not SIMULATE:
        url = BASE_URL + '/resumen'
        log.debug("Get url %s" % (url))
        response = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        if response.status_code == 200:
            return response.json()
        else:
            log.error("API responded with code %s" %
                      (response.status_code))
            return None
    else:
        # Get data from disk
        d = {u"time": u"000000"}
        try:
            with io.open('%s/resumen.json'
                         % (JSON_EXAMPLE_PATH), 'r') as f:
                j = json.loads(f.read(), encoding='utf8')
            return j
        except (IOError):
            log.error("Did not find JSON example file")
            return None
        return d


def get_results_section_API(comuna=None):
    '''Get the results for a given section'''
    if PRODUCTION or not SIMULATE:
        if comuna:
            suffix = GENERALES_SERVICE
        else:
            suffix = COMUNA_SERVICE + "?id=%s" % (comuna)
        url = BASE_URL + suffix
        log.debug("Get url %s" % (url))
        response = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        if response.status_code == 200:
            return response.json()
        else:
            log.error("API responded with code %s to %s request" %
                      (response.status_code, url))
            return None
    else:
        # Get data from disk
        d = {u"time": u"160000"}
        try:
            fname = '%s/comuna%d.json' % (JSON_EXAMPLE_PATH, comuna)
            print fname
            with io.open(fname, 'r') as f:
                j = json.loads(f.read(), encoding='utf8')
            return j
        except (IOError):
            log.error("Did not find JSON example file")
            return None
        return d


def get_results_API(o_l=None):
    '''Loop to get all the needed
       results from the API'''
    # Loop through the needed API services by section
    for i in range(0, 16):
        # Get the results by section
        r = get_results_section_API(i)
        if not r:
            return False
        o_l.append(r)
        #if not o_d["comuna_%02d" % (i)]:
        #    return False
    return True
