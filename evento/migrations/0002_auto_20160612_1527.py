# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-12 18:27
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('localidade', '0001_initial'),
        ('usuario', '0001_initial'),
        ('evento', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventoparticipante',
            name='usuario',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuario.UsuarioDetalhe'),
        ),
        migrations.AddField(
            model_name='eventopalestrante',
            name='evento',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='evento.Evento', verbose_name='Evento'),
        ),
        migrations.AddField(
            model_name='eventoorganizador',
            name='evento',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='evento.Evento'),
        ),
        migrations.AddField(
            model_name='eventoorganizador',
            name='organizador',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuario.UsuarioDetalhe'),
        ),
        migrations.AddField(
            model_name='eventoavaliacao',
            name='evento',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='evento.Evento'),
        ),
        migrations.AddField(
            model_name='eventoavaliacao',
            name='usuario',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='evento.EventoParticipante'),
        ),
        migrations.AddField(
            model_name='eventoanexo',
            name='evento',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='evento.Evento'),
        ),
        migrations.AddField(
            model_name='evento',
            name='cidade',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='localidade.Cidade', verbose_name='Cidade'),
        ),
        migrations.AddField(
            model_name='evento',
            name='estado',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='localidade.Estado', verbose_name='Estado'),
        ),
        migrations.AddField(
            model_name='evento',
            name='pais',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='localidade.Pais', verbose_name='País'),
        ),
        migrations.AddField(
            model_name='evento',
            name='tipo_evento',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='evento.EventoTipo', verbose_name='Tipo do evento'),
        ),
        migrations.AddField(
            model_name='evento',
            name='usuario_cadastro',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuario.UsuarioDetalhe'),
        ),
    ]
