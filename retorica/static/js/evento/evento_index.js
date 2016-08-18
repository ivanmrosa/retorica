evento = {
   ir_pagina: function(id_page, id_container){
      mainLib.find('#' + id_container + ' > .page').adCl('hidde');
      mainLib.find('#' + id_page).rmCl('hidde');
   },
   pgc_gerenciar_evento: function(){
      pgc = new mainLib.pageControl(mainLib.find('#gerenciar-evento-tabs').first());
      pgc.addTab('tbs_criar_editar_evento', 'adicionar/editar evento', mainLib.find('#criar_editar_evento').first());
      pgc.addTab('tbs_gerenciar-periodo-evento', 'períodos do evento', mainLib.find('#gerenciar-periodo-evento').first());
      pgc.addTab('tbs_evento-organizadores', 'organizadores', mainLib.find('#gerenciar-evento-organizadores').first());
      pgc.addTab('tbs_evento-anexos', 'anexos', mainLib.find('#gerenciar-evento-anexos').first());
      pgc.addTab('tbs_evento-videos', 'vídeos', mainLib.find('#gerenciar-evento-videos').first());
      pgc.addTab('tbs_gerenciar-eventos-tarefas', 'tarefas', mainLib.find('#gerenciar-eventos-tarefas').first());
      pgc.draw();
   },
   abrir_detalhe_evento: function(id_evento){
     mainLib.dataBinder.bindServerDataOnTemplate('/evento/detalhe_evento', 'evento_detalhe',
       mainLib.find('#detalhe_evento').first(), 'evento_pk='+id_evento);
     mainLib.popup.openPopup('detalhe_evento');
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
     mainLib.dataBinder.removeReplicatedModel('edicao_usuario');
     mainLib.dataBinder.bindServerDataOnTemplate('/obter_usuario', 'edicao_usuario');
   },
   carregar_evento_edicao: function(id_evento){

     mainLib.server.get('/evento/detalhe_evento','evento_pk='+id_evento, function(data){
       var row = JSON.parse(data);

       for(var a in row[0]){
         if(row[0].hasOwnProperty(a)){
           mainLib.dataBinder.removeReplicatedModel(a, mainLib.find('#gerenciar-evento-tabs').elements[0]);
           mainLib.dataBinder.bindOnTemplate(a, row[0][a], mainLib.find('#gerenciar-evento-tabs').elements[0]);
           mainLib.dataBinder.fillLookup('[data-replicated-model="'+a+'"] [data-lookup-url]');

         }
       };
       evento.ir_pagina('gerenciar-evento-tabs', 'gerenciar_eventos');

     });
   },
   carregar_participantes_evento: function(){
     mainLib.dataBinder.removeReplicatedModel('participantes_evento', mainLib.find('#gerenciar-evento-tabs').first());
     var id = mainLib.find("#form-criar-editar-evento input[name='id']").elements[0].value;
     mainLib.dataBinder.bindServerDataOnTemplate('evento/lista_participantes/', 'participantes_evento',
       mainLib.find('#gerenciar-evento-tabs').first(), 'evento_pk=' + id);
     evento.ir_pagina('gerenciar-eventos-participantes', 'gerenciar-eventos-tarefas');
   },
   salvar_evento: function(){
      var frm = new FormData(mainLib.find('#form-criar-editar-evento').first());
      frm.set("evento_privado", mainLib.find('#form-criar-editar-evento [name="evento_privado"]').first().checked);

      mainLib.server.post('/evento/criar_editar_evento', frm,
        function(data){
          data = JSON.parse(data);
          if(data["ok"] == true){
            mainLib.find('#form-criar-editar-evento [name="id"]').first().value = data["key"];
            mainLib.aviso(data["msg"]);
          }else{
            mainLib.dataBinder.bindValidations("#form-criar-editar-evento", data["msg"]);
          }
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
            mainLib.aviso(data["msg"]);
          }else{
            mainLib.dataBinder.bindValidations('#gerenciar-periodo-evento form', data["msg"]);
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
          mainLib.server.post(url, 'id='+id,
           function(data){
             data = JSON.parse(data);
             if(data["ok"] == true){
               ele.parentElement.removeChild(ele);
               mainLib.aviso(data["msg"]);
             };
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
      };
      var id_evento = evento.get_evento_id(true);

      if(!id_evento)
        return false;

      mainLib.server.post('/evento/inserir_organizador',
        mainLib.format('organizador_id=%s&evento_id=%s', [id_organizador, id_evento]),
        function(data){
          data = JSON.parse(data);
          if(data["ok"] == true){
            mainLib.dataBinder.bindOnTemplate('organizadores', [{"id":data["key"], "nome":text_search}],
              mainLib.find('#gerenciar-evento-organizadores').first());
            mainLib.aviso(data["msg"]);
          }else{
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

     frm = new FormData(mainLib.find('#gerenciar-evento-anexos form').first());

     frm.append("evento_id", evento_id);

     var titulo_anexo = frm.get("titulo_anexo");

     mainLib.server.post('/evento/inserir_anexo', frm,
         function(data){
           data = JSON.parse(data);
           if(data["ok"] == true){
             mainLib.dataBinder.bindOnTemplate('anexos', [{"id":data["key"], "titulo_anexo":titulo_anexo}],
               mainLib.find('#gerenciar-evento-anexos').first());
             mainLib.find('#gerenciar-evento-anexos form').first().reset();
             mainLib.aviso(data["msg"]);
           }else{
             mainLib.dataBinder.bindValidations('#gerenciar-evento-anexos form', data["msg"]);
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

     frm = new FormData(mainLib.find('#gerenciar-evento-videos form').first());

     frm.append("evento_id", evento_id);

     var titulo_video = frm.get("titulo_video");

     mainLib.server.post('/evento/inserir_video', frm,
         function(data){
           data = JSON.parse(data);
           if(data["ok"] == true){
             mainLib.dataBinder.bindOnTemplate('videos', [{"id":data["key"], "titulo_video":titulo_video}],
               mainLib.find('#gerenciar-evento-videos').first());
             mainLib.find('#gerenciar-evento-videos form').first().reset();
             mainLib.aviso(data["msg"]);
           }else{
             mainLib.dataBinder.bindValidations('#gerenciar-evento-videos form', data["msg"]);
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
      mainLib.dataBinder.removeReplicatedModel('anexos', parent);
      mainLib.dataBinder.removeReplicatedModel('videos', parent);
      mainLib.dataBinder.removeReplicatedModel('participantes_evento', parent);
      mainLib.dataBinder.bindEmptyTemplate('evento', parent);
      mainLib.dataBinder.bindEmptyTemplate('local', parent);
   },

   abrir_periodos: function(evento_id, exclusao){
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
          data.push({"evento_id":this.find('[name="evento"]').first().value, "evento_periodo_id":periodo.value});
        }
     });

     if(data.length === 0){
       mainLib.aviso('Pelo menos uma data deve ser selecionada.');
       return false;
     };

     mainLib.server.post(url, "periodos="+JSON.stringify(data),
       function(data){
         data = JSON.parse(data);
         mainLib.dataBinder.removeReplicatedModel('periodos_evento', mainLib.find('#inscricao_evento').first());
         mainLib.popup.closePopup('inscricao_evento')
         try{
           mainLib.aviso(JSON.parse(data["msg"])['__all__'][0]);
         }catch(e){
           mainLib.aviso(data["msg"]);
         }

       },
       function(data){
         document.write(data);
         document.close;
       }
     );
   }
}

window.addEventListener('load', function(){
  mainLib.dataBinder.bindServerDataOnTemplate('/evento/lista_eventos/', 'evento_lista',
    mainLib.find('#lista_eventos').elements[0]);
});