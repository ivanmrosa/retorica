# coding: utf-8
from django.core.serializers.json import DjangoJSONEncoder, json
from django.shortcuts import render, HttpResponse
from .models import UsuarioDetalhe
from django.contrib.auth import authenticate, login
from lib.main_lib import RenderView
from django.core.exceptions import ValidationError
from django.contrib.auth.decorators import login_required
from django.db.models import F


# Create your views here.


def home(request):
    return render(request=request, template_name='usuario/home.html', context={"TITULO": "Retórica - Home"})


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
        print(self.propriedades_requisicao)
        print(self.request.GET)
        return self.SaveModel(model=UsuarioDetalhe, parametros=self.propriedades_requisicao,
                              msg="Usuário cadastrado com sucesso! Agora você está apto a fazer login")

    def EditarUsuario(self):
        self.propriedades_requisicao.update({"id": self.request.user.id})

        return self.SaveModel(model=UsuarioDetalhe, parametros=self.propriedades_requisicao,
                              msg="Usuário alterado com sucesso!", files=self.request.FILES)

    def ObterUsuario(self):
        return json.dumps(list(UsuarioDetalhe.objects.filter(id=self.request.user.id).annotate(
            pais_id=F('cidade__pais__id'),
            estado_id=F('cidade__estado__id')
        ).values(
            'username', 'telefone', 'numero_identidade', 'sexo', 'numero_endereco', 'last_login',
            'email_pagseguro', 'endereco', 'last_name', 'foto_usuario', 'id', 'pais_id', 'estado_id',
            'email', 'first_name', 'cep', 'bairro', 'cpf', 'token_pagseguro', 'email_pagseguro', 'cidade_id'
        )), cls=DjangoJSONEncoder)
