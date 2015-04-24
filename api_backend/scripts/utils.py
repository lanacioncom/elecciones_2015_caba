# coding: utf-8
import logging
from time import strptime
log = logging.getLogger('paso.%s' % (__name__))


def get_filename(party=None):
    '''Create filename from the index
       pay attention with the last one that has to be renamed'''
    pass


def update_time_increased(od=None, nd=None):
    '''Compare times to determine if it has increased from
       last execution. Take into account midnight change'''
    ot = od["ut"]
    nt = nd["ut"]
    d_old = strptime(ot, "%Y-%m-%d %H:%M:%S")
    d_new = strptime(nt, "%Y-%m-%d %H:%M:%S")

    if (ot < nt):
        log.debug('Found new data %s - %s' %
                  (ot, nt))
        return True
    else:
        log.debug('Same data as before %s - %s' %
                  (ot, nt))
        return False


# def calculate_total(l=None, key='votos'):
#     '''Get the total number of votes
#        for a given list of dictionaries dataset'''
#     total = sum(clean_integer_data(r[key]) for r in l)
#     logging.debug("total votes: %d" % (total))
#     return total


# def get_percentage(total=None, v=None):
#     print v
#     total = float(total)
#     '''Get percentage formatted for the frontend app'''
#     result = float("{0:.1f}".format(100 * (clean_integer_data(v)/total)))
#     print ("%s" % result)
#     return result


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


# def sort_data(l=None, key='porcentaje'):
#     '''sort data by key to ease frontend display'''
#     return sorted(l, key=lambda x: x[key], reverse=True)

# logging.basicConfig(filename='%s/LOG_FILENAME' % (REL_LOGS_PATH),
#                     level=logging.DEBUG,
#                     format='%(asctime)s %(levelname)s: %(message)s',
#                     datefmt='%Y%m%d-%H:%M:%S')

# coding: utf-8

parties = {
#PRO
    "001": {"ln_id": "001", "esp": False},
#ECO
    "002": {"ln_id": "002", "esp": False},
#FPV
    "003": {"ln_id": "003", "esp": False},
#Surgen
    "004": {"ln_id": "004", "esp": False},
#MST
    "005": {"ln_id": "005", "esp": False},
#Bien común
    "006": {"ln_id": "006", "esp": False},
#LISTAS UNICAS
    # Frente por Buenos Aires
    "007": {"ln_id": "990", "esp": False},
    # Es Posible
    "008": {"ln_id": "991", "esp": False},
    # Camino popular
    "009": {"ln_id": "992", "esp": False},
    # Frente Izquierda
    "010": {"ln_id": "993", "esp": False},
    # Alternativa Buenos Aires
    "011": {"ln_id": "994", "esp": False},
    # Nuevo mas
    "012": {"ln_id": "995", "esp": False},
    # Partido Humanista
    "013": {"ln_id": "996", "esp": False},
    # Bandera vecinal
    "014": {"ln_id": "997", "esp": False},
    # Movimiento federal
    "015": {"ln_id": "998", "esp": False},
    # Autodeterminación y libertad
    "016": {"ln_id": "999", "esp": False},
#PARTIDOS ESPECIALES
    # Votos en blanco
    "BLN": {"ln_id": "BLN", "esp": True},
    # Votos nulos
    "NUL": {"ln_id": "NUL", "esp": True},
    # Votos Impugnados
    "IMP": {"ln_id": "IMP", "esp": True},
    # Votos Erroneos
    "ERR": {"ln_id": "ERR", "esp": True}
}

candidates = {
#PRO
    # Horacio Rodríguez Larreta
    "011" : {"p_ln_id": "001", "ln_id": "011", "lu": False},
    # Gabriela Michetti
    "012" : {"p_ln_id": "001", "ln_id": "012", "lu": False},
#ECO
    # Martín Lousteau
    "021" : {"p_ln_id": "002", "ln_id": "021", "lu": False},
    # Graciela Ocaña
    "022" : {"p_ln_id": "002", "ln_id": "022", "lu": False},
    # Andrés Borthagaray
    "023" : {"p_ln_id": "002", "ln_id": "023", "lu": False},
#FPV
    # Mariano Recalde
    "031" : {"p_ln_id": "003", "ln_id": "031", "lu": False},
    # Gabriela Cerruti
    "032" : {"p_ln_id": "003", "ln_id": "032", "lu": False},
    # Gustavo López
    "033" : {"p_ln_id": "003", "ln_id": "033", "lu": False},
    # Aníbal Ibarra
    "034" : {"p_ln_id": "003", "ln_id": "034", "lu": False},
    # Carlos Heller
    "035" : {"p_ln_id": "003", "ln_id": "035", "lu": False},
    # Carlos Oviedo
    "036" : {"p_ln_id": "003", "ln_id": "036", "lu": False},
    # Víctor Ramos
    "037" : {"p_ln_id": "003", "ln_id": "037", "lu": False},
#Surgen
    # Humberto Tumini
    "041" : {"p_ln_id": "004", "ln_id": "041", "lu": False},
    # Sergio Abrevaya
    "042" : {"p_ln_id": "004", "ln_id": "042", "lu": False},
#MST
    # Héctor Bidonde
    "051" : {"p_ln_id": "005", "ln_id": "051", "lu": False},
    # Sergio García
    "052" : {"p_ln_id": "005", "ln_id": "052", "lu": False},
    # Maru Lopes
    "053" : {"p_ln_id": "005", "ln_id": "053", "lu": False},
    # Martín Torres
    "054" : {"p_ln_id": "005", "ln_id": "054", "lu": False},
#Bien común
    # Gustavo Vera
    "061" : {"p_ln_id": "006", "ln_id": "061", "lu": False},
    # Leonardo Fabre
    "062" : {"p_ln_id": "006", "ln_id": "062", "lu": False},
# LISTAS UNICAS
    # Guillermo Nielsen
    "990" : {"p_ln_id": "990", "ln_id": "990", "lu": True},
    # Ivo Cutzarida
    "991" : {"p_ln_id": "991", "ln_id": "991", "lu": True},
    # Claudio Lozano
    "992" : {"p_ln_id": "992", "ln_id": "992", "lu": True},
    # Myriam Bregman
    "993" : {"p_ln_id": "993", "ln_id": "993", "lu": True},
    # Pablo Ferreyra
    "994" : {"p_ln_id": "994", "ln_id": "994", "lu": True},
    # Manuela Castañeira
    "995" : {"p_ln_id": "995", "ln_id": "995", "lu": True},
    # Gustavo Tenaglia
    "996" : {"p_ln_id": "996", "ln_id": "996", "lu": True},
    # Ramiro Vasena
    "997" : {"p_ln_id": "997", "ln_id": "997", "lu": True},
    # Enrique Piragini
    "998" : {"p_ln_id": "998", "ln_id": "998", "lu": True},
    # Luis Zamora
    "999" : {"p_ln_id": "999", "ln_id": "999", "lu": True},  
}