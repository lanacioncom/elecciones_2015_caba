# coding: utf-8
import dataset
import csvkit
import io, json
from models import RESULTS_DATA
from models import FORMULAS_CREATE

OUTPUT_DIR = 'examples/output_data'

def export_partidos():
    '''Show data'''
    q = ''' SELECT provincia_id, COUNT(*) c FROM %s GROUP BY provincia_id
    ''' % ('formulas')
    r = db.query(q)
    result = {}
    result['juan'] = 'juan'
    result['provincias'] = list(r)
    with io.open('%s/formulas.json' % OUTPUT_DIR, 'w', encoding='utf-8') as f:
        f.write(unicode(json.dumps({'result': result}, ensure_ascii=False)))
    #dataset.freeze(res, format='json', filename='%s/provincias_count.json' % (OUTPUT_DIR), indent=4, meta=None)

def export_internas():
    pass
    #table_formulas = db['formulas']
    #table_formulas = db['listas']
    #db.query(FORMULAS_CREATE)

def export_comunas(groupby=None):
    '''load results data'''

    #Formulas
    with open('%s/formulas.csv' % (DATA_DIR),'r') as f:
        table_formulas = db['formulas']
        reader = csvkit.py2.CSVKitDictReader(f,delimiter=';',encoding='utf-8')
        data = [row for row in reader]
        print data
        table_formulas.insert_many(data)

    with open('%s/listas.csv' % (DATA_DIR),'r') as f:
        table_formulas = db['listas']
        reader = csvkit.py2.CSVKitDictReader(f,delimiter=';',encoding='cp1252')
        data = [row for row in reader]
        #print data
        table_formulas.insert_many(data)

def run():
    export_partidos()

if __name__ == '__main__':
    #connect to the sqlite database
    db = dataset.connect()
    run()