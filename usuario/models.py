#coding utf-8

from django.db import models
from django.contrib.auth.models import User
from localidade.models import Pais, Estado, Cidade


ORGANIZADOR_EVENTOS = 'O'
PARTICIPANTE_EVENTOS = 'P'

MASCULINO = 'M'
FEMININO = 'F'
OUTROS = 'O'

TIPOS_USUARIO = (
    (ORGANIZADOR_EVENTOS, 'Organizador'),
    (PARTICIPANTE_EVENTOS, 'Participante'),
)

TIPOS_GENERO = (
    (FEMININO, 'Feminino'),
    (MASCULINO, 'Masculino'),
    (OUTROS, 'Outros'),
)

# Create your models here.
class UsuarioDetalhe(User):
    tipo_usuario = models.CharField(verbose_name="Tipo do usuário", max_length=1, choices=TIPOS_USUARIO)
    email_pagseguro = models.EmailField(verbose_name="E-mail PagSeguro", null=True, blank=True)
    token_pagseguro = models.CharField(verbose_name="Token PagSeguro", null=True, blank=True, max_length=300)
    foto_usuario = models.ImageField(verbose_name="Foto do perfil", null=True, blank=True)
    telefone = models.CharField(verbose_name="Telefone", max_length=10)
    pais = models.ForeignKey(verbose_name="País", to=Pais)
    estado = models.ForeignKey(verbose_name="Estado", to=Estado)
    cidade = models.ForeignKey(verbose_name="Cidade", to=Cidade)
    cep = models.CharField(verbose_name="CEP/ZIP-Code", max_length=10)
    endereco = models.CharField(verbose_name="Endereço", max_length=100)
    bairro = models.CharField(verbose_name="Bairro", max_length=100)
    numero_endereco = models.IntegerField(verbose_name="Número")
    sexo = models.CharField(verbose_name="Sexo", choices=TIPOS_GENERO, max_length=1)
    cpf = models.CharField(verbose_name="CPF", max_length=11)
    numero_identidade = models.CharField(verbose_name="Identidade", max_length=20)

    class Meta:
        db_table = "UsuarioDetalhe"
        verbose_name = "Usuários"

