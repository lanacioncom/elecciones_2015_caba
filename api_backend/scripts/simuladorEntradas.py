#!/usr/bin/env python
# -*- coding: utf-8 -*-


import json, random, os

"""Crea tantos archivos como comunas se definan +1 que es el archivo de los totales: comuna0.json
Se considera un número de votos totales (votosTotales) para calcular los porcentajes correctamente, 
y estos votos se reparten de forma aleatoria entre todos los partidos y también aleatoriamente dentro 
de las listas de los partidos """

directorio = "jsonFolder"
numeroComunas = 15
numeroPartidos = 16
votosTotales = 500000
indicesListas = [2, 2, 2, 3, 7, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
idPartidosBase = 100  #ids 101, 102,...
nroPartidosBase = 200
idListasBase = 300
nroListasBase = 400
idCandidatoBase = 500

# si no existe el directorio lo crea
if not os.path.exists(directorio):
    os.makedirs(directorio)


def make_partido(id_partido, nro_partido, partido, votos, pct, iteracion):
	"""devuelve un diccionario de partido completo, recibe la iteración en la que
	se crea el partido para saber que número de listas asignarle al mismo"""	
	return dict(id_partido = id_partido, nro_partido = nro_partido, 
		partido = partido, votos = votos, pct = pct, 
		lista = get_listas(indicesListas[iteracion-1], votos))

def get_partidos(iterations):
	"""devuelve un array de diccionarios de partidos, recibe como iterations
	el número de partidos que queresmo usar"""
	id = idPartidosBase
	nro = nroPartidosBase
	partido = "Partido "
	votosCursados = random.randrange(1, votosTotales+1)
	votosSobrantes = votosTotales - votosCursados	
	arrayp = [make_partido(id+1, nro+1, partido+str(id+1), votosCursados, 
		float(votosCursados*100)/votosTotales, 1)]

	for i in range(2,iterations+1):
		# empezamos en 2 porque ya hemos creado el 1, 
		# vamos hasta iterations +1 para que acabe en interations

		if i < iterations:
			# no es la última iteración hacemos un random de los votos que nos sobran
			if votosSobrantes > 0:
				votos = votosSobrantes - random.randrange(1, votosSobrantes+1)
				votosCursados += votos
				votosSobrantes -= votos
			else:
				votos = 0
		else:
			# en la última iteración adjudicamos el resto de votos
			votos = votosSobrantes	

		arrayp.append(make_partido(id+i, nro+i, partido+str(id+i), votos, 
			float(votos*100)/votosTotales, i))

	return arrayp

def make_lista(id_lista, nro_lista, lista, id_candidato, candidato, votos, pct):
	"""devuelve un diccionario de lista completo"""
	return dict(id_lista = id_lista, nro_lista = nro_lista, lista = lista, 
		id_candidato = id_candidato, candidato = candidato, votos = votos, pct = pct)

def get_listas(iterations,votosLista):
	"""devuelve un array de listas de partidos, recibe como iteraciones el número 
	de idCandidatos de la lista que vamos a crear, así como el número de votos total 
	de la lista para repartirlos de manera aleatoria"""
	id = idListasBase
	nro = nroListasBase
	lista = "Lista "
	id_candidato = idCandidatoBase
	candidato = "Candidato "

	if iterations == 1:
		# sólo hay un candidato en la lista adjudicamos todos los votos
		votosCursados = votosLista
	else:
		# hay más de un candidato los adjudicamos de forma aleatoria
		votosCursados = random.randrange(1, votosLista+1)
		votosSobrantes = votosLista - votosCursados

	if votosLista == 0:
		# si la lista no tuvo votos forzamos el porcentaje a cero para 
		#evitar dividir por cero
		pct = 0
	else:
		pct = float(votosCursados*100)/votosLista

	arrayl = [make_lista(id+1, nro+1, lista+str(id+1), id_candidato+1, 
		candidato+str(id_candidato+1), votosCursados, pct)]
	
	for i in range(2,iterations+1):
		# empezamos en 2 porque ya hemos creado el 1, 
		# vamos hasta iterations +1 para que acabe en interations
		if i < iterations:
			if votosSobrantes > 0:
				votos = votosSobrantes - random.randrange(1, votosSobrantes+1)
				votosCursados += votos
				votosSobrantes -= votos
			else:
				votos = 0
		else:
			votos = votosSobrantes	
		if votosLista == 0:
			pct = 0
		else:
			pct = float(votos*100)/votosLista
		arrayl.append(make_lista(id+i, nro+i, lista+str(id+i), id_candidato+i, 
			candidato+str(id_candidato+i), votos, pct))

	return arrayl


for i in range (0,numeroComunas+1):
	data = dict(
		general = [dict(
			partidos = get_partidos(numeroPartidos))]
	)	

	f = open('%s/comuna%s.json'%(directorio,i), 'wb')
	f.write(json.dumps(data))
	f.close()