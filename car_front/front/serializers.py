from rest_framework import serializers
from .models import carItem

class carItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = carItem
        fields = ('org_link', 'desc', 'subject', 'region_name', 'price', 'images', 'phone_number', 'address', 'publish_time', 'km', 'car_type', 'engine_type')