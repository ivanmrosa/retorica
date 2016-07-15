evento = {
   ir_pagina: function(id_page, id_container){
      mainLib.find('#' + id_container + ' > .page').adCl('hidde');
      mainLib.find('#' + id_page).rmCl('hidde');
   },
   pgc_gerenciar_evento: function(){
      pgc = new mainLib.pageControl(mainLib.find('#gerenciar-evento-tabs').elements[0]);
      pgc.addTab('tbs_criar_editar_evento', 'adicionar/editar evento', mainLib.find('#criar_editar_evento').elements[0]);
      pgc.addTab('tbs_evento-organizadores', 'organizadores', mainLib.find('#gerenciar-evento-organizadores').elements[0]);
      pgc.addTab('tbs_evento-anexos', 'anexos', mainLib.find('#gerenciar-evento-anexos').elements[0]);
      pgc.addTab('tbs_evento-videos', 'vídeos', mainLib.find('#gerenciar-evento-videos').elements[0]);
      pgc.addTab('tbs_gerenciar-eventos-tarefas', 'tarefas', mainLib.find('#gerenciar-eventos-tarefas').elements[0]);
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
   }
}

window.addEventListener('load', function(){
  mainLib.dataBinder.bindServerDataOnTemplate('/evento/lista_eventos/', 'evento_lista',
    mainLib.find('#lista_eventos').elements[0]);
});