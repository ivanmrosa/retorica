evento = {
   ir_pagina: function(id_page, id_container){
      mainLib.find('#' + id_container + ' > .page').adCl('hide');
      mainLib.find('#' + id_page).rmCl('hide');
   },

   pgc_gerenciar_evento: function(){
      var container = mainLib.find('#gerenciar-evento-tabs').first();
      if(!container){
          mainLib.dataBinder.getTemplate('gerenciar_eventos',
          function(){
              container = mainLib.find('#gerenciar-evento-tabs').first();
              pgc = new mainLib.pageControl(container);
              pgc.addTab('tbs_criar_editar_evento', 'adicionar/editar evento', mainLib.find('#criar_editar_evento').first());
              pgc.addTab('tbs_gerenciar-periodo-evento', 'períodos do evento', mainLib.find('#gerenciar-periodo-evento').first());
              pgc.addTab('tbs_evento-organizadores', 'organizadores', mainLib.find('#gerenciar-evento-organizadores').first());
              pgc.addTab('tbs_gerenciar-evento-palestrante', 'atrações', mainLib.find('#gerenciar-evento-palestrante').first());
              pgc.addTab('tbs_evento-anexos', 'anexos', mainLib.find('#gerenciar-evento-anexos').first());
              pgc.addTab('tbs_evento-videos', 'vídeos', mainLib.find('#gerenciar-evento-videos').first());
              pgc.addTab('tbs_gerenciar-eventos-tarefas', 'tarefas', mainLib.find('#gerenciar-eventos-tarefas').first());
              pgc.draw();
          });
      };

   },

   abrir_detalhe_evento: function(id_evento){
     var load = function(){
       mainLib.dataBinder.bindServerDataOnTemplate('/evento/detalhe_evento', 'evento_detalhe',
         mainLib.find('#detalhe_evento').first(), 'evento_pk='+id_evento);
       mainLib.popup.openPopup('detalhe_evento');
     };

     if(mainLib.find('#detalhe_evento').first()){
       load();
     }else{
       mainLib.dataBinder.getTemplate('detalhe_evento', load);
     }
   },

   fechar_detalhe_evento: function(){

     var parent = mainLib.find('#detalhe_evento .popup-body').first();
     mainLib.find('#detalhe_evento .popup-body > div:not([data-model])').loop(function(){
       parent.removeChild(this);
     });
     mainLib.popup.closePopup('detalhe_evento');
   },

   abrir_edicao_usuario: function(){
     evento.ir_pagina('dados_usuario_logado','evento_conteudo');
     var load = function(){
        mainLib.dataBinder.removeReplicatedModel('edicao_usuario');
        mainLib.dataBinder.bindServerDataOnTemplate('/obter_usuario', 'edicao_usuario');
     };

     if(mainLib.find("[data-model='edicao_usuario']").first()){
        load();
     }else{
        mainLib.dataBinder.getTemplate('dados_usuario', load);
     };

   },

   carregar_evento_edicao: function(id_evento){
     mainLib.wait.start();
     mainLib.server.get('/evento/detalhe_evento','evento_pk='+id_evento, function(data){
       var row = JSON.parse(data);

       mainLib.dataBinder.removeReplicatedModel('participantes_evento', mainLib.find('#gerenciar-evento-tabs').first());

       for(var a in row[0]){
         if(row[0].hasOwnProperty(a)){
           mainLib.dataBinder.removeReplicatedModel(a, mainLib.find('#gerenciar-evento-tabs').elements[0]);
           mainLib.dataBinder.bindOnTemplate(a, row[0][a], mainLib.find('#gerenciar-evento-tabs').elements[0]);
           mainLib.dataBinder.fillLookup('[data-replicated-model="'+a+'"] [data-lookup-url]');

         };
       };

       mainLib.wait.stop();
       evento.ir_pagina('gerenciar-evento-tabs', 'gerenciar_eventos');

     }, function(data){
       mainLib.wait.stop();
     }

     );
   },

   carregar_participantes_evento: function(){
     mainLib.dataBinder.removeReplicatedModel('participantes_evento', mainLib.find('#gerenciar-evento-tabs').first());
     var id = evento.get_evento_id(true);

     if (!id)
       return false

     mainLib.dataBinder.bindServerDataOnTemplate('evento/lista_participantes/', 'participantes_evento',
       mainLib.find('#gerenciar-evento-tabs').first(), 'evento_pk=' + id);
     evento.ir_pagina('gerenciar-eventos-participantes', 'gerenciar-eventos-tarefas');
   },

   salvar_evento: function(){

     if(!mainLib.canUploadFile){
        mainLib.aviso('Seu navegador não aceita uploads de arquivos.');
        return false;
     };
      mainLib.wait.start();
      mainLib.find('#form-criar-editar-evento [name="evento_privado"]').first().value =
         mainLib.find('#cadastro_evento_evento_privado').first().checked;

      var frm = new FormData(mainLib.find('#form-criar-editar-evento').first());

      mainLib.server.post('/evento/criar_editar_evento', frm,
        function(data){
          mainLib.wait.stop();
          data = JSON.parse(data);

          if(data["ok"] == true){
            mainLib.find('#form-criar-editar-evento [name="id"]').first().value = data["key"];
            mainLib.aviso(data["msg"]);
          }else{
            mainLib.dataBinder.bindValidations("#form-criar-editar-evento", data["msg"]);
          };
        },
        function(data){
          document.write(data);
          document.close;
        }
      )
   },

   get_evento_id: function(valida){
     var id = mainLib.find("#form-criar-editar-evento input[name='id']").first().value;
     if(!id && valida){
       mainLib.aviso('É preciso adicionar ou selecionar um evento antes de realizar esta operaçao');
       return null;
     };
     return id;
   },

   inserir_periodo: function(){
      var id = evento.get_evento_id(true);
      if(!id)
        return false;
      mainLib.wait.start();
      periodo = mainLib.dataBinder.formParser('#gerenciar-periodo-evento form');
      periodo += '&evento_id=' + id;
      mainLib.server.post('/evento/inserir_periodo', periodo,
        function(data){
          data = JSON.parse(data);
          if(data["ok"] == true){
            var frmjs = mainLib.dataBinder.formParserJson('#gerenciar-periodo-evento form');
            frmjs["id"] = data["key"];
            mainLib.dataBinder.bindOnTemplate('periodos', [frmjs],
              mainLib.find('#gerenciar-periodo-evento').first());
            mainLib.wait.stop()
            mainLib.aviso(data["msg"]);
          }else{
            mainLib.dataBinder.bindValidations('#gerenciar-periodo-evento form', data["msg"]);
            mainLib.wait.stop()
          };

        },
        function(data){
          document.write(data);
          document.close;
        }
      )
   },

   remover_item: function(url, id, ele){
     mainLib.confirma('Deseja realmente excluir este registro?',
       function(){
          mainLib.wait.start();
          mainLib.server.post(url, 'id='+id,
           function(data){
             data = JSON.parse(data);
             if(data["ok"] == true){
               ele.parentElement.removeChild(ele);
               mainLib.wait.stop();
               mainLib.aviso(data["msg"]);
             }else{
               mainLib.wait.stop();
             }

           },
           function(data){
             document.write(data);
             document.close;
           }
         );
       }
     );
   },

   inserir_organizador:  function(){
      var search = mainLib.find('#busca_adicionar_organizador').first();
      var id_organizador = search.getAttribute('data-value');
      var text_search = search.value;
      if(!id_organizador){
        mainLib.aviso('Usuário não encontrado nos nossos cadastros. Informe um usuário válido.');
        return false;
      };
      var id_evento = evento.get_evento_id(true);

      if(!id_evento)
        return false;

      mainLib.wait.start()
      mainLib.server.post('/evento/inserir_organizador',
        mainLib.format('organizador_id=%s&evento_id=%s', [id_organizador, id_evento]),
        function(data){
          data = JSON.parse(data);
          if(data["ok"] == true){
            mainLib.dataBinder.bindOnTemplate('organizadores', [{"id":data["key"], "nome":text_search}],
              mainLib.find('#gerenciar-evento-organizadores').first());
            mainLib.wait.stop();
            mainLib.aviso(data["msg"]);
          }else{
            mainLib.wait.stop();
            mainLib.aviso(data["msg"]);
          };

        },
        function(data){
          document.write(data);
          document.close;
        }
      );
   },

   inserir_anexo: function(){
     var evento_id = evento.get_evento_id(true);

     if(!evento_id)
       return false;

     mainLib.wait.start()
     mainLib.find('#gerenciar-evento-anexos form').first().evento_id.value = evento_id;
     frm = new FormData(mainLib.find('#gerenciar-evento-anexos form').first());

     var titulo_anexo = mainLib.find('#gerenciar-evento-anexos form').first().titulo_anexo.value;

     mainLib.server.post('/evento/inserir_anexo', frm,
         function(data){
           data = JSON.parse(data);
           if(data["ok"] == true){
             mainLib.dataBinder.bindOnTemplate('anexos', [{"id":data["key"], "titulo_anexo":titulo_anexo}],
               mainLib.find('#gerenciar-evento-anexos').first());
             mainLib.find('#gerenciar-evento-anexos form').first().reset();
             mainLib.wait.stop();
             mainLib.aviso(data["msg"]);
           }else{
             mainLib.dataBinder.bindValidations('#gerenciar-evento-anexos form', data["msg"]);
             mainLib.wait.stop();
           };
         },
         function(data){
           document.write(data);
           document.close;
         }
     );
   },

   inserir_video: function(){
     var evento_id = evento.get_evento_id(true);

     if(!evento_id)
       return false;

     mainLib.wait.start()
     mainLib.find('#gerenciar-evento-videos form').first().evento_id.value = evento_id;
     frm = new FormData(mainLib.find('#gerenciar-evento-videos form').first());

     var titulo_video = mainLib.find('#gerenciar-evento-videos form').first().titulo_video.value;

     mainLib.server.post('/evento/inserir_video', frm,
         function(data){

           data = JSON.parse(data);
           if(data["ok"] == true){
             mainLib.dataBinder.bindOnTemplate('videos', [{"id":data["key"], "titulo_video":titulo_video}],
               mainLib.find('#gerenciar-evento-videos').first());
             mainLib.find('#gerenciar-evento-videos form').first().reset();
             mainLib.wait.stop();
             mainLib.aviso(data["msg"]);
           }else{
             mainLib.dataBinder.bindValidations('#gerenciar-evento-videos form', data["msg"]);
             mainLib.wait.stop();
           };

         },
         function(data){
           document.write(data);
           document.close;
         }
     );
   },

   limpar_template: function(){
      var parent = mainLib.find('#gerenciar-evento-tabs').first();
      mainLib.dataBinder.removeReplicatedModel('evento', parent);
      mainLib.dataBinder.removeReplicatedModel('local', parent);
      mainLib.dataBinder.removeReplicatedModel('periodos', parent);
      mainLib.dataBinder.removeReplicatedModel('organizadores', parent);
      mainLib.dataBinder.removeReplicatedModel('palestrantes', parent);
      mainLib.dataBinder.removeReplicatedModel('anexos', parent);
      mainLib.dataBinder.removeReplicatedModel('videos', parent);
      mainLib.dataBinder.removeReplicatedModel('participantes_evento', parent);
      mainLib.dataBinder.bindEmptyTemplate('evento', parent);
      mainLib.dataBinder.bindEmptyTemplate('local', parent);
   },

   abrir_periodos: function(evento_id, exclusao){

     var load = function(){
         var popup = mainLib.find('#inscricao_evento').first();
         mainLib.dataBinder.removeReplicatedModel('periodos_evento', popup);
         mainLib.dataBinder.bindServerDataOnTemplate('/evento/lista_periodos', 'periodos_evento', popup,
           'evento_pk='+evento_id);

         if(exclusao === true){
           mainLib.addClass('hidden', mainLib.find('#inscricao_evento [name="inscrever"]').first());
           mainLib.removeClass('hidden', mainLib.find('#inscricao_evento [name="desinscrever"]').first());
           mainLib.find('#inscricao_evento [name="periodo"]').first().setAttribute('data-verificar', "false");
           url = '/evento/deletar_participante';
         }else{
           mainLib.removeClass('hidden', mainLib.find('#inscricao_evento [name="inscrever"]').first());
           mainLib.addClass('hidden', mainLib.find('#inscricao_evento [name="desinscrever"]').first());
           mainLib.find('#inscricao_evento [name="periodo"]').first().setAttribute('data-verificar', "true");
         }

         mainLib.popup.openPopup('inscricao_evento');

     };
     var popup = mainLib.find('#inscricao_evento').first();

     if(popup){
        load();
     }else{
        mainLib.dataBinder.getTemplate('inscricao_evento', load);
     };

   },

   verificar_vagas: function(element){
     if(element.getAttribute('data-verificar') === "true" && element.getAttribute('data-vagas') <= 0){
       return false;
     }
   },

   inserir_deletar_participante: function(exclusao){
     var data = [];
     var periodo;

     var url = '/evento/inserir_participante';

     if(exclusao === true){
       url = '/evento/deletar_participante';
     };

     mainLib.find('#inscricao_evento [data-replicated-model="periodos_evento"]').loop(function(){
        periodo = this.find('[name="periodo"]').first();
        if(periodo.checked === true){
          data.push({"evento_id":this.find('[name="evento"]').first().value,
                     "evento_periodo_id":periodo.value
                    });
        }
     });

     if(data.length === 0){
       mainLib.aviso('Pelo menos uma data deve ser selecionada.');
       return false;
     };
     mainLib.wait.start()
     mainLib.server.post(url, "periodos="+JSON.stringify(data),
       function(data){
         data = JSON.parse(data);

         try{
           //verifica se retornou erro
           mainLib.wait.stop();
           mainLib.aviso(JSON.parse(data["msg"])['__all__'][0]);
         }catch(e){
           var msg = "";


           for(var z = 0; z<data.length; z++){
             msg += "Resultado do processamento do " + (z + 1).toString() + "º dia <br/>";
             msg += "- " + data[z]["msg"] + "<br/><br/>";
           };

           mainLib.aviso(msg);

           if(exclusao != true ){
             var evento_id = mainLib.find('#inscricao_evento [data-replicated-model="periodos_evento"]').first().
               find('[name="evento"]').first().value;
               evento.pagamento_pagseguro(evento_id);
           };


           mainLib.dataBinder.removeReplicatedModel('periodos_evento', mainLib.find('#inscricao_evento').first());
           mainLib.popup.closePopup('inscricao_evento');
         };



       },
       function(data){
         document.write(data);
         document.close;
       }
     );
   },

   forcar_desinscricao_participante : function(participante_id){
     mainLib.server.post('/evento/forcar_exclucao_participante', "id="+participante_id,
       function(data){
         data = JSON.parse(data);
         if(data["ok"]===true){
           var ele = mainLib.find("#gerenciar-eventos-participantes [data-participante-id='"+participante_id+"']").first();
           ele.parentElement.removeChild(ele);
         };

         mainLib.aviso(data["msg"]);

       },
       function(data){
         document.write(data);
         document.close;
       }
     )
   },

   inserir_palestrante:  function(){

      var id_evento = evento.get_evento_id(true);
      var nome = mainLib.find('#palestrante_nome').first().value;
      if(!id_evento)
        return false;

      var frm = new FormData(mainLib.find('#gerenciar-evento-palestrante form').first());
      frm.append('evento_id', id_evento);
      mainLib.wait.start();
      mainLib.server.post('/evento/inserir_palestrante', frm,
        function(data){
          data = JSON.parse(data);
          if(data["ok"] == true){
            mainLib.dataBinder.bindOnTemplate('palestrantes', [{"id":data["key"], "nome":nome}],
              mainLib.find('#gerenciar-evento-palestrante').first());
            mainLib.wait.stop();
            mainLib.aviso(data["msg"]);
            mainLib.find('#gerenciar-evento-palestrante form').first().reset();
          }else{
            mainLib.wait.stop();
            mainLib.dataBinder.bindValidations('#gerenciar-evento-palestrante form', data["msg"]);
          };

        },
        function(data){
          document.write(data);
          document.close;
        }
      );
   },

   inserir_comentario: function(){
     //
     var evento_id = mainLib.find('#detalhe_evento_evento_id').first().value;
     var comentario = mainLib.find('#comentario').first().value;
     if(comentario == "" || !comentario){
       mainLib.aviso('Um comentário deve ser fornecido.');
       return false;
     };
     mainLib.wait.start();
     mainLib.server.post('/evento/inserir_comentario',
       mainLib.format('comentario=%s&evento_id=%s', [comentario, evento_id]),
       function(data){
         data = JSON.parse(data);
         if(data["ok"] == true){
           mainLib.aviso(data["msg"]);
           mainLib.dataBinder.removeReplicatedModel('comentarios', mainLib.find('#evento-comentario').first());

           mainLib.dataBinder.bindServerDataOnTemplate('/evento/lista_eventos_comentarios', 'comentarios',
             mainLib.find('#evento-comentario').first(),  'evento_pk='+evento_id);

           mainLib.find('#comentario').first().value = "";
           mainLib.wait.stop();
         }else{
           mainLib.wait.stop();
           mainLib.aviso(data["msg"]);
         }
       },
       function(data){
         document.write(data);
         document.close;
       }
     );
   },

   pagamento_pagseguro: function(evento_id){
    mainLib.wait.start();
     mainLib.server.post('/evento/pagseguro', "evento_pk=" + evento_id,
       function(data){
         mainLib.wait.stop();
         data = JSON.parse(data);
         if(data["ok"] == true){
           if(data["codigo"] != ""){
             mainLib.aviso("Você será enviado para a página do Pagseguro para realização do pagamento");
             window.open(
               mainLib.format('https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=%s', [data["codigo"]]),
               '_blank'
              )
           };
         }else{
           mainLib.aviso(data["erro"]);
         }
       },
       function(data){
         document.write(data);
         document.close;
       })
   },

   editar_presenca_pagamento: function(id, elem, campo){
      mainLib.server.post('/evento/editar_participantes', mainLib.format("id=%s&%s=%s", [id, campo, elem.checked]),
        function(data){
          data = JSON.parse(data);
          if(data["ok"] != true){
            mainLib.aviso(data["msg"]);
          }
        },
        function(data){
          document.write(data);
          document.close;
        }
      )
   },

   imprimir_cracha: function(usuario_id){
      var evento_id = evento.get_evento_id(true);
      var win = window.open(mainLib.format('/imprimir_cracha?evento_id=%s&usuario_id=%s', [evento_id, usuario_id]),
        'janela', 'height=600,width=400');
      win.focus();
   },
   imprimir_certificado: function(usuario_id){
      var evento_id = evento.get_evento_id(true);
      var win = window.open(mainLib.format('/imprimir_certificado?evento_id=%s&usuario_id=%s', [evento_id, usuario_id]),
        '_blank');
      win.focus();
   },
   imprimir_grafico_genero: function(){
      var evento_id = evento.get_evento_id(true);
      if(!evento_id)
        return false;
      var win = window.open(mainLib.format('/imprimir_grafico_genero?evento_id=%s', [evento_id]),
        'grafico', 'height=600,width=400');
      win.focus();
   },
   imprimir_grafico_localidade: function(){
      var evento_id = evento.get_evento_id(true);
      if(!evento_id)
        return false;
      var win = window.open(mainLib.format('/imprimir_grafico_regiao?evento_id=%s', [evento_id]),
        'grafico', 'height=600,width=400');
      win.focus();
   },
   enviar_email_participantes: function(){
      var frm = mainLib.find('#enviar-email-participantes form').first();

      if(frm.mensagem.value.trim() == ""){
        mainLib.aviso('Uma mensagem deve ser informada.');
        return false;
      };
      if(frm.assunto.value.trim() == ""){
        mainLib.aviso("Um assunto deve ser informado");
        return false;
      };
      var evento_id = evento.get_evento_id(true);

      if(!evento_id)
        return false;
      mainLib.wait.start();
      mainLib.server.post('/evento/enviar_email_participantes',
         mainLib.dataBinder.formParser('#enviar-email-participantes form') + '&evento_pk='+evento_id,
         function(data){
           mainLib.wait.stop();
           data = JSON.parse(data);
           mainLib.aviso(data["msg"])
         },
         function(data){
           document.write(data);
           document.close;
         }
      )

   },
   inserir_convidado: function(){
      var search = mainLib.find('#busca_adicionar_usuario_convite').first();
      var id_convidado = search.getAttribute('data-value');
      var text_search = search.value;

      var data = {"nome":text_search, "id":id_convidado};
      mainLib.dataBinder.bindOnTemplate('convites_usuarios', [data]);

      mainLib.server.post('/evento/enviar_convite', mainLib.format('evento_id=%s&usuario_convidado_id=%s', [evento.get_evento_id(),
        id_convidado]),
        null,
        function(data){
             document.write(data);
            document.close;
        }
      );
   },




}

