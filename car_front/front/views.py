import datetime,time

from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render_to_response
from django.views.generic import ListView
from rest_framework.views import APIView


from .base import ResponseAPI
from .exceptions import ServerError
from .serializers import carItemSerializer
from . import response_status

from .models import carItem
from .utils.update_scrapy import *
import logging

logger = logging.getLogger(__name__)

class ListCar(ListView):

    '''
        Render mainpage home.html
    '''

    model = carItem
    template_name = 'home.html'
    context_object_name = 'caritem_list'
    ordering = '-publish_time'

    # def get(self, request, *args, **kwargs):
    #     if(request.user.is_authenticated):
    #         if(request.user.checkAdmin()):
    #             return super().get(request, *args, **kwargs)
    #         else:
    #             return render_to_response("invalid.html")
    #     else:
    #         return render_to_response("login.html")

    '''
        Add car_brand to user's response
    '''
    def get_context_data(self, **kwargs):
        context = super(ListCar, self).get_context_data(**kwargs)
        context['data'] = {
            # 'fromDate':datetime.datetime.now().strftime("%d-%m-%Y"),
            # 'toDate': datetime.datetime.now().strftime("%d-%m-%Y"),
            'car_brand': carItem.objects.values('car_brand').distinct()
        }
        return context

class UpdateCar(APIView):
    '''
        Call update car Scarpy Car Crawler
    '''
    def post(self, request, *args, **kwargs):
        returnCode = 1
        if('Update' in request.POST):
            returnCode = updateScrapy()
        if(returnCode == 0):
            return ResponseAPI(response_code=response_status.SUCCESS.code,
                               response_message=response_status.SUCCESS.message,
                               response_data=[]).resp
        else:
            return ResponseAPI(response_code=response_status.ERROR.code,
                               response_message=response_status.ERROR.message,
                               response_data=[]).resp

class ListCarj(APIView):
    def get(self, request):
        try:
            cars = carItem.objects.all()
        except Exception as e:
            raise ServerError(e.message)
        response_data = [carItemSerializer(car).data for car in cars]
        return ResponseAPI(response_code=response_status.SUCCESS.code,
                           response_message=response_status.SUCCESS.message,
                           response_data=response_data).resp

    def post(self, request):
        if(request.data['fromDate'] and request.data['toDate'] and request.data['car_brand'] != ''):
            try:
                cars = carItem.objects.filter(publish_time__gte=time.mktime(datetime.datetime.strptime(request.data['fromDate'], "%d-%m-%Y").timetuple()),
                                                   publish_time__lte=time.mktime(datetime.datetime.strptime(request.data['toDate'], "%d-%m-%Y").timetuple()), car_brand=request.data['car_brand'])
            except Exception as e:
                raise ServerError(e.message)
        elif (request.data['car_brand'] != '' and request.data['fromDate'] == '' and request.data['toDate'] == ''):
            try:
                cars = carItem.objects.filter(car_brand=request.data['car_brand'])
            except Exception as e:
                raise ServerError(e.message)
        elif (request.data['car_brand'] == '') and (request.data['fromDate'] != '' and request.data['toDate'] != ''):
            try:
                cars = carItem.objects.filter(publish_time__gte=time.mktime(datetime.datetime.strptime(request.data['fromDate'], "%d-%m-%Y").timetuple()),
                                                   publish_time__lte=time.mktime(datetime.datetime.strptime(request.data['toDate'], "%d-%m-%Y").timetuple()))
            except Exception as e:
                raise ServerError(e.message)
        else:
            try:
                cars = carItem.objects.all()
            except Exception as e:
                raise ServerError(e.message)
        response_data = [carItemSerializer(car).data for car in cars]
        return ResponseAPI(response_code=response_status.SUCCESS.code,
                           response_message=response_status.SUCCESS.message,
                           response_data=response_data).resp