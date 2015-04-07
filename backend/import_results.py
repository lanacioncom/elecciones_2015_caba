# coding: utf-8
import dataset
import csvkit
from models import RESULTS_DATA
from models import FORMULAS_CREATE

DATA_DIR = 'data'


def drop_tables():
    '''Drop all the tables'''
    for item in db.tables:
        t = db.get_table(item)
        #print t
        t.drop()

def create_dbmodel():
    pass
    #table_formulas = db['formulas']
    #table_formulas = db['listas']
    #db.query(FORMULAS_CREATE)

def load_results():
    '''load results data'''

    #Formulas
    with open('%s/formulas.csv' % (DATA_DIR),'r') as f:
        table_formulas = db['formulas']
        reader = csvkit.py2.CSVKitDictReader(f,delimiter=';',encoding='utf-8')
        data = list(reader)
        table_formulas.insert_many(data)

    with open('%s/listas.csv' % (DATA_DIR),'r') as f:
        table_formulas = db['listas']
        reader = csvkit.py2.CSVKitDictReader(f,delimiter=';',encoding='cp1252')
        data = list(reader)
        table_formulas.insert_many(data)

def run():
    drop_tables()
    create_dbmodel()
    load_results()

if __name__ == '__main__':
    #connect to the sqlite database
    db = dataset.connect()
    run()