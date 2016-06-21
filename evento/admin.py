from django.contrib import admin
from localidade.models import Pais, Estado, Cidade
from usuario.models import UsuarioDetalhe
from evento.models import EventoTipo, Evento, EventoPalestrante, EventoPeriodo, EventoParticipante, EventoOrganizador, \
    EventoAvaliacao, EventoAnexo, EventoVideo


# Register your models here.
admin.site.register(Pais)
admin.site.register(Estado)
admin.site.register(Cidade)
admin.site.register(UsuarioDetalhe)
admin.site.register(EventoTipo)
admin.site.register(Evento)
admin.site.register(EventoPalestrante)
admin.site.register(EventoPeriodo)
admin.site.register(EventoParticipante)
admin.site.register(EventoOrganizador)
admin.site.register(EventoAvaliacao)
admin.site.register(EventoAnexo)
admin.site.register(EventoVideo)