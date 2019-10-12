FROM python:3.6-alpine3.8
USER root

#For alpine image
RUN mkdir -p /opt && apk add build-base libffi-dev libxml2 g++ gcc libxslt-dev libxml2 libxml2-dev musl-dev python3-dev openssl-dev linux-headers curl busybox-extras vim


#RUN mkdir -p /opt && apt-get update && apt-get install -y python3 python3-pip curl build-essential libssl-dev libffi-dev apt-utils libssl1.0.0

ENV WDIR /opt
WORKDIR $WDIR
COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY . .
WORKDIR $WDIR/car_front
ENTRYPOINT python3 manage.py makemigrations && python3 manage.py migrate && /bin/sh ../uwsgi/start_web_app.sh && /usr/bin/tail -f /dev/null
