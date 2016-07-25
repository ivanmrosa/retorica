from django.shortcuts import render, HttpResponse
from django.contrib.auth.decorators import login_required
from django.db.models import F

from django.core.serializers.json import DjangoJSONEncoder, json
from .models import Evento, EventoParticipante, EventoPeriodo, EventoTipo, EventoAnexo, EventoAvaliacao, \
    EventoOrganizador, EventoPalestrante, EventoVideo
from lib.main_lib import RenderView


# Create your views here.


@login_required
def evento_index(request):
    return render(request=request, template_name='evento/evento_index.html', context={"TITULO": "Retórica - Eventos"})


class EventoController(RenderView):
    request = None
    def __init__(self, *args, **kwargs):
        if 'evento_pk' in kwargs:
            self.__evento_pk = kwargs['evento_pk']

    @property
    def evento_pk(self):
        return self.__evento_pk

    def ObtemPeriodos(self):
        periodos = EventoPeriodo.objects.filter(evento_id=self.evento_pk).values()
        return json.dumps(list(periodos), cls=DjangoJSONEncoder)

    def ObtemPalestrantes(self):
        palestrantes = EventoPalestrante.objects.filter(evento_id=self.evento_pk).values()
        return json.dumps(list(palestrantes), cls=DjangoJSONEncoder)

    def ObtemVideos(self):
        videos = EventoVideo.objects.filter(evento_id=self.evento_pk).values()
        return json.dumps(list(videos), cls=DjangoJSONEncoder)

    def ObtemAnexos(self):
        anexos = EventoAnexo.objects.filter(evento_id=self.evento_pk).values()
        return json.dumps(list(anexos), cls=DjangoJSONEncoder)

    def ObtemEvento(self):
        evento = Evento.objects.filter(pk=self.evento_pk).annotate(estado=F('cidade__estado__nome'),
                                                                   cidade_nome=F('cidade__nome')). \
            values('id', 'titulo', 'descricao', 'endereco', 'numero_endereco',
                   'cidade_nome', 'estado', 'bairro', 'imagem_divulgacao')
        return json.dumps(list(evento), cls=DjangoJSONEncoder)

    def ListaEventos(self):
        eventos = Evento.objects.all().annotate(estado=F('cidade__estado__nome'), cidade_nome=F('cidade__nome')). \
            values('id', 'titulo', 'descricao', 'endereco', 'numero_endereco',
                   'cidade_nome', 'estado', 'bairro', 'imagem_divulgacao')
        return json.dumps(list(eventos), cls=DjangoJSONEncoder)

    def ObtemEventosDoOrganizador(self):
         return json.dumps(list(EventoOrganizador.objects.filter(organizador_id=self.request.user.id).annotate(titulo=F('evento__titulo')).\
            values('titulo', 'evento_id')))

    def ObtemAvalicoes(self):
        avaliacoes = EventoAvaliacao.objects.filter(evento_id=self.evento_pk).annotate(
            usuario_nome=F('usuario__usuario__first_name')).values('usuario_nome', 'comentario', 'nota')
        return json.dumps(list(avaliacoes))

    def ObterDetalhesEvento(self):
        eventoDict = json.loads(self.ObtemEvento())[0]
        local = json.dumps(
            [{"cidade_nome": eventoDict["cidade_nome"], "estado": eventoDict["estado"], "bairro": eventoDict["bairro"],
              "endereco": eventoDict["endereco"], "numero_endereco": eventoDict["numero_endereco"]}])

        evento = json.dumps(
            [{"id": eventoDict["id"], "titulo": eventoDict["titulo"], "descricao": eventoDict["descricao"],
              "imagem_divulgacao": eventoDict["imagem_divulgacao"]}])

        return HttpResponse(json.dumps([
            {"periodos": self.ObtemPeriodos(), "palestrantes": self.ObtemPalestrantes(), "videos": self.ObtemVideos(),
             "anexos": self.ObtemAnexos(), "evento": evento, "local": local, "avaliacoes":self.ObtemAvalicoes()}
        ], cls=DjangoJSONEncoder))
