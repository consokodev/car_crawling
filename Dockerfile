FROM python:3.6-alpine3.8
USER root
RUN mkdir -p /opt && apk add build-base libffi-dev libxml2 g++ gcc libxslt-dev libxml2 libxml2-dev musl-dev python3-dev openssl-dev 
WORKDIR /opt
COPY requirements.txt .
RUN pip install -r requirements.txt
#COPY . ./
WORKDIR /opt/car_front
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
