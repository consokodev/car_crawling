# Generated by Django 2.1.7 on 2019-06-13 08:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('front', '0002_user_permission'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='is_tool',
        ),
    ]
