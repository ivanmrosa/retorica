# coding: utf-8
import json
from django.shortcuts import render, HttpResponse
from .models import UsuarioDetalhe
from evento.models import EventoParticipante, EventoPeriodo, Evento
from django.contrib.auth import authenticate, login
from django.core import serializers


# Create your views here.


def home(request):
    return render(request=request, template_name='usuario/home.html', context={"TITULO": "Retórica - Home"})


def logar(request):
    username = request.POST.get('username', "")
    password = request.POST.get('password', "")
    user = authenticate(username=username, password=password)

    if user is not None:
        if user.is_active:
            login(request, user)
            return HttpResponse('{"logged": "true", "msg": ""}')
        else:
            return HttpResponse('{"logged": "false", "msg": "O usuário está inativo."}')
    else:
        return HttpResponse('{"logged": "false", \
                             "msg": "A combinação entre usuário e senha não pôde ser confirmada. Informe dados válidos."}')


def ObtemEventosUsuario(request):
    usuario = UsuarioDetalhe.objects.filter(pk=2)
    eventos = EventoParticipante.objects.filter(usuario=usuario).values('evento_periodo__evento__titulo',
                                                                        'evento_periodo__evento__id',
                                                                        'evento_periodo__data')

    #    return HttpResponse(serializers.serialize("json", usuario))
    return HttpResponse(eventos)
    #    return render_to_response('base.html', {"PAGINA_TITULO":"Retórica - Home"})
