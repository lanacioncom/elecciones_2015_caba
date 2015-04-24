# coding: utf-8
import os
import logging
import logging.handlers
import socket

# Detection of production server environment
if socket.gethostname() in ['ip-10-236-191-179', 'ip-10-138-52-236']:
    PRODUCTION = True
else:
    PRODUCTION = False

dir = os.path.dirname(__file__)
if PRODUCTION:
    JSON_DATA_PATH = '/var/www/paso2015/json_data'
    JSON_EXAMPLE_PATH = '/var/www/paso2015/examples'
else:
    JSON_DATA_PATH = os.path.join(dir, '../data')
    JSON_EXAMPLE_PATH = os.path.join(dir, '../examples')

SIMULATE = False

# Logging configuration
LOG_FILENAME = 'pasocaba2015.log'
REL_LOGS_PATH = os.path.join(dir, '../logs')
log = logging.getLogger('paso')


BASE_URL = 'https://apipaso.buenosaires.gob.ar/api'
HEADERS = {'user-agent': 'Mozilla/5.0'}
# Wait 3 seconds for socket data
TIMEOUT = 3


GENERALES_SERVICE = '/generalesJef'
COMUNA_SERVICE = '/jefComuna'
RESUMEN_SERVICE = '/resumen'


def create_folder_structure():
    if not os.path.exists(REL_LOGS_PATH):
        os.makedirs(REL_LOGS_PATH)
    if not os.path.exists(JSON_DATA_PATH):
        os.makedirs(JSON_DATA_PATH)
    if not os.path.exists(JSON_EXAMPLE_PATH):
        os.makedirs(JSON_EXAMPLE_PATH)


def init():
    # Create folder structure
    create_folder_structure()
    # Configure logging
    log.setLevel(logging.DEBUG)
    #log.setLevel(logging.ERROR) 
    # Add the log message handler to the logger
    handler = logging.handlers.RotatingFileHandler('%s/%s' %
                                                   (REL_LOGS_PATH,
                                                    LOG_FILENAME),
                                                   maxBytes=1048576,
                                                   backupCount=5)
    log_format = logging.Formatter('%(asctime)s %(name)-8s %(levelname)s: %(message)s')
    handler.setFormatter(log_format)
    log.addHandler(handler)
    if PRODUCTION:
        log.info("Production environment detected")
