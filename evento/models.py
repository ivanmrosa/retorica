# coding: utf-8
from django.db import models
from usuario.models import UsuarioDetalhe
from localidade.models import Cidade
from django.core.exceptions import ValidationError

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
        db_table = 'EventoTipo'

    def __str__(self):
        return self.nome


class Evento(models.Model):
    titulo = models.CharField(verbose_name='Título', max_length=50)
    tipo_evento = models.ForeignKey(verbose_name="Tipo do evento", to=EventoTipo)
    descricao = models.TextField(verbose_name='Descrição')
    palavras_chave = models.CharField(verbose_name='Palavras chave', max_length=100)
    tipo_cobranca = models.CharField(verbose_name="Tipo de combrança", choices=TIPOS_COBRANCA, max_length=1)
    evento_privado = models.BooleanField(verbose_name="Evento privado ?")
    cidade = models.ForeignKey(verbose_name="Cidade", to=Cidade)
    cep = models.CharField(verbose_name="CEP/ZIP-Code", max_length=10)
    endereco = models.CharField(verbose_name="Endereço", max_length=100)
    bairro = models.CharField(verbose_name="Bairro", max_length=100)
    numero_endereco = models.IntegerField(verbose_name="Número")
    usuario_cadastro = models.ForeignKey(to=UsuarioDetalhe)
    imagem_divulgacao = models.ImageField(verbose_name="Imagem de divulgação")
    valor = models.FloatField(verbose_name="Preço", default=0)

    class Meta:
        db_table = 'Evento'

    def __str__(self):
        return self.titulo

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        insere_organizador = (self.id == None)

        super(Evento, self).save(force_insert=force_insert, force_update=force_update, using=using,
                                 update_fields=update_fields)

        if insere_organizador:
            EventoOrganizador(evento=self,
                              organizador=UsuarioDetalhe.objects.get(pk=self.usuario_cadastro)).save()


    def clean(self):
        validacao = {}

        if str(self.valor).strip() == '':
            self.valor = 0

        if self.valor < 0:
            validacao.update({'valor': 'Este campo não pode conter um valor negativo.'})
        elif self.tipo_cobranca == GRATUITO and self.valor > 0:
            validacao.update({'valor': 'Para eventos gratuitos este campo deve ser 0.'})
        elif self.tipo_cobranca == PAGO and self.valor <= 0:
            validacao.update({'valor': 'Para eventos pagos este campo deve ser maior do que 0.'})

        if validacao:
            raise ValidationError(message=validacao)

        super(Evento, self).clean()


class EventoPalestrante(models.Model):
    nome = models.CharField(verbose_name="Nome", max_length=100)
    cpf = models.CharField(verbose_name="CPF", max_length=11)
    descricao = models.TextField(verbose_name="Descrição do palestrante")
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
    confirmado = models.BooleanField(default=False)
    presente = models.BooleanField(verbose_name="presença", default=False)
    nota = models.IntegerField(verbose_name='Nota', blank=True, null=True)

    class Meta:
        db_table = 'EventoParticipante'

    def __str__(self):
        return self.usuario.first_name

    def clean(self):
        if EventoParticipante.objects.filter(usuario_id=self.usuario_id,
                                             evento_periodo_id=self.evento_periodo_id).count() > 0:
            raise ValidationError(
                message="A inscrição já foi realizada anteriormente. É possível inscrever-se apenas uma vez.")

        periodo = EventoPeriodo.objects.filter(id=self.evento_periodo_id).values('quantidade_vagas', 'data')[0]
        participantes = EventoParticipante.objects.filter(evento_periodo_id=self.evento_periodo_id).count()

        if participantes >= periodo['quantidade_vagas']:
            raise ValidationError(message="Não há mais vagas disponíveis para o dia %s." % (periodo['data']))

        tipo_cobranca = \
            Evento.objects.select_related('EventoParticipante').filter(eventoperiodo=self.evento_periodo).values(
                'tipo_cobranca')[0]['tipo_cobranca']

        if tipo_cobranca == GRATUITO:
            self.confirmado = True


class EventoOrganizador(models.Model):
    evento = models.ForeignKey(to=Evento)
    organizador = models.ForeignKey(to=UsuarioDetalhe)

    class Meta:
        db_table = 'EventoOrganizador'

    def __str__(self):
        return self.organizador.first_name


class EventoComentario(models.Model):
    evento = models.ForeignKey(to=Evento)
    usuario = models.ForeignKey(to=UsuarioDetalhe)
    comentario = models.TextField(verbose_name="Comentário")

    class Meta:
        db_table = 'EventoComentario'

    def __str__(self):
        return self.comentario


class EventoAnexo(models.Model):
    evento = models.ForeignKey(to=Evento)
    caminho_arquivo = models.FileField(verbose_name="Arquivo")
    titulo_anexo = models.CharField(verbose_name="Título do anexo", max_length=50)

    class Meta:
        db_table = 'EventoAnexo'

    def __str__(self):
        return self.nome_arquivo


class EventoVideo(models.Model):
    evento = models.ForeignKey(to=Evento)
    plataforma = models.CharField(verbose_name="Plataforma", choices=PLATAFORMAS_VIDEOS, max_length=3)
    url = models.URLField(verbose_name="Link para o vídeo")
    titulo_video = models.CharField(verbose_name="Título", max_length=50)

    class Meta:
        db_table = 'EventoVideo'

    def __str__(self):
        return self.url

    def clean_fields(self, exclude=None):
        super(EventoVideo, self).clean_fields(exclude='plataforma')

    def clean(self):
        validacao = {}
        url = self.url.lower()
        youtube_url = 'http://www.youtube.com/embed/%s?autoplay=0'
        vimeo_url = 'https://player.vimeo.com/video/%s'
        id_video = None

        if 'youtu.be/' in url:
            id_video = self.url[self.url.rfind('/') + 1:]
            self.url = youtube_url % (id_video)
            self.plataforma = YOUTUBE
        elif 'www.youtube.com/watch' in url:
            id_video = self.url[self.url.find('v=') + 2:]
            self.url = youtube_url % (id_video)
            self.plataforma = YOUTUBE
        elif 'vimeo.com' in url:
            id_video = self.url[self.url.rfind('/') + 1:]
            self.url = vimeo_url % (id_video)
            self.plataforma = VIMEO
        else:
            validacao.update({"url": "This url isn't accept."})

        if not id_video:
            validacao.update({"url": "This url isn't accept."})

        if validacao:
            raise ValidationError(message=validacao)

        super(EventoVideo, self).clean()
