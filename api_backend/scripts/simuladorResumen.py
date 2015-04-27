#!/usr/bin/env python
# -*- coding: utf-8 -*-

''' Genera un JSON del tipo
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
'''

import json
import random
import time
from os.path import exists
from os import makedirs


folder_aux = "aux"
folder_out = "resumen"

# Create folder if it does not exists
if not exists(folder_aux):
    makedirs(folder_aux)
    # Auxliary file to generate target JSON
    f = open('%s/counters.txt' % (folder_aux), 'w+')
    f.write("0\n")
    f.write("0\n")
    f.write("0\n")
    f.write("0\n")
    f.close()

NUM_ELECTORES = 2475000
NUM_MESAS = 7151

f = open('%s/counters.txt' % (folder_aux), 'r+')
contador = f.readline()
VotantesJef = f.readline()
VotantesLeg = f.readline()
VotantesCom = f.readline()


contadorNum = int(contador)
VotantesJefNum = int(VotantesJef)
VotantesLegNum = int(VotantesLeg)
VotantesComNum = int(VotantesCom)


if contadorNum < NUM_MESAS:
    contadorNum += random.randrange(0, 2)

if VotantesJefNum < NUM_ELECTORES-100:
    VotantesJefNum += random.randrange(0, 101)
else:
    VotantesJefNum = NUM_ELECTORES

if VotantesLegNum < NUM_ELECTORES-100:
    VotantesLegNum += random.randrange(0, 101)
else:
    VotantesLegNum = NUM_ELECTORES

if VotantesComNum < NUM_ELECTORES-100:
    VotantesComNum += random.randrange(0, 101)
else:
    VotantesComNum = NUM_ELECTORES

f.seek(0)
f.write(str(contadorNum)+"\n")
f.write(str(VotantesJefNum)+"\n")
f.write(str(VotantesLegNum)+"\n")
f.write(str(VotantesComNum)+"\n")
f.close()

data = dict(
            resumen=dict(
                Electores=str(NUM_ELECTORES),
                VotantesJef=str(VotantesJefNum),
                VotantesLeg=str(VotantesLegNum),
                VotantesCom=str(VotantesComNum),
                Mesas=str(NUM_MESAS),
                MesasInformadas=str(contadorNum),
                UltimaActualizacion=time.strftime("%Y-%m-%d %H:%M:%S")  #2015-04-24 21:05:01
            )
        )

if not exists(folder_out):
    makedirs(folder_out)

with open('%s/resumen.json' % (folder_out), 'w') as f:
    f.write(json.dumps(data))

print data
