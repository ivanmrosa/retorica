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
from lib.main_lib import RenderView

urlpatterns = [
                  url(r'^$', viewsusuario.home, name='home'),
                  url(r'^login', viewsusuario.UsuarioController.Logar, name="logar"),
                  url(r'^evento/$', viewsevento.evento_index, name='evento_index'),
                  url(r'^evento/lista_eventos/$', viewsevento.EventoController.to_view(method_name='ObtemEventos',
                                                                                       login_required=True,
                                                                                       method_type='GET'),
                      name='lista_eventos'),

                  url(r'^evento/lista_eventos_autocomplete/$',
                      viewsevento.EventoController.to_view(method_name='FiltroEventosResumo',
                                                           login_required=True,
                                                           method_type='GET'),
                      name='lista_eventos_autocomplete'),
                  url(r'^evento/lista_eventos_filtro/$',
                      viewsevento.EventoController.to_view(method_name='FiltroEventos',
                                                           login_required=True,
                                                           method_type='GET'), name='lista_eventos_filtro'),

                  url(r'^evento/detalhe_evento',
                      viewsevento.EventoController.to_view(method_name='ObterDetalhesEvento', login_required=True,
                                                           method_type='GET'), name='detalhe_evento'),
                  url(r'^evento/inserir_comentario',
                      viewsevento.EventoController.to_view(method_name='InserirComentarioEvento', login_required=True,
                                                           method_type='POST'), name='inserir_comentario'),
                  url(r'^evento/lista_eventos_comentarios',
                      viewsevento.EventoController.to_view(method_name='ObtemComentarios', login_required=True,
                                                           method_type='GET'), name='lista_eventos_comentarios'),

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

                  url(r'evento/editar_participantes',
                      viewsevento.EventoController.to_view(method_name='EditarParticipante',
                                                           login_required=True, method_type='POST'),
                      name='editar_participantes'),

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
                  url(r'^evento/forcar_exclucao_participante',
                      viewsevento.EventoController.to_view(method_name='DeletarParticipantePorId', login_required=True,
                                                           method_type='POST'), name='deletar_participante_por_id'),

                  url(r'evento/pagseguro',
                      viewsevento.EventoController.to_view(method_name='PagamentoPagSeguro', login_required=True,
                                                           method_type='POST'), name='pagseguro'),
                  url(r'evento/enviar_email_participantes',
                      viewsevento.EventoController.to_view(method_name='EnviarEmailParticipantes', login_required=True,
                                                           method_type='POST'), name='enviar_email_participantes'),

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

                  url(r'^recuperar_senha', viewsusuario.UsuarioController.to_view(method_name='RecuperarSenha',
                                                                                  login_required=False,
                                                                                  method_type='POST'),
                      name='recuperar_senha'),

                  url(r'localidade/obter_paises',
                      viewslocalidade.LocalidadeController.to_view(method_name='ObterPaises', login_required=False,
                                                                   method_type='GET'), name='obter_paises'),
                  url(r'localidade/obter_estados',
                      viewslocalidade.LocalidadeController.to_view(method_name='ObterEstados', login_required=False,
                                                                   method_type='GET'), name='obter_estados'),
                  url(r'localidade/obter_cidades',
                      viewslocalidade.LocalidadeController.to_view(method_name='ObterCidades', login_required=False,
                                                                   method_type='GET'), name='obter_cidades'),

                  url(r'imprimir_cracha',
                      viewsevento.EventoController.to_view(method_name='ImprimirCracha', login_required=True,
                                                           method_type='GET', return_content_type="text/html"),
                      name='imprimir_cracha'),
                  url(r'imprimir_certificado',
                      viewsevento.EventoController.to_view(method_name='ImprimirCertificado', login_required=True,
                                                           method_type='GET', return_content_type="text/html"),
                      name='imprimir_certificado'),
                  url(r'imprimir_grafico_genero',
                      viewsevento.EventoController.to_view(method_name='ImprimirGraficoGenero', login_required=True,
                                                           method_type='GET', return_content_type="text/html"),
                      name='imprimir_grafico_genero'),
                  url(r'imprimir_grafico_regiao',
                      viewsevento.EventoController.to_view(method_name='ImprimirGraficoRegiao', login_required=True,
                                                           method_type='GET', return_content_type="text/html"),
                      name='imprimir_grafico_regiao'),

                  url(r'enviar_convite',
                      viewsevento.EventoController.to_view(method_name='InserirConvite', login_required=True,
                                                           method_type='POST'), name='enviar_convite'),
                  url(r'deletar_convite',
                      viewsevento.EventoController.to_view(method_name='DeletarConvite', login_required=True,
                                                           method_type='POST'), name='deletar_convite'),
                  url(r'obter_convites_usuario',
                      viewsevento.EventoController.to_view(method_name='ObterConvitesUsuario', login_required=True,
                                                           method_type='GET'), name='obter_convites_usuario'),

                  url(r'template/lista_eventos',
                      RenderView.get_template(template='evento/lista_eventos.html'),
                      name="lista_eventos_template"
                      ),

                  url(r'template/gerenciar_eventos',
                      RenderView.get_template(template='evento/gerenciar_eventos.html'),
                      name="gerenciar_eventos_template"
                      ),
                  url(r'template/detalhe_evento',
                      RenderView.get_template(template='evento/detalhe_evento.html'),
                      name="detalhe_evento_template"
                      ),
                  url(r'template/inscricao_evento',
                      RenderView.get_template(template='evento/inscricao_evento.html'),
                      name="inscricao_evento_template"
                      ),
                  url(r'template/dados_usuario',
                      RenderView.get_template(template='evento/dados_usuario.html'),
                      name="dados_usuario_template"
                      ),

                  url(r'^admin/', admin.site.urls),
                  url(r'^logout/$', 'django.contrib.auth.views.logout_then_login', {'login_url': '/'}),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
