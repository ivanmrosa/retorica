from django.db import models
from usuario.models import UsuarioDetalhe
from localidade.models import Pais, Estado, Cidade

GRATUITO = 'G'
PAGO = 'P'

TIPOS_COBRANCA = (
    (GRATUITO, 'Gratuito'),
    (PAGO, 'Pago'),
)

YOUTUBE = 'YT'
VIMEO = 'VM'

PLATAFORMAS_VIDEOS = (
    (YOUTUBE, 'Youtube'),
    (VIMEO, 'VIMEO')
)

# Create your models here.
class EventoTipo(models.Model):
    nome = models.CharField(max_length=100)

    class Meta:
        db_table = 'EventoTitulo'

    def __str__(self):
        return self.nome

class Evento(models.Model):
    titulo = models.CharField(verbose_name='Título', max_length=50)
    tipo_evento = models.ForeignKey(verbose_name="Tipo do evento", to=EventoTipo)
    descricao = models.TextField(verbose_name='Descrição')
    palavras_chave = models.CharField(verbose_name='Palavras chave', max_length=100)
    tipo_cobranca = models.CharField(verbose_name="Tipo de combrança", choices=TIPOS_COBRANCA, max_length=1)
    evento_privado = models.BooleanField(verbose_name="Evento privado ?")
    pais = models.ForeignKey(verbose_name="País", to=Pais)
    estado = models.ForeignKey(verbose_name="Estado", to=Estado)
    cidade = models.ForeignKey(verbose_name="Cidade", to=Cidade)
    cep = models.CharField(verbose_name="CEP/ZIP-Code", max_length=10)
    endereco = models.CharField(verbose_name="Endereço", max_length=100)
    bairro = models.CharField(verbose_name="Bairro", max_length=100)
    numero_endereco = models.IntegerField(verbose_name="Número")
    usuario_cadastro = models.ForeignKey(to=UsuarioDetalhe)
    imagem_divulgacao = models.ImageField(verbose_name="Imagem de divulgação")

    class Meta:
        db_table = 'Evento'

    def __str__(self):
        return self.titulo

class EventoPalestrante(models.Model):
    nome = models.CharField(verbose_name="Nome", max_length=100)
    cpf = models.CharField(verbose_name="CPF", max_length=11)
    Descricao = models.TextField(verbose_name="Descrição do palestrante")
    email = models.EmailField(verbose_name="E-mail")
    evento = models.ForeignKey(verbose_name="Evento", to=Evento)


    class Meta:
        db_table = 'EventoPalestrante'

    def __str__(self):
        return self.nome


class EventoPeriodo(models.Model):
    evento = models.ForeignKey(Evento)
    data = models.DateField(verbose_name="Data do evento")
    hora_inicio = models.TimeField(verbose_name="Hora do inicio")
    hora_fim = models.TimeField(verbose_name="Hora do fim")
    quantidade_vagas = models.IntegerField(verbose_name="Quantidade de vagas")

    class Meta:
        db_table = 'EventoPeriodo'

    def __str__(self):
        return self.evento.titulo


class EventoParticipante(models.Model):
    evento_periodo = models.ForeignKey(EventoPeriodo)
    usuario = models.ForeignKey(UsuarioDetalhe)
    confirmado = models.BooleanField(editable=False, default=False)


    class Meta:
        db_table = 'EventoParticipante'

    def __str__(self):
        return self.usuario.first_name


class EventoOrganizador(models.Model):
    evento = models.ForeignKey(to=Evento)
    organizador = models.ForeignKey(to=UsuarioDetalhe)

    class Meta:
        db_table = 'EventoOrganizador'

    def __str__(self):
        return self.organizador.first_name


class EventoAvaliacao(models.Model):
    evento = models.ForeignKey(to=Evento)
    usuario = models.ForeignKey(to=EventoParticipante)
    nota = models.IntegerField(verbose_name="Nota", null=True, blank=True)
    comentario = models.TextField(verbose_name="Comentário")

    class Meta:
        db_table = 'EventoAvaliacao'

    def __str__(self):
        return self.comentario

class EventoAnexo(models.Model):
    evento = models.ForeignKey(to=Evento)
    caminho_arquivo = models.FileField(verbose_name="Arquivo")
    nome_arquivo = models.CharField(verbose_name="Nome do anexo", max_length=50)
    titulo_anexo = models.CharField(verbose_name="Título do anexo", max_length=50)

    class Meta:
        db_table = 'EventoAnexo'

    def __str__(self):
        return self.nome_arquivo


class EventoVideo(models.Model):
    evento = models.ForeignKey(to = Evento)
    plataforma = models.CharField(verbose_name="Plataforma", choices=PLATAFORMAS_VIDEOS, max_length=3)
    url = models.URLField(verbose_name="Link para o vídeo")
    titulo_video = models.CharField(verbose_name="Título", max_length=50)

    class Meta:
        db_table = 'EventoVideo'

    def __str__(self):
        return self.url

