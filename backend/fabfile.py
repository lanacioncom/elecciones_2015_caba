from fabric.api import *
import os
import sys

# Local path configuration (can be absolute or relative to fabfile)
env.deploy_path = 'output'
DEPLOY_PATH = env.deploy_path
env.dbname = 'paso_caba_2015.db'
DB_NAME = env.dbname

def drop_db():
    if os.path.isfile(DB_NAME):
        local('rm {dbname}'.format(**env))

def create_db():
    drop_db()
    local('sqlite3 {dbname} ";"'.format(**env))

def clean_data_dictionary():
    if os.path.isdir(DEPLOY_PATH):
        local('rm -rf {deploy_path}'.format(**env))
        local('mkdir {deploy_path}'.format(**env))

def import_results():
    with shell_env(DATABASE_URL='sqlite:///%s' % (DB_NAME)):
        local('python import_results.py')

def import_dictionary():
    with shell_env(DATABASE_URL='sqlite:///%s' % (DB_NAME)):
        local('python import_dictionary.py')

def transform():
    with shell_env(DATABASE_URL='sqlite:///%s' % (DB_NAME)):
        local('python transform.py')

def rebuild():
    clean_data_dictionary()
    clean_results()
    build()