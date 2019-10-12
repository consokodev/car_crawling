import os

from django.conf import settings
from django.test import TestCase

# Create your tests here.
from django.db import connections
from django.db.utils import OperationalError

# settings.configure()
# settings.configure(default_settings='car_front.settings')
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'car_front.settings')
# db_conn = connections['default']
# try:
#     c = db_conn.cursor()
# except OperationalError:
#     connected = False
# else:
#     connected = True