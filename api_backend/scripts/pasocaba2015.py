# coding: utf-8
import logging
from config import init, BASE_URL, RESUMEN_SERVICE
from config import JSON_DATA_PATH, Paso2015
from apirequests import get_data_API, get_results_API
from apitransforms import t_resumen_API, t_results_API
from apitransforms import t_candidates_percentage, t_ranking
from apiio import write_API_data, get_stored_json, write_JSON_file
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
    final_dictionaries['resumen'] = t_resumen_API(new_resumen_dict)
    old_resumen_dict = get_stored_json('resumen')
    if old_resumen_dict:
        return update_time_increased(old_resumen_dict,
                                     final_dictionaries["resumen"])
    # Only when no old data was found
    return True


def run():
    try:
        start_time = time()
        init()
        log.info("Start time %s" % (start_time))
        log.debug("Checking for new data")
        if not is_new_data_available():
            return
        log.debug("New data detected getting results from API")
        # New data detected run the API comsuption process
        get_results_API(tmp_storage)
        log.debug("Finished retrieving the API data")
        # Transform the data
        t_results_API(tmp_storage, final_dictionaries)
        log.debug("Finished transforming the API data")
        write_API_data(final_dictionaries)
        log.debug("Finished writing the JSON results")

        # QuienEsQuien functionality
        log.debug("Start transforming candidates file")
        candidatesQeQ = t_candidates_percentage(tmp_storage)
        log.debug("Finished transforming candidates file")
        write_JSON_file(JSON_DATA_PATH, "quienesquien", candidatesQeQ)
        log.debug("Finished generating QeQ JSON file")

        # FrontPage Ranking vizualization
        log.debug("Start transforming front page file")
        front_page_ranking = t_ranking(final_dictionaries)
        log.debug("Finished transforming ranking file")
        write_JSON_file(JSON_DATA_PATH, "anexo", front_page_ranking)
        log.debug("Finished generating ranking JSON file")
        log.info("Execution time: %s seconds ---" % (time() - start_time))
    except Paso2015, e:
        log.error("Exit with exception in %s module" % (str(e)))


if __name__ == '__main__':
    run()
