import json
from django.shortcuts import render, render_to_response, HttpResponse
from .models import UsuarioDetalhe
from evento.models import EventoParticipante, EventoPeriodo, Evento

from django.core import serializers
# Create your views here.


def home(request):
    return render(request=request, template_name='usuario/home.html', context={"TITULO":"Retórica - Home"})

def ObtemEventosUsuario(request):
    usuario = UsuarioDetalhe.objects.filter(pk=2)
    eventos = EventoParticipante.objects.filter(usuario=usuario).values('evento_periodo__evento__titulo',
                                                                        'evento_periodo__evento__id',
                                                                        'evento_periodo__data')

#    return HttpResponse(serializers.serialize("json", usuario))
    return HttpResponse(eventos)
#    return render_to_response('base.html', {"PAGINA_TITULO":"Retórica - Home"})