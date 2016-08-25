# coding: utf-8
from django.core.serializers.json import DjangoJSONEncoder, json
from django.shortcuts import render, HttpResponse
from .models import UsuarioDetalhe
from django.contrib.auth import authenticate, login
from lib.main_lib import RenderView
from django.db.models import F, Value as V, CharField, Q
from django.db.models.functions import Concat, Coalesce
from django.core.mail import send_mail
import random
from django.contrib.auth.hashers import *

# Create your views here.


def home(request):
    return render(request=request, template_name='usuario/home.html', context={"TITULO": "Auditório - Home"})


class UsuarioController(RenderView):
    request = None

    def __init__(self, **kwargs):
        self.propriedades_requisicao = kwargs

    @staticmethod
    def Logar(request):
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

    def SetValue(self, obj, key, value):
        if key == 'tipo_usuario':
            setattr(obj, key, 'O' if value == True else 'P')
        else:
            super(UsuarioController, self).SetValue(obj, key, value)

    def SaveObject(self, obj):
        if 'password' in self.propriedades_requisicao:
            obj.save(set_password=True)
        else:
            obj.save()

    def AdicionarUsuario(self):
        return self.SaveModel(model=UsuarioDetalhe, parametros=self.propriedades_requisicao,
                              msg="Usuário cadastrado com sucesso! Agora você está apto a fazer login")

    def EditarUsuario(self):
        self.propriedades_requisicao.update({"id": self.request.user.id})

        return self.SaveModel(model=UsuarioDetalhe, parametros=self.propriedades_requisicao,
                              msg="Usuário alterado com sucesso!", files=self.request.FILES)

    def ObterUsuario(self):
        if 'usuario_id' in self.propriedades_requisicao:
            usuario_id = self.propriedades_requisicao["usuario_id"]
        else:
            usuario_id = self.request.user.id

        return json.dumps(list(UsuarioDetalhe.objects.filter(id=usuario_id).annotate(
            pais_id=F('cidade__pais__id'),
            estado_id=F('cidade__estado__id'),
            nome_completo=Concat('first_name', V(' '), 'last_name', output_field=CharField())
        ).values(
            'username', 'telefone', 'numero_identidade', 'sexo', 'numero_endereco', 'last_login',
            'email_pagseguro', 'endereco', 'last_name', 'foto_usuario', 'id', 'pais_id', 'estado_id',
            'email', 'first_name', 'cep', 'bairro', 'cpf', 'token_pagseguro', 'email_pagseguro', 'cidade_id',
            'nome_completo'
        )), cls=DjangoJSONEncoder)

    def PesquisarUsuario(self):
        return json.dumps(list(UsuarioDetalhe.objects.annotate(
            pais_id=F('cidade__pais__id'),
            estado_id=F('cidade__estado__id'),
            nome_completo=Concat('first_name', V(' '), 'last_name', output_field=CharField())
        ).filter(Q(nome_completo__icontains=self.propriedades_requisicao["nome_completo"]) | Q(
            email=self.propriedades_requisicao['nome_completo'])).values(
            'username', 'telefone', 'foto_usuario', 'id', 'email', 'nome_completo'
        )), cls=DjangoJSONEncoder)

    def RecuperarSenha(self):
        #try:
        username = self.propriedades_requisicao["usuario"]
        usuario = UsuarioDetalhe.objects.filter(username=username)

        if not username:
            return json.dumps({"ok": False, "msg": "O usuário informado não existe. Informe um usuário válido."})

        controle = ControleSenha(usuario=usuario)
        controle.RecuperarSenha()

        return json.dumps({"ok": False, "msg": "Sua solicitação foi efetivada. Verifique seu email."})
        #except Exception as e:
        #    return json.dumps(
        #        {"ok": False, "msg": "Ocorreu um erro e sua solicitação não pôde ser processada:" + str(e)})


class ControleSenha:
    def __init__(self, usuario):
        self.__usuario = usuario

    @property
    def usuario(self):
        return self.__usuario

    def __GerarSenhaRecuperacao(self):
        return str(random.randrange(1000, 1000000, 2))

    def AlterarSenha(self, nova_senha):
        self.usuario.update(password= make_password(nova_senha))

    def RecuperarSenha(self):
        senha = self.__GerarSenhaRecuperacao()
        self.AlterarSenha(senha)

        msg = 'Foi gerada uma nova senha conforme solicitado. Recomendamos fortemente que você altere sua senha '+ \
              'o quanto antes. Senha:   ' + senha

        send_mail(subject="recuperação de senha auditorio eventos", message=msg,
                  from_email="auditorio@auditorioeventos.com.br", recipient_list=[self.usuario[0].email])