window.addEventListener('load', function(){

   mainLib.dataBinder.bindServerDataOnTemplate('/obter_usuario', 'dados_perfil_usuario');
   mainLib.dataBinder.bindServerDataOnTemplate('/evento/obter_convites_usuario', 'lista_convites');
   mainLib.dataBinder.bindServerDataOnTemplate('/evento/lista_eventos/', 'evento_lista',
     mainLib.find('#lista_eventos').first(), "evento_privado=False");

  mainLib.find('#pesquisa_evento').first().addEventListener('choose', function(){
    mainLib.dataBinder.removeReplicatedModel('evento_lista');
    mainLib.dataBinder.bindServerDataOnTemplate('/evento/lista_eventos/', 'evento_lista',
      mainLib.find('#lista_eventos').first(), 'id='+this.getAttribute('data-value'));
    evento.ir_pagina('lista_eventos', 'evento_conteudo');
  });

  mainLib.find('#btn-pesquisa_eventos').first().addEventListener('click', function(){
    var pesquisa = mainLib.find('#pesquisa_evento').first().value;

    if(!pesquisa || pesquisa.trim() == "")
      return false

    mainLib.dataBinder.removeReplicatedModel('evento_lista');
    mainLib.dataBinder.bindServerDataOnTemplate('/evento/lista_eventos_filtro', 'evento_lista',
      mainLib.find('#lista_eventos').first(), 'titulo='+pesquisa);

    evento.ir_pagina('lista_eventos', 'evento_conteudo');

  });



});