# coding: utf-8
import logging
log = logging.getLogger('paso.%s' % (__name__))


def t_resumen_API(origin_dict=None):
    '''get the desired data'''
    target_dict = origin_dict
    return target_dict


def t_results_section_API(d=None, comuna=None):
    '''Transform the received data
       to the desired format'''
    return True


def t_results_API(origin_list=None, dest_ord_dict=None):
    '''main transformation
       we need to switch from section based driven data
       to political party driven data'''
    return True