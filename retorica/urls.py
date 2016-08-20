"""retorica URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from usuario import views as viewsusuario
from evento import views as viewsevento
from localidade import views as viewslocalidade
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
                  url(r'^$', viewsusuario.home, name='home'),
                  url(r'^login', viewsusuario.UsuarioController.Logar, name="logar"),
                  url(r'^evento/$', viewsevento.evento_index, name='evento_index'),
                  url(r'^evento/lista_eventos/$', viewsevento.EventoController.to_view(method_name='ListaEventos',
                                                                                       login_required=True,
                                                                                       method_type='GET'),
                      name='lista_eventos'),
                  url(r'^evento/detalhe_evento',
                      viewsevento.EventoController.to_view(method_name='ObterDetalhesEvento', login_required=True,
                                                           method_type='GET'), name='detalhe_evento'),
                  url(r'^evento/lista_eventos_organizador',
                      viewsevento.EventoController.to_view(method_name='ObtemEventosDoOrganizador', login_required=True,
                                                           method_type='GET'), name='lista_eventos_organizador'),
                  url(r'^evento/lista_eventos_participante',
                      viewsevento.EventoController.to_view(method_name='ObtemInscricoesUsuario', login_required=True,
                                                           method_type='GET'), name='lista_eventos_participante'),

                  url(r'evento/lista_participantes',
                      viewsevento.EventoController.to_view(method_name='ObtemParticipantesEvento',
                                                           login_required=True, method_type='GET'),
                      name='lista_participantes'),

                  url(r'evento/lista_periodos',
                      viewsevento.EventoController.to_view(method_name='ObtemPeriodos',
                                                           login_required=True, method_type='GET'),
                      name='lista_participantes'),

                  url(r'evento/lista_tipo_evento',
                      viewsevento.EventoController.to_view(method_name='ObtemTiposEveto',
                                                           login_required=True, method_type='GET'),
                      name='lista_tipo_evento'),

                  url(r'^evento/criar_editar_evento',
                      viewsevento.EventoController.to_view(method_name='InserirEditarEvento', login_required=True,
                                                           method_type='POST'), name='criar_editar_evento'),

                  url(r'^evento/inserir_periodo',
                      viewsevento.EventoController.to_view(method_name='InserirPeriodoEvento', login_required=True,
                                                           method_type='POST'), name='inserir_periodo'),
                  url(r'^evento/deletar_periodo',
                      viewsevento.EventoController.to_view(method_name='DeletarPeriodoEvento', login_required=True,
                                                           method_type='POST'), name='deletar_periodo'),
                  url(r'^evento/inserir_palestrante',
                      viewsevento.EventoController.to_view(method_name='InserirPalestranteEvento', login_required=True,
                                                           method_type='POST'), name='inserir_palestrante'),
                  url(r'^evento/deletar_palesrante',
                      viewsevento.EventoController.to_view(method_name='DeletarPalestranteEvento', login_required=True,
                                                           method_type='POST'), name='deletar_palesrante'),

                  url(r'^evento/inserir_organizador',
                      viewsevento.EventoController.to_view(method_name='InserirOrganizadorEvento', login_required=True,
                                                           method_type='POST'), name='inserir_organizador'),
                  url(r'^evento/deletar_organizador',
                      viewsevento.EventoController.to_view(method_name='DeletarOrganizadorEvento', login_required=True,
                                                           method_type='POST'), name='deletar_organizador'),
                  url(r'^evento/inserir_anexo',
                      viewsevento.EventoController.to_view(method_name='InserirAnexoEvento', login_required=True,
                                                           method_type='POST'), name='inserir_anexo'),
                  url(r'^evento/deletar_anexo',
                      viewsevento.EventoController.to_view(method_name='DeletarAnexoEvento', login_required=True,
                                                           method_type='POST'), name='deletar_anexo'),
                  url(r'^evento/inserir_video',
                      viewsevento.EventoController.to_view(method_name='InserirVideoEvento', login_required=True,
                                                           method_type='POST'), name='inserir_video'),
                  url(r'^evento/deletar_video',
                      viewsevento.EventoController.to_view(method_name='DeletarVideoEvento', login_required=True,
                                                           method_type='POST'), name='deletar_video'),
                  url(r'^evento/inserir_participante',
                      viewsevento.EventoController.to_view(method_name='InserirParticipante', login_required=True,
                                                           method_type='POST'), name='inserir_participante'),
                  url(r'^evento/deletar_participante',
                      viewsevento.EventoController.to_view(method_name='DeletarParticipante', login_required=True,
                                                           method_type='POST'), name='deletar_participante'),

                  url(r'^cadastrar_usuario',
                      viewsusuario.UsuarioController.to_view(method_name='AdicionarUsuario', login_required=False,
                                                             method_type='POST'), name='cadastrar_usuario'),
                  url(r'^editar_usuario',
                      viewsusuario.UsuarioController.to_view(method_name='EditarUsuario', login_required=True,
                                                             method_type='POST'), name='editar_usuario'),

                  url(r'^obter_usuario', viewsusuario.UsuarioController.to_view(method_name='ObterUsuario',
                                                                                login_required=True,
                                                                                method_type='GET'),
                      name='obter_usuario'),
                  url(r'^pesquisar_usuario', viewsusuario.UsuarioController.to_view(method_name='PesquisarUsuario',
                                                                                    login_required=True,
                                                                                    method_type='GET'),
                      name='pesquisar_usuario'),

                  url(r'localidade/obter_paises',
                      viewslocalidade.LocalidadeController.to_view(method_name='ObterPaises', login_required=False,
                                                                   method_type='GET'), name='obter_paises'),
                  url(r'localidade/obter_estados',
                      viewslocalidade.LocalidadeController.to_view(method_name='ObterEstados', login_required=False,
                                                                   method_type='GET'), name='obter_estados'),
                  url(r'localidade/obter_cidades',
                      viewslocalidade.LocalidadeController.to_view(method_name='ObterCidades', login_required=False,
                                                                   method_type='GET'), name='obter_cidades'),

                  url(r'^admin/', admin.site.urls),
                  url(r'^logout/$', 'django.contrib.auth.views.logout_then_login', {'login_url': '/'}),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
