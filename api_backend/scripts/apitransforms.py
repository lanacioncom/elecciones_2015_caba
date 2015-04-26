# coding: utf-8
import logging
# TODO Remove only for testing
import json
import io
from utils import get_percentage, format_percentage, sort_results_by_percentage
from config import JSON_EXAMPLE_PATH, SPECIAL_PARTIES, PASS_THRESHOLD
from config import Paso2015
log = logging.getLogger('paso.%s' % (__name__))

PERC_KEYS = ["pct", "pct_total"]

RESUMEN_RENAME = {
  'Electores': 'e',
  'VotantesJef': 'v',
  'Mesas': 'mt',
  'MesasInformadas': 'mi',
  'UltimaActualizacion': 'ut'
}

RESULTS_CAND_RENAME = {
    "id_candidato": "id",
    "votos": "v",
    "pct": "p",
    "pct_total": "pt"
}

RESULTS_PARTY_RENAME = {
    "votos": "v",
    "pct": "p",
    "id_partido": "id",
}

RESULTS_PARTY_SUMM_RENAME = {
    "votos": "v",
    "pct": "p",
}


def to_json(fname=None, d=None):
    '''For testing purposes'''
    with io.open('%s/%s.json'
                 % (JSON_EXAMPLE_PATH, fname),
                 'w', encoding='utf8') as f:
        log.debug("writing output JSON: %s.json" % (fname))
        f.write(json.dumps(d, ensure_ascii=False))


def t_rename_data(d=None, translation=None, p_keys=None):
    '''translate desired data'''
    target_dict = {}
    try:
        for k, v in translation.iteritems():
            if (k in p_keys):
                d[k] = format_percentage(d[k])
            target_dict[v] = d[k]
    except KeyError, e:
        log.error("Could not find required key %s in %s" % (k, d))
        raise Paso2015(__name__)
    return target_dict


def t_resumen_API(origin_dict=None):
    '''get the desired data'''
    target_dict = {}
    try:
        for k, v in RESUMEN_RENAME.iteritems():
            target_dict[v] = origin_dict['resumen'][k]
    except KeyError:
        log.error("Could not find required key %s in %s" % (k, origin_dict))
        raise Paso2015(__name__)

    # Calculate table percentage
    mp = get_percentage(target_dict, 'mi', 'mt')
    target_dict["mp"] = mp

    # Calculate voting percentage
    vp = get_percentage(target_dict, 'v', 'e')
    target_dict["vp"] = vp
    return target_dict


def t_results_section_API(d=None, comuna=None, dest_dict=None):
    '''Transform the received data
       to the desired format'''
    a99 = []
    a00 = []
    try:
        if not comuna:
            # 0 stores the global results for the election
            data = d["general"][0]["partidos"]
        else:
            data = d["general"][0]["comunas"]["partidos"]
    except (KeyError, IndexError), e:
        log.error("Did not find data in memory. Reason" % (str(e)))
        raise Paso2015(__name__)

    try:
        for idx, row in enumerate(data):
            a00.append(t_rename_data(row, RESULTS_PARTY_RENAME, PERC_KEYS))
            if len(row["listas"]) == 1:
                # Do not include special parties inside "Listas únicas"
                if row["id_partido"] not in SPECIAL_PARTIES:
                    a99.append(t_rename_data(row,
                                             RESULTS_PARTY_RENAME,
                                             PERC_KEYS))
            else:
                # Create transformed array for parties with many candidates
                t_a = [t_rename_data(l, RESULTS_CAND_RENAME, PERC_KEYS)
                       for l in row["listas"]]
                if not comuna:
                    # First time we see the party create a dictionary for it
                    # and append results
                    t_d = {"r": t_rename_data(row,
                                              RESULTS_PARTY_SUMM_RENAME,
                                              PERC_KEYS),
                           "c_%02d" % (comuna): t_a}
                    # Create the key for the policitical party
                    # inside the target dict
                    dest_dict["partido_%s"
                              % (row["id_partido"])] = t_d
                else:
                    # For every other section
                    # We only need to create a section key
                    # with the candidates array
                    dest_dict["partido_%s"
                              % (row["id_partido"])]["c_%02d" % (comuna)] = t_a
    except KeyError, e:
        log.error("Error processing key. Reason %s" % (str(e)))
        raise Paso2015(__name__)
    except IndexError, e:
        log.error("Error processing index. Reason %s" % (str(e)))
        raise Paso2015(__name__)
    dest_dict["partido_99"]["c_%02d" % (comuna)] = a99
    dest_dict["partido_00"]["c_%02d" % (comuna)] = a00


