#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json, csv

INPUT_FOLDER = "./data_input"
EXAMPLE_DIR = 'examples/json'


f = open( "%s/candidatos.csv" % INPUT_FOLDER, 'rb')

reader = csv.DictReader(f, delimiter=',')


fo = open('%s/dict_candidatos.json' % (EXAMPLE_DIR), 'wb')
fo.write(json.dumps(list(reader)))

fo.close()
f.close()

