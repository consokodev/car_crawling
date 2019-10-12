import os
from django.conf import settings
import subprocess

def updateScrapy():
    os.chdir(settings.SCRIPT_PATH)
    # p = subprocess.Popen(['scrapy', "crawl", 'bonbanh', '--nolog'])
    # return p.returncode
    try:
        processOut = subprocess.check_call(['scrapy', "crawl", 'bonbanh', '--nolog'])
        processOut = subprocess.check_call(['scrapy', "crawl", 'chotot', '--nolog'])
    except subprocess.CalledProcessError as processOut:
        pass

    return processOut