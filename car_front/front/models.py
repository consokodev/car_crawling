from django.contrib.auth.models import AbstractUser
from django.db import models
from django_unixdatetimefield import UnixDateTimeField
from .utils.fields import JSONField

# Create your models here.

class carItem(models.Model):
    org_link = models.CharField(max_length=200, primary_key=True)
    desc = models.CharField(max_length=200, null=True)
    subject = models.CharField(max_length=400, null=True)
    region_name = models.CharField(max_length=200, null=True)
    price = models.CharField(max_length=200, null=True)
    images = models.TextField(null=True)
    phone_number = models.CharField(max_length=200, null=True)
    address = models.CharField(max_length=200, null=True)
    publish_time = UnixDateTimeField(null=True)
    km = models.CharField(max_length=200, null=True)
    car_type = models.CharField(max_length=200, null=True)
    engine_type = models.CharField(max_length=200, null=True)
    car_brand = models.CharField(max_length=200, null=True)

    def __str__(self):
        return self.org_link

class User(AbstractUser):
    permission = JSONField(blank=True, null=True)

    class Meta:
        app_label = "front"

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if self.permission is None:
            self.permission = { "admin": 0, "user": {}}
        super().save(*args, **kwargs)


    def checkAdmin(self):
        try:
            return True if self.permission["admin"] else False
        except:
            return False
    def checkUser(self):
        try:
            return next((True for key, value in self.permission["user"].items() if value), False)
        except:
            False
    def get_features(self):
        features = [
            {
                "name": "Car",
                "url": ""
            },
        ]
        if(self.permission["admin"]):
            features.append({
                "name": "Admin",
                "url": "admin-settings",
            })
            return features
        elif(next((True for key, value in self.permission["user"].items() if value), False)):
            return features
        else:
            return None