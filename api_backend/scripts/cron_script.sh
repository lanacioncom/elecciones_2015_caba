#!/bin/bash
# This script activates a virtualenv
# then calls the script that will process the API
# and generate the final JSON files
source /var/www/paso2015/.venv/bin/activate && cd /var/www/paso2015/elecciones_2015_caba/api_backend && python scripts/pasocaba2015.py &> /dev/null