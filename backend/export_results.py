#!/usr/bin/env python
# -*- coding: utf-8 -*-

# agregar candidatos al json

import json, random
from operator import itemgetter, attrgetter, methodcaller

EXAMPLE_DIR = 'examples/json'

# class ExportData(object):
# 	"""docstring for ExportData"""

# 	def __init__(self, arg):
# 		pass

def sort_data(a, key='porcentaje'):
	return sorted(a, key=lambda x: x[key], reverse = True)


def make_data(id = None, porcentaje = 100, votos = None):
	"""retorna el id y porcentaje para algún nodo definido"""
	return dict(id = id, porcentaje = random.randrange(1, porcentaje), votos=votos)


def make_data_comuna(cant):
	d = sort_data([make_data(x, 10) for x in range(cant)])
	return d


def get_comunuas(cant):
	"""los valores que recibe son reprecentativos"""
	return dict(
			# cada comuna tiene un listado de candidatos
				comuna_1 = make_data_comuna(cant),
				comuna_2 = make_data_comuna(cant),
				comuna_3 = make_data_comuna(cant),
				comuna_4 = make_data_comuna(cant),
				comuna_5 = make_data_comuna(cant),
				comuna_6 = make_data_comuna(cant),
				comuna_7 = make_data_comuna(cant),
				comuna_8 = make_data_comuna(cant),
				comuna_9 = make_data_comuna(cant),
				comuna_10 = make_data_comuna(cant),
				comuna_11 = make_data_comuna(cant),
				comuna_12 = make_data_comuna(cant),
				comuna_13 = make_data_comuna(cant),
				comuna_14 = make_data_comuna(cant),
				comuna_15 = make_data_comuna(cant),
			)
		


data = dict(
	general = dict(
		total = [make_data(x, 10) for x in range(10)],
		comunas = get_comunuas(10),
	),
	interna = dict(
		partido_id = 1,
		porcentaje = 20,
		total = [make_data(55, 20), make_data(55, 20), make_data(55, 20), ],
		comunas = get_comunuas(3),
	),

	candidatos = dict(),
)

f = open('%s/results_example.json' % (EXAMPLE_DIR), 'wb')
f.write(json.dumps(data))
f.close()
 

