# coding: utf-8
import logging
import io
import json
from config import JSON_DATA_PATH
log = logging.getLogger('paso.%s' % __name__)


def get_stored_json(fname=None):
    '''Get the last general JSON file'''
    try:
        with io.open('%s/%s.json' % (JSON_DATA_PATH, fname), 'r', encoding='utf8') as f:
            j = json.loads(f.read(), encoding='utf8')
        log.debug("resumen json old data: %s" % (j))
        return j
    except (IOError):
        # First run
        return None


def write_API_data(d_d=None):
    '''Write the transformed JSON to disk'''
    for fname, d in d_d.iteritems():
        try:
            # with io.open('%s/%s.json'
            #              % (JSON_DATA_PATH, fname),
            #              'w', encoding='utf8') as f:
            with io.open('%s/%s.json'
                         % (JSON_DATA_PATH, fname),
                         'wb') as f:
                log.debug("writing output JSON: %s.json" % (fname))
                f.write(json.dumps(d, ensure_ascii=False))
        except (IOError):
            log.error("Failed to save JSON file %s" % (fname))
            return False
    return True
