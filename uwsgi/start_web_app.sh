#!/bin/sh

PROJECTDIR=/opt
WORKDIR=${PROJECTDIR}/uwsgi
CONFIG=uwsgi_webapp.ini

uwsgi --ini ${WORKDIR}/${CONFIG}
