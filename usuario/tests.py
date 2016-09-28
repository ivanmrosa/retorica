from django.test import TestCase, Client
from .views import UsuarioController
from localidade.models import Pais, Estado, Cidade
import json


USUARIO_TESTE = 'usr_teste'
SENHA_TESTE = '123456789'

# Create your tests here.
class TesteUsuario(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.pais = Pais.objects.create(nome="Brasil")
        cls.estado = Estado.objects.create(nome="Minas Gerais", pais=cls.pais)
        cls.cidade = Cidade.objects.create(nome="Belo Horizonte", estado=cls.estado, pais=cls.pais)

    def testCriarUsuario(self):
        usr = UsuarioController(
            username=USUARIO_TESTE,
            password=SENHA_TESTE,
            email='usr_teste@mail.com',
            first_name='teste',
            last_name='teste',
            tipo_usuario='O',
            telefone='1234567891',
            cidade_id=self.cidade.id,
            cep='12345',
            endereco='teste',
            bairro='teste',
            numero_endereco=123,
            sexo='M',
            cpf='12345678911',
            numero_identidade='12345678'
        )

        resultado = json.loads(usr.AdicionarUsuario())


        if resultado["ok"] == False:
            raise Exception('ocorreu erro:' + resultado["msg"])

        
    def testLogar(self):
        self.testCriarUsuario()
        c = Client()
        response = c.post('/login/', {"username":USUARIO_TESTE, "password":SENHA_TESTE})

        if response.json()["logged"] != 'true':
            raise Exception('ocorreu erro: ' + response.json()["msg"])

    def testObterUsuario(self):
        self.testCriarUsuario()

        c = Client()
        c.login(username=USUARIO_TESTE, password=SENHA_TESTE)
        c.post('/obter_usuario/')

