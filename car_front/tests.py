import os

print('##############')
BASE_DIR = (os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
print(os.path.split(BASE_DIR)[0])
print('##############')