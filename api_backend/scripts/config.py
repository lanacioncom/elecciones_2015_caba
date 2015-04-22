# coding: utf-8
import os
import logging

dir = os.path.dirname(__file__)
REL_DATA_PATH = os.path.join(dir, '../data')
REL_LOGS_PATH = os.path.join(dir, '../logs')

def create_folder_structure():
    if not os.path.exists(REL_DATA_PATH): 
        os.makedirs(REL_DATA_PATH)
    if not os.path.exists(REL_LOGS_PATH): 
        os.makedirs(REL_LOGS_PATH)

def init():
    # Create folder structure
    create_folder_structure()
    # Configure logging
    logging.basicConfig(filename='%s/process.log' % (REL_LOGS_PATH),
                        level=logging.DEBUG,
                        format='%(asctime)s %(levelname)s: %(message)s', datefmt='%Y%m%d-%H:%M:%S')