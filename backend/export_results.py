#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json

class ExportData(object):
	"""docstring for ExportData"""

	def __init__(self, arg):
		pass



def make_data(id = None, porcentaje = None):
	"""retorna el id y porcentaje para algún nodo definido"""
	return dict(id = id, procentaje = porcentaje)


data = dict(
	general = dict(
		total = [make_data(x, 10) for x in range(10)],
		comunas = dict(
			# cada comuna tiene un listado de candidatos
				comuna_1 = [make_data(x, 10) for x in range(10)], 
				comuna_2 = [make_data(x, 10) for x in range(10)],
				comuna_3 = [make_data(x, 10) for x in range(10)],
				comuna_4 = [make_data(x, 10) for x in range(10)],
				comuna_5 = [make_data(x, 10) for x in range(10)],
				comuna_6 = [make_data(x, 10) for x in range(10)],
				comuna_7 = [make_data(x, 10) for x in range(10)],
				comuna_8 = [make_data(x, 10) for x in range(10)],
				comuna_9 = [make_data(x, 10) for x in range(10)],
				comuna_10 = [make_data(x, 10) for x in range(10)],
				comuna_11 = [make_data(x, 10) for x in range(10)],
				comuna_12 = [make_data(x, 10) for x in range(10)],
				comuna_13 = [make_data(x, 10) for x in range(10)],
				comuna_14 = [make_data(x, 10) for x in range(10)],
				comuna_15 = [make_data(x, 10) for x in range(10)],
			)
		),

	interna = dict(
		partido_id = 1,
		porcentaje = 20,
		total = [make_data(55, 20), make_data(55, 20), make_data(55, 20), ],
		comunas = dict(
			# cada comuna tiene un listado de candidatos
				comuna_1 = [make_data(x, 10) for x in range(3)], 
				comuna_2 = [make_data(x, 10) for x in range(3)],
				comuna_3 = [make_data(x, 10) for x in range(3)],
				comuna_4 = [make_data(x, 10) for x in range(3)],
				comuna_5 = [make_data(x, 10) for x in range(3)],
				comuna_6 = [make_data(x, 10) for x in range(3)],
				comuna_7 = [make_data(x, 10) for x in range(3)],
				comuna_8 = [make_data(x, 10) for x in range(3)],
				comuna_9 = [make_data(x, 10) for x in range(3)],
				comuna_10 = [make_data(x, 10) for x in range(3)],
				comuna_11 = [make_data(x, 10) for x in range(3)],
				comuna_12 = [make_data(x, 10) for x in range(3)],
				comuna_13 = [make_data(x, 10) for x in range(3)],
				comuna_14 = [make_data(x, 10) for x in range(3)],
				comuna_15 = [make_data(x, 10) for x in range(3)],
			)
		),
	)

f = open('data_test/data.json', 'wb')
f.write(json.dumps(data))
f.close()
# print json.dumps(data) 