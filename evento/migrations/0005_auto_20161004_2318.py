# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-10-05 02:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evento', '0004_eventoconvite'),
    ]

    operations = [
        migrations.AlterField(
            model_name='evento',
            name='evento_privado',
            field=models.BooleanField(default=False, verbose_name='Evento privado ?'),
        ),
    ]
