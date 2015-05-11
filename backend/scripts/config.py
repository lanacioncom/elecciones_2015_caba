# coding: utf-8
import os
import logging
import logging.handlers
import socket
from default_settings import PROD_SERVER1, PROD_SERVER2

# Detection of production server environment
# By default enter PRODUCTION MODE
PRODUCTION = True
if socket.gethostname() in [PROD_SERVER1, PROD_SERVER2]:
    PRODUCTION = True
else:
    PRODUCTION = False

dir = os.path.dirname(__file__)
if PRODUCTION:
    JSON_DATA_PATH = '/var/www/paso2015/json_data'
    JSON_EXAMPLE_PATH = '/var/www/paso2015/sim_input'
else:
    JSON_DATA_PATH = os.path.join(dir, '../data')
    JSON_EXAMPLE_PATH = os.path.join(dir, '../examples/marta_API')

# PAY ATTENTION TO THIS ON PRODUCTION ############################
SIMULATE = False

# Logging configuration
LOG_FILENAME = 'pasocaba2015.log'
REL_LOGS_PATH = os.path.join(dir, '../logs')
log = logging.getLogger('paso')
LOG_FORMAT_DATA = '%(asctime)s %(name)-8s %(levelname)s: %(message)s'

BASE_URL = 'https://apipaso.buenosaires.gob.ar/api'
HEADERS = {'user-agent': 'Mozilla/5.0'}
# Wait n seconds for socket data
TIMEOUT = 10


GENERALES_SERVICE = '/generalesJef'
COMUNA_SERVICE = '/jefComuna'
RESUMEN_SERVICE = '/resumen'

SPECIAL_PARTIES = {
    "BLC": 0,
    "NUL": 1,
    "IMP": 1,
    "REC": 1
}

# QeQ config
PASS_THRESHOLD = 1.5


# Exception Handling
class Paso2015(Exception):
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return str(self.value)


def create_folder_structure():
    if not os.path.exists(REL_LOGS_PATH):
        os.makedirs(REL_LOGS_PATH)
    if not os.path.exists(JSON_DATA_PATH):
        os.makedirs(JSON_DATA_PATH)
    if not os.path.exists(JSON_EXAMPLE_PATH):
        os.makedirs(JSON_EXAMPLE_PATH)


def init():
    # Create folder structure
    try:
        create_folder_structure()
        # Configure logging
        if PRODUCTION:
            log.setLevel(logging.INFO)
            # log.setLevel(logging.DEBUG)
            # log.setLevel(logging.ERROR)
        else:
            log.setLevel(logging.DEBUG)
        # Add the log message handler to the logger
        handler = logging.handlers.RotatingFileHandler('%s/%s' %
                                                       (REL_LOGS_PATH,
                                                        LOG_FILENAME),
                                                       maxBytes=1048576,
                                                       backupCount=5)
        log_format = logging.Formatter(LOG_FORMAT_DATA)
        handler.setFormatter(log_format)
        log.addHandler(handler)
    except Exception, e:
        log.error("Error during initialization. Reason: %s" % (str(e)))
        raise Paso2015(__name__)
