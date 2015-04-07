# coding: utf-8

RESULTS_DATA = [
    'formulas.csv',
    'listas.csv',
    'totales.csv',
]

DICTIONARY_DATA = [
    'formulas.csv',
    'listas.csv',
    'totales.csv',
]

FORMULAS_CREATE = '''
    CREATE TABLE formulas (
    tipo_elec_id INTEGER NOT NULL, 
    provincia_id VARCHAR(2) NOT NULL, 
    lista_id VARCHAR(4) NOT NULL, 
    candidatos VARCHAR(85) NOT NULL
);  
'''

LISTAS_STRUCTURE = '''
    CREATE TABLE
'''