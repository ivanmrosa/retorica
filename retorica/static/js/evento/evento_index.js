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
     mainLib.dataBinder.bindServerDataOnTemplate('/evento/detalhe_evento?evento_pk='+id_evento, 'evento_detalhe',
       mainLib.find('#detalhe_evento').elements[0]);
     mainLib.popup.openPopup('detalhe_evento');
   },
   fechar_detalhe_evento: function(){

     var parent = mainLib.find('#detalhe_evento .popup-body').elements[0];
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
      mainLib.server.post('/evento/criar_editar_evento', frm,
        function(data){
          data = JSON.parse(data);
          if(data["ok"] == true){
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
   inserir_periodo: function(){
      var id = mainLib.find("#form-criar-editar-evento input[name='id']").first().value;
      if(!id){
        mainLib.aviso('É preciso adicionar um evento antes de adicionar um período');
        return False;
      };
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
   remover_periodo: function(id, ele){
     mainLib.confirma('Deseja realmente excluir este período?',
       function(){
         mainLib.server.post('/evento/deletar_periodo', 'id='+id,
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
       },
     );
   }
}

window.addEventListener('load', function(){
  mainLib.dataBinder.bindServerDataOnTemplate('/evento/lista_eventos/', 'evento_lista',
    mainLib.find('#lista_eventos').elements[0]);
});