FROM python:3.6-alpine3.8
USER root
RUN mkdir -p /opt && apk add build-base libffi-dev libxml2 g++ gcc libxslt-dev libxml2 libxml2-dev musl-dev python3-dev openssl-dev linux-headers
ENV WDIR /opt
WORKDIR $WDIR
COPY requirements.txt .
RUN pip install -r requirements.txt
WORKDIR $WDIR/car_front
#CMD ["/bin/sh"]
ENTRYPOINT python manage.py makemigrations && python manage.py migrate && /bin/sh ../uwsgi/start_web_app.sh && /usr/bin/tail -f /dev/null
