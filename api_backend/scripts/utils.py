# coding: utf-8
import logging
from time import strptime
from config import SPECIAL_PARTIES
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
    except ValueError:
        log.error("Could not parse dates %s - %s" % (ot, nt))

    if not updated:
        try:
            f_omp = float(omp)
            f_nmp = float(nmp)
            if (f_omp < f_nmp):
                updated = True
        except ValueError:
            log.error("Could not parse table percentage %s - %s"
                      % (f_omp, f_nmp))

    if not updated:
        log.info('Did not find updated data, going back to sleep')
    return updated


def format_percentage(num=None):
    if type(num) is str or unicode:
        try:
            num = float(num)
        except ValueError, e:
            log.error("Could not convert to number reason %s" % (str(e)))
            # Exit abruptly
            exit(1)
    return "{0:.1f}".format(num)


def get_percentage(dict=None, key1=None, key2=None):
    '''Get percentage formatted for the frontend app'''
    try:
        total = float(dict[key2])
        value = int(dict[key1])
    except KeyError, e:
        log.error("Did not find key: %s" % (key2))
    except ValueError, e:
        log.error("Could not convert to number reason %s" % (str(e)))

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
            return False
    return True

# def clean_integer_data(s):
#     '''Get rid of spaces and spanish
#        number formatting and convert to integer'''
#     if (type(s) != int):
#         if (type(s) == str or type(s) == unicode):
#             s = s.strip().replace(".", "").replace(",", ".")
#             result = int(s)
#         else:
#             logging.error("Unexpected data type %s" % (s))
#     else:
#         result = s
#     return result


# def normalize_names(s):
#     '''Get rid of all spaces and lowercase'''
#     s = s.strip().replace(" ", "").lower()
#     return s


def sort_data(l=None, key='p', desc=True):
    '''sort data by key to ease frontend display'''
    return l.sort(key=lambda x: float(x[key]), reverse=desc)

# logging.basicConfig(filename='%s/LOG_FILENAME' % (REL_LOGS_PATH),
#                     level=logging.DEBUG,
#                     format='%(asctime)s %(levelname)s: %(message)s',
#                     datefmt='%Y%m%d-%H:%M:%S')