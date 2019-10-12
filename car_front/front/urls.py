from django.conf import settings
from django.contrib.auth import logout
from django.urls import path

from . import views


urlpatterns = [
    path('', views.ListCar.as_view(), name='index'),
    path('listcar/', views.ListCarj.as_view(), name='listcar'),
    path('updatecar/', views.UpdateCar.as_view(), name='updatecar'),
    path('logout/', logout, {'next_page': settings.LOGOUT_REDIRECT_URL}, name='logout'),
]