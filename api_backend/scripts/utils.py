# coding: utf-8
import logging
from time import strptime
from config import SPECIAL_PARTIES, Paso2015
log = logging.getLogger('paso.%s' % (__name__))


def update_time_increased(od=None, nd=None):
    '''Compare times to determine if it has increased from
       last execution. Take into account midnight change'''
    ot = od["ut"]
    nt = nd["ut"]
    omp = od["mp"]
    nmp = nd["mp"]
    updated = False

    try:
        d_old = strptime(ot, "%Y-%m-%d %H:%M:%S")
        d_new = strptime(nt, "%Y-%m-%d %H:%M:%S")
        if (d_old < d_new):
            updated = True
    except TypeError:
        log.error("Could not parse dates %s - %s" % (ot, nt))
        try:
            f_omp = float(omp)
            f_nmp = float(nmp)
            if (f_omp < f_nmp):
                updated = True
        except ValueError:
            log.error("Could not parse table percentage %s - %s"
                      % (f_omp, f_nmp))
            raise Paso2015(__name__)

    if not updated:
        log.info('Did not find updated data, going back to sleep')
    return updated


def format_percentage(num=None):
    if type(num) is str or unicode:
        try:
            num = float(num)
        except ValueError, e:
            log.error("Could not convert to number reason %s" % (str(e)))
            raise Paso2015(__name__)
    return "{0:.1f}".format(num)


def get_percentage(dict=None, key1=None, key2=None):
    '''Get percentage formatted for the frontend app'''
    try:
        total = float(dict[key2])
        value = int(dict[key1])
    except KeyError, e:
        log.error("Did not find key: %s" % (key2))
        raise Paso2015(__name__)
    except ValueError, e:
        log.error("Could not convert to number reason %s" % (str(e)))
        raise Paso2015(__name__)

    p = value / total
    result = format_percentage(100 * p)
    return result


def sort_results_by_percentage(d=None, special=False):
    '''sort by percentage'''
    for i in range(0, 16):
        try:
            l = d["c_%02d" % i]
            l.sort(key=lambda x: int(x['v']), reverse=True)
            if special:
                # Move special parties to the bottom of list
                tmp = []
                indexes = []
                for idx, row in enumerate(l):
                    if (row["id"] in SPECIAL_PARTIES.keys()):
                        # Remove from the list and store in tmp list
                        tmp.append(row)
                        indexes.append(idx)
                # Remove indexes in inverse order not to generate
                # IndexOutOfBounds
                for i in reversed(indexes):
                    l.pop(i)
                tmp.sort(key=lambda x: SPECIAL_PARTIES[x["id"]], reverse=False)
                l.extend(tmp)
        except KeyError:
            log.error("Did not find key c_%02d in dict %s" % (i, d))
            raise Paso2015(__name__)