def t_sort_results_API(d_d=None):
    ''' sort the results by descending percentage
        taking into account special parties at the bottom'''
    for k, v in d_d.iteritems():
        if k == "resumen":
            continue
        if k == "partido_00":
            sort_results_by_percentage(v, special=True)
        else:
            sort_results_by_percentage(v, special=False)


def t_results_API(origin_list=None, dest_dict=None):
    '''main transformation
       we need to switch from section based driven data
       to political party driven data'''
    for i, v in enumerate(origin_list):
        log.debug("transform results for section %s" % (i))
        t_results_section_API(v, i, dest_dict)

    # Sort special party results
    t_sort_results_API(dest_dict)
    # Write to file to preview intermediate result
    # to_json("datos_completos",dest_dict)


# QeQ candidates transformations
def t_candidates_percentage(d=None):
    '''Transform candidates percentage for piece automation'''
    try:
        data = d[0]["general"][0]["partidos"]
    except (KeyError, IndexError), e:
        log.error("Error getting data from memory. Reason %s"
                  % (str(e)))
        raise Paso2015(__name__)

    result = {}
    cand_list = []
    for row in data:
        # Skip special political parties
        try:
            if row["id_partido"] in SPECIAL_PARTIES:
                continue
            if (float(row["pct"]) >= PASS_THRESHOLD):
                party_passed = True
            else:
                party_passed = False
            # Get maximum number of votes for a party primary
            max_v = int(max(row["listas"],
                            key=lambda x: int(x["votos"]))["votos"])
            for c_d in row["listas"]:
                tmp_cand = {"id": c_d["id_candidato"],
                            "p": format_percentage(c_d["pct_total"]),
                            "g": "1" if (int(c_d["votos"]) == max_v) else "0",
                            "pp": "1" if party_passed else "0"}
                cand_list.append(tmp_cand)
        except (KeyError, ValueError, IndexError), e:
            log.error("Failed to get the candidate percentage. Reason: %s"
                      % (str(e)))
            raise Paso2015(__name__)
    # Order candidate list by descending percentage
    cand_list.sort(key=lambda x: float(x['p']), reverse=True)
    result["candidatos"] = cand_list
    return result


# Front page ranking transformations
def t_ranking(d_d=None):
    '''Transformation to obtain the ranking data for
       the front page'''
    try:
        data_parties = d_d["partido_00"]["c_00"]
        data_summary = d_d["resumen"]
    except KeyError, e:
        log.error("Error getting data from memory. Reason %s"
                  % (str(e)))
        raise Paso2015(__name__)

    result = {}
    # Get the summary of avaible voting tables
    result["mp"] = data_summary["mp"]
    # Get the top three parties
    parties_list = []
    try:
        for row in data_parties[0:3]:
            party = {"id": row["id"], "p": row["p"]}
            candidates_list = []
            try:
                data_primary = d_d["partido_%s" % (row["id"])]["c_00"]
                for c in data_primary[0:2]:
                    candidates_list.append({"id": c["id"], "pt": c["pt"]})
            except KeyError:
                # Did not find party try over the rest of "listas únicas"
                try:
                    data_primary = d_d["partido_99"]["c_00"]
                    # Inside "Listas únicas there is only one percentage"
                    candidates_list.append({"id": c["id"], "pt": c["p"]})
                except (KeyError, ValueError, IndexError), e:
                    log.error("Did not find the party. Reason %s"
                              % (str(e)))
                    raise Paso2015(__name__)
            party["candidatos"] = candidates_list
            parties_list.append(party)
    except IndexError, e:
        log.error("Did not find at least 3 parties. Reason %s"
                  % (str(e)))
        raise Paso2015(__name__)
    result["partidos"] = parties_list
    return result
