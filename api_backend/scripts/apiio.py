# coding: utf-8
import logging
import io
import json
from config import JSON_DATA_PATH, Paso2015
log = logging.getLogger('paso.%s' % __name__)


def get_stored_json(fname=None):
    '''Get the last general JSON file'''
    try:
        with io.open('%s/%s.json' % (JSON_DATA_PATH, fname),
                     'r', encoding='utf8') as f:
            j = json.loads(f.read(), encoding='utf8')
        log.debug("resumen json old data: %s" % (j))
        return j
    except (IOError):
        log.warning("Did not find stored json, \
                    maybe it is the first execution")
        return None


def write_API_data(d_d=None):
    '''Write the transformed JSON to disk'''
    for fname, d in d_d.iteritems():
        write_JSON_file(JSON_DATA_PATH, fname, d)


def write_JSON_file(path=None, fname=None, data=None):
    '''Write JSON files to disk'''
    try:
        # with io.open('%s/%s.json'
        #                  % (JSON_DATA_PATH, fname),
        #                  'w', encoding='utf8') as f:
        #         log.debug("writing output JSON: %s.json" % (fname))
        #         f.write(json.dumps(d, ensure_ascii=False))
        with io.open('%s/%s.json'
                     % (JSON_DATA_PATH, fname),
                     'wb') as f:
            log.debug("writing output JSON: %s.json" % (fname))
            f.write(json.dumps(data, ensure_ascii=False))
    except IOError, e:
        log.error("Failed to save JSON file %s. Reason %s"
                  % (fname, str(e)))
        raise Paso2015(__name__)
