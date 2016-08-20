# coding: utf-8
from django.shortcuts import render, HttpResponse
from django.contrib.auth.decorators import login_required
from django.db.models import F, Count

from django.core.serializers.json import DjangoJSONEncoder, json
from .models import Evento, EventoParticipante, EventoPeriodo, EventoTipo, EventoAnexo, EventoAvaliacao, \
    EventoOrganizador, EventoPalestrante, EventoVideo
from lib.main_lib import RenderView
from django.db import connection


# Create your views here.


@login_required
def evento_index(request):
    return render(request=request, template_name='evento/evento_index.html', context={"TITULO": "Retórica - Eventos"})


class EventoController(RenderView):
    request = None

    def __init__(self, *args, **kwargs):
        if 'evento_pk' in kwargs:
            self.__evento_pk = kwargs['evento_pk']

        self.attributes = kwargs

    @property
    def evento_pk(self):
        return self.__evento_pk

    def ObtemPeriodos(self):
        periodos = EventoPeriodo.objects.filter(evento_id=self.evento_pk).select_related(
            'evento_participante').annotate(
            vagas_disponiveis=F('quantidade_vagas') - Count('eventoparticipante')
        ).values('evento_id', 'data', 'hora_inicio',
                 'hora_fim', 'quantidade_vagas', 'vagas_disponiveis', 'id')
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
                                                                   cidade_nome=F('cidade__nome'),
                                                                   estado_id=F('cidade__estado__id'),
                                                                   pais_id=F('cidade__estado__pais__id')). \
            values('id', 'titulo', 'descricao', 'endereco', 'numero_endereco',
                   'cidade_nome', 'estado', 'bairro', 'imagem_divulgacao', 'tipo_cobranca', 'evento_privado',
                   'tipo_evento', 'palavras_chave', 'cidade_id', 'estado_id', 'pais_id', 'cep')
        return json.dumps(list(evento), cls=DjangoJSONEncoder)

    def ListaEventos(self):
        eventos = Evento.objects.filter(**self.attributes).annotate(estado=F('cidade__estado__nome'),
                                                                    cidade_nome=F('cidade__nome')). \
            values('id', 'titulo', 'descricao', 'endereco', 'numero_endereco',
                   'cidade_nome', 'estado', 'bairro', 'imagem_divulgacao')
        return json.dumps(list(eventos), cls=DjangoJSONEncoder)

    def ObtemInscricoesUsuario(self):

        with connection.cursor() as cursor:
            cursor.execute(
                '''
                    SELECT Evento.id, Evento.titulo, Evento.descricao, Evento.endereco,
                           Evento.numero_endereco, Cidade.nome as cidade_nome,
                           Estado.Nome as estado, Evento.bairro, Evento.imagem_divulgacao
                      FROM Evento
                      JOIN Cidade
                        ON Evento.cidade_id = Cidade.id
                      JOIN Estado
                        ON Cidade.estado_id = Estado.id
                     WHERE Exists(
                      SELECT 1
                        FROM EventoParticipante as epa
                        JOIN EventoPeriodo  epe
                          ON epa.evento_periodo_id = epe.id
                         AND epa.usuario_id = %s
                       WHERE epe.evento_id = Evento.id
                    )
                ''', [self.request.user.id]
            )
            columns = [col[0] for col in cursor.description]
            return json.dumps([dict(zip(columns, row)) for row in cursor.fetchall()], cls=DjangoJSONEncoder)

    def ObtemEventosDoOrganizador(self):
        return json.dumps(list(
            EventoOrganizador.objects.filter(organizador_id=self.request.user.id).annotate(titulo=F('evento__titulo')). \
                values('titulo', 'evento_id')))

    def ObtemAvalicoes(self):
        avaliacoes = EventoAvaliacao.objects.filter(evento_id=self.evento_pk).annotate(
            usuario_nome=F('usuario__usuario__first_name')).values('usuario_nome', 'comentario', 'nota')
        return json.dumps(list(avaliacoes))

    def ObtemParticipantesEvento(self):
        return json.dumps(list(EventoParticipante.objects.annotate(evento_id=F('evento_periodo__evento__id'),
                                                                   data=F('evento_periodo__data'),
                                                                   hora_inicio=F('evento_periodo__hora_inicio'),
                                                                   nome=F('usuario__first_name'),
                                                                   sobrenome=F('usuario__last_name')
                                                                   ).filter(evento_id=self.evento_pk). \
                               order_by('nome', 'data'). \
                               values('evento_id', 'data', 'hora_inicio', 'nome', 'sobrenome', 'confirmado', 'presente',
                                      'usuario_id')), cls=DjangoJSONEncoder)

    def ObtemOrganizadores(self):
        return json.dumps(
            list(EventoOrganizador.objects.filter(evento_id=self.evento_pk).annotate(nome=F('organizador__first_name'),
                                                                                     sobrenome=F(
                                                                                         'organizador__last_name')). \
                 values('nome', 'sobrenome', 'id')))

    def ObterDetalhesEvento(self):
        eventoDict = json.loads(self.ObtemEvento())[0]
        local = json.dumps(
            [{"cidade_nome": eventoDict["cidade_nome"], "estado": eventoDict["estado"], "bairro": eventoDict["bairro"],
              "endereco": eventoDict["endereco"], "numero_endereco": eventoDict["numero_endereco"],
              "cidade_id": eventoDict["cidade_id"], "estado_id": eventoDict["estado_id"],
              "pais_id": eventoDict["pais_id"], "cep": eventoDict["cep"],
              }])

        evento = json.dumps(
            [{"id": eventoDict["id"], "titulo": eventoDict["titulo"], "descricao": eventoDict["descricao"],
              "imagem_divulgacao": eventoDict["imagem_divulgacao"],
              "tipo_cobranca": eventoDict["tipo_cobranca"], "evento_privado": eventoDict["evento_privado"],
              "tipo_evento": eventoDict["tipo_evento"], "palavras_chave": eventoDict["palavras_chave"]}
             ])

        return HttpResponse(json.dumps([
            {"periodos": self.ObtemPeriodos(), "palestrantes": self.ObtemPalestrantes(), "videos": self.ObtemVideos(),
             "anexos": self.ObtemAnexos(), "evento": evento, "local": local, "avaliacoes": self.ObtemAvalicoes(),
             "organizadores": self.ObtemOrganizadores()}
        ], cls=DjangoJSONEncoder))

    def ObtemTiposEveto(self):
        return json.dumps(list(EventoTipo.objects.all().values()))

    def InserirEditarEvento(self):
        if not self.attributes['id']:
            self.attributes.update({"usuario_cadastro_id": self.request.user.id})
            mensagem = "Evento criado com sucesso! Agora é necessário completar as informações."
        else:
            mensagem = "Evento modificado com sucesso!"

        return self.SaveModel(model=Evento, parametros=self.attributes, msg=mensagem, files=self.request.FILES)

    def InserirPeriodoEvento(self):
        return self.SaveModel(model=EventoPeriodo, parametros=self.attributes, msg="Evento inserido com sucesso.")

    def DeletarPeriodoEvento(self):
        try:
            EventoPeriodo.objects.get(pk=self.attributes["id"]).delete()
            return json.dumps(
                {"msg": "Período removido com sucesso!", "ok": True})
        except Exception as e:
            return str(e)

    def InserirOrganizadorEvento(self):
        return self.SaveModel(model=EventoOrganizador, parametros=self.attributes,
                              msg="Organizador inserido com suesso.")

    def DeletarOrganizadorEvento(self):
        try:
            EventoOrganizador.objects.get(pk=self.attributes["id"]).delete()
            return json.dumps({"msg": "Organizador removido com sucesso!", "ok": True})
        except Exception as e:
            return str(e)

    def InserirAnexoEvento(self):
        return self.SaveModel(model=EventoAnexo, parametros=self.attributes, files=self.request.FILES,
                              msg="Upload realizado com sucesso.")

    def DeletarAnexoEvento(self):
        try:
            anexo = EventoAnexo.objects.get(pk=self.attributes["id"])
            anexo.caminho_arquivo.delete(False)
            anexo.delete()
            return json.dumps({"msg": "Anexo removido com sucesso!", "ok": True})
        except Exception as e:
            return str(e)

    def InserirVideoEvento(self):
        return self.SaveModel(model=EventoVideo, parametros=self.attributes, msg="Video inserido com sucesso.")

    def DeletarVideoEvento(self):
        try:
            EventoVideo.objects.get(pk=self.attributes["id"]).delete()
            return json.dumps({"msg": "Vídeo removido com sucesso!", "ok": True})
        except Exception as e:
            return str(e)

    def InserirParticipante(self):
        retorno = []
        periodos = json.loads(next(iter(self.attributes.values())))

        for participante in periodos:
            participante.update({"usuario_id": self.request.user.id})
            retorno.append(self.SaveModel(model=EventoParticipante, parametros=participante,
                                          msg="Sua solicitação para participar foi efetivada. Aguarde a confirmação por e-mail."))
        return retorno

    def DeletarParticipante(self):
        periodos = json.loads(next(iter(self.attributes.values())))

        for participante in periodos:
            EventoParticipante.objects.select_related('EventoPeriodo').filter(
                evento_periodo_id=participante["evento_periodo_id"], usuario_id=self.request.user.id).delete()

        return json.dumps({"msg": "Inscrição cancelada."})

    def InserirPalestranteEvento(self):
        return self.SaveModel(model=EventoPalestrante, parametros=self.attributes,
                              msg="Palestrante inserido com sucesso.")

    def DeletarPalestranteEvento(self):
        try:
            EventoPalestrante.objects.get(pk=self.attributes["id"]).delete()
            return json.dumps({"msg": "Palestrante removido com sucesso!", "ok": True})
        except Exception as e:
            return str(e)