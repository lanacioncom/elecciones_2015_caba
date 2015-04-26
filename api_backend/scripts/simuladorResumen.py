#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" Genera un JSON del tipo
{  
   "resumen":{  
      "Electores":"2475000",
      "VotantesJef":"8860",
      "VotantesLeg":"8918",
      "VotantesCom":"8704",
      "Mesas":"7151",
      "MesasInformadas":"47",
      "UltimaActualizacion":"2015-04-24 21:05:01"
   }
}

Utilizando un archivo contadores.txt que se genera en el directorio auxiliar/ y creando como salida
un archivo resumen/resumen.json.
El número de Mesas Informadas va aumentando a pasos de 1 o 0 de manera aleatoria y el número de Votantes
aumenta en pasos aleatorios entre 0 y 100 en cada ejecución.

No es necesario crear un ningún directorio ya que en caso de no existir los directorios necesarios 
estos son creados por el script.
"""

import json, random, os, time
from os.path import exists


directorio = "auxiliar"
directorioOut = "resumen"

# si no existe el directorio lo crea
if not os.path.exists(directorio):
    os.makedirs(directorio)    
    f = open('%s/contadores.txt'%directorio, 'w+')
    f.write("0\n")
    f.write("0\n")
    f.write("0\n")
    f.write("0\n")
    f.close()

NumElectores = 2475000
NumMesas = 7151

f = open('%s/contadores.txt'%directorio, 'r+')
contador = f.readline()
VotantesJef =  f.readline()
VotantesLeg =  f.readline()
VotantesCom =  f.readline()


contadorNum = int(contador)
VotantesJefNum =  int(VotantesJef)
VotantesLegNum =  int(VotantesLeg)
VotantesComNum =  int(VotantesCom)


if contadorNum < NumMesas:
	contadorNum += random.randrange(0,2)
	

if VotantesJefNum < NumElectores-100:
	VotantesJefNum += random.randrange(0,101)
else:
	VotantesJefNum = NumElectores

if VotantesLegNum < NumElectores-100:
	VotantesLegNum += random.randrange(0,101)
else:
	VotantesLegNum = NumElectores

if VotantesComNum < NumElectores-100:
	VotantesComNum += random.randrange(0,101)
else:
	VotantesComNum = NumElectores

f.seek(0)	
f.write(str(contadorNum)+"\n")
f.write(str(VotantesJefNum)+"\n")
f.write(str(VotantesLegNum)+"\n")
f.write(str(VotantesComNum)+"\n")


data = dict(
			resumen = dict(
				Electores = str(NumElectores),
				VotantesJef = str(VotantesJefNum),
				VotantesLeg = str(VotantesLegNum),
				VotantesCom = str(VotantesComNum),
				Mesas = str(NumMesas),
				MesasInformadas = str(contadorNum),
				UltimaActualizacion = time.strftime("%Y-%m-%d %H:%M:%S")  #2015-04-24 21:05:01
			)
		)

f.close()

if not os.path.exists(directorioOut):
    os.makedirs(directorioOut)    

f = open('%s/resumen.json'% directorioOut, 'w')
f.write(json.dumps(data))
f.close()


print json.dumps(data)

