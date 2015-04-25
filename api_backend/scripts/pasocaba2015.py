# coding: utf-8
import logging
from config import init, BASE_URL, RESUMEN_SERVICE
from apirequests import get_data_API, get_results_API
from apitransforms import t_resumen_API, t_results_API
from apiio import write_API_data, get_stored_json
from utils import update_time_increased
from time import time
log = logging.getLogger('paso.%s' % (__name__))

# GLOBAL VARS
final_dictionaries = {"partido_00": {}, "partido_99": {}}
tmp_storage = []


def is_new_data_available():
    '''This function will serve as a trigger
       to launch the API consumption process'''

    # First try to grab the data from the site
    url = BASE_URL + RESUMEN_SERVICE
    new_resumen_dict = get_data_API(url, 'resumen')
    if not new_resumen_dict:
        return False
    final_dictionaries['resumen'] = t_resumen_API(new_resumen_dict)
    old_resumen_dict = get_stored_json('resumen')
    if old_resumen_dict:
        return update_time_increased(old_resumen_dict,
                                     final_dictionaries["resumen"])
    log.debug('Did not find old json file, continue processing')
    return True


def run():
    start_time = time()
    init()
    log.debug("Start time %s" % (start_time))
    log.debug("Checking for new data")
    if not is_new_data_available():
        return
    log.debug("New data detected getting results from API")
    # New data detected run the API comsuption process
    if not get_results_API(tmp_storage):
        return
    log.debug("Finished retrieving the API data")
    # Transform the data
    if not t_results_API(tmp_storage, final_dictionaries):
        return
    log.debug("Finished transforming the API data")
    if not write_API_data(final_dictionaries):
        return
    log.debug("Finished writing the JSON results")
    log.info("Execution time: %s seconds ---" % (time() - start_time))


if __name__ == '__main__':
    run()
