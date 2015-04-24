# coding: utf-8
import logging
# TODO Remove only for testing
import json
import io
from config import JSON_DATA_PATH
log = logging.getLogger('paso.%s' % (__name__))


RESUMEN_RENAME = {
  'Electores': 'e',
  'Votantes': 'v',
  'Mesas': 'mt',
  'MesasInformadas': 'mi',
  'UltimaActualizacion': 'ut'
}

RESULTS_CANDIDATE_RENAME = {
    "id_candidato": "id",
    "votos": "v",
    "pct": "p"
}

RESULTS_PARTY_RENAME = {
    "votos": "v",
    "pct": "p",
    "id_partido": "id",
}

RESULTS_PARTY_SUMMARY_RENAME = {
    "votos": "v",
    "pct": "p",
}

SPECIAL_PARTIES = {
    "BLN": 1,
    "NUL": 0,
    "IMP": 0,
    "ERR": 0
}


def to_json(fname=None, d=None):
    with io.open('%s/%s.json'
                 % (JSON_DATA_PATH, fname),
                 'w', encoding='utf8') as f:
        log.debug("writing output JSON: %s.json" % (fname))
        f.write(json.dumps(d, ensure_ascii=False))


def t_rename_data(d=None, translation=None):
    '''translate desired data'''
    target_dict = {}
    for k, v in translation.iteritems():
        target_dict[v] = d[k]
    return target_dict


def t_resumen_API(origin_dict=None):
    '''get the desired data'''
    target_dict = {}
    for k, v in RESUMEN_RENAME.iteritems():
        target_dict[v] = origin_dict['resumen'][k]
    return target_dict


def t_results_section_API(d=None, comuna=None, dest_dict=None):
    '''Transform the received data
       to the desired format'''
    if not comuna:
        # 0 stores the global results for the election
        a99 = []
        a00 = []
        for idx, row in enumerate(d["general"][0]["partidos"]):
            a00.append(t_rename_data(row, RESULTS_PARTY_RENAME))
            if len(row["lista"]) == 1:
                a99.append(t_rename_data(row, RESULTS_PARTY_RENAME))
            else:
                # Create a dictionary for parties with more than one candidate
                dest_dict["partido_%s" 
                          % (row["id_partido"])] = \
                            {"resumen": t_rename_data(row, RESULTS_PARTY_SUMMARY_RENAME),
                             "comuna_%02d" % (comuna): [t_rename_data(l,RESULTS_CANDIDATE_RENAME) for l in row["lista"]]}
        dest_dict["partido_99"]["comuna_%02d" % (comuna)] = a99
        dest_dict["partido_00"]["comuna_%02d" % (comuna)] = a00
    else:
        a99 = []
        a00 = []
        for idx, row in enumerate(d["general"][0]["partidos"]):
            a00.append(t_rename_data(row, RESULTS_PARTY_RENAME))
            if len(row["lista"]) == 1:
                a99.append(t_rename_data(row, RESULTS_PARTY_RENAME)) 
            else:
                dest_dict["partido_%s" 
                          % (row["id_partido"])]["comuna_%02d" % (comuna)] = \
                            [t_rename_data(l,RESULTS_CANDIDATE_RENAME) for l in row["lista"]]
        dest_dict["partido_99"]["comuna_%02d" % (comuna)] = a99
        dest_dict["partido_00"]["comuna_%02d" % (comuna)] = a00
    return True

def t_results_API(origin_list=None, dest_dict=None):
    '''main transformation
       we need to switch from section based driven data
       to political party driven data'''
    for i, v in enumerate(origin_list):
        log.info("transform results for section %s" % (i))
        if not t_results_section_API(v, i, dest_dict):
            return False
        #to_json("test",dest_dict)
    return True
