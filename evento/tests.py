from django.test import TestCase, Client
from localidade.models import Pais, Estado, Cidade
from usuario.views import UsuarioController
from .models import Evento, EventoTipo
from usuario.models import UsuarioDetalhe
from django.conf import settings
import os
import json

# Create your tests here.

USUARIO_TESTE = 'usr_teste'
SENHA_TESTE = '123456789'


class EventoTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.pais = Pais.objects.create(nome="Brasil")
        cls.estado = Estado.objects.create(nome="Minas Gerais", pais=cls.pais)
        cls.cidade = Cidade.objects.create(nome="Belo Horizonte", estado=cls.estado, pais=cls.pais)
        cls.tipo_evento = EventoTipo.objects.create(nome="teste")
        usr = UsuarioController(
            username=USUARIO_TESTE,
            password=SENHA_TESTE,
            email='usr_teste@mail.com',
            first_name='teste',
            last_name='teste',
            tipo_usuario='O',
            telefone='1234567891',
            cidade_id=cls.cidade.id,
            cep='12345',
            endereco='teste',
            bairro='teste',
            numero_endereco=123,
            sexo='M',
            cpf='12345678911',
            numero_identidade='12345678'
        )

        id = json.loads(usr.AdicionarUsuario())["key"]
        cls.usr = UsuarioDetalhe.objects.get(pk=id)

        cls.evento = Evento(
            titulo="teste",
            palavras_chave="teste",
            cidade_id=cls.cidade.id,
            numero_endereco=123,
            endereco="teste",
            imagem_divulgacao=os.path.join(settings.MEDIA_ROOT, 'django-logo.png'),
            tipo_cobranca="P",
            cep="12345",
            descricao="teste",
            tipo_evento_id=cls.tipo_evento.id,
            bairro="teste",
            valor=25,
            evento_privado = False,
            usuario_cadastro_id= cls.usr.id

        )

        cls.evento.save()

    def testInserirEvento(self):
        c = Client()
        c.login(username=USUARIO_TESTE, password=SENHA_TESTE)
        fi = open(os.path.join(settings.MEDIA_ROOT, 'django-logo.png'), mode='rb')
        r = c.post(path='/evento/criar_editar_evento',
                   data={
                       "titulo": "teste",
                       "palavras_chave": "teste",
                       "cidade_id": self.cidade.id,
                       "numero_endereco": 123,
                       "endereco": "teste",
                       "imagem_divulgacao": fi,
                       "tipo_cobranca": "P",
                       "cep": "12345",
                       "descricao": "teste",
                       "tipo_evento_id": self.tipo_evento.id,
                       "bairro": "teste",
                       "valor": 25,
                       "evento_privado": False,
                       "usuario_cadastro_id": self.usr.id
                   })

        if r.json()["ok"] != True:
            raise Exception('Erro: Ocorreu erro.' + r.json()["msg"])

    def testInserirPeriodo(self):

        c = Client()
        c.login(username=USUARIO_TESTE, password=SENHA_TESTE)
        r = c.post('/evento/inserir_periodo',
                   {
                       "evento_id": self.evento.id,
                       "data":"2016-01-01",
                       "hora_inicio":"07:00",
                       "hora_fim":"20:00",
                       "quantidade_vagas":23
                   })

        if r.json()["ok"] != True:
            raise Exception('ocorreu erro:' + r.json()["msg"])

    def testIserirPalestrante(self):
        c = Client()
        c.login(username=USUARIO_TESTE, password=SENHA_TESTE)
        r = c.post('/evento/inserir_palestrante',
                   {
                       "nome":"teste",
                       "cpf":"12345678910",
                       "descricao":"aaaaaa",
                       "email":"aadddd@dddd.com",
                       "evento_id":self.evento.id
                   })

        if r.json()["ok"] != True:
            raise Exception('Ocorreu um erro:' + r.json()["msg"])

    def testInserirParticipante(self):
        c = Client()
        c.login(username=USUARIO_TESTE, password=SENHA_TESTE)
        self.testInserirPeriodo()
        r = c.post('/evento/inserir_participante',
                   {
                       "periodos":'[{"evento_periodo_id":1}]',
                   })

        try:
            if r.json()[0]["ok"] != True:
                raise Exception('Ocorreu um erro:' + r.json()["msg"])
        except Exception as e:
            raise Exception(r)

    def testInserirOrganizador(self):
        c = Client()
        c.login(username=USUARIO_TESTE, password=SENHA_TESTE)
        r = c.post('/evento/inserir_organizador',
                   {
                       "organizador_id":self.usr.id,
                       "evento_id": self.evento.id
                   })

        if r.json()["ok"] != True:
            raise Exception('Ocorreu um erro:' + r.json()["msg"])

    def testInserirComentario(self):
        c = Client()
        c.login(username=USUARIO_TESTE, password=SENHA_TESTE)
        r = c.post('/evento/inserir_comentario',
                   {
                       "usuario_id":self.usr.id,
                       "evento_id": self.evento.id,
                       "comentario":"comentário teste"
                   })

        if r.json()["ok"] != True:
            raise Exception('Ocorreu um erro:' + r.json()["msg"])

    def testInserirVideo(self):
        c = Client()
        c.login(username=USUARIO_TESTE, password=SENHA_TESTE)
        r = c.post('/evento/inserir_video',
                   {
                       "url": "https://www.youtube.com/watch?v=sY3rIlrTTh8",
                       "evento_id": self.evento.id,
                       "titulo_video": "teste teste"
                   })

        if r.json()["ok"] != True:
            raise Exception('Ocorreu um erro:' + r.json()["msg"])

    def testObterDetalhesEvento(self):
        c = Client()
        c.login(username=USUARIO_TESTE, password=SENHA_TESTE)
        r = c.get('/evento/detalhe_evento',
                   {
                       "evento_pk":self.evento.id
                   })